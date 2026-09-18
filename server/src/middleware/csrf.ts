import { NextFunction, Request, Response } from 'express';
import { CSRF_COOKIE, setCsrfCookie } from '../utils/cookies.js';
import { randomToken, safeEqual } from '../utils/crypto.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/** Makes sure a CSRF token exists for the browser session. */
export function ensureCsrfToken(req: Request, res: Response, next: NextFunction): void {
  const existing = req.cookies?.[CSRF_COOKIE];
  if (!existing || typeof existing !== 'string' || existing.length < 20) {
    setCsrfCookie(res, randomToken(24));
  }
  next();
}

/**
 * Double-submit CSRF protection for every state-changing admin request.
 *
 * 1. The token must match the `bc_csrf` cookie exactly (timing-safe compare).
 * 2. If the browser sent an `Origin`, it must be an allowed studio origin
 *    (cross-site form posts always carry an Origin; same-site ones match).
 * 3. `Sec-Fetch-Site: cross-site` is rejected outright when present.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method)) return next();

  const fetchSite = req.get('sec-fetch-site');
  if (fetchSite === 'cross-site') {
    logger.warn('CSRF: cross-site request rejected', { path: req.originalUrl, fetchSite });
    res.status(403).json({ error: 'Cross-site request blocked.', code: 'csrf_failed' });
    return;
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.get('x-csrf-token');

  if (!cookieToken || !headerToken || typeof cookieToken !== 'string') {
    res.status(403).json({
      error: 'Security token missing or expired. Please refresh the page and try again.',
      code: 'csrf_missing',
    });
    return;
  }

  if (!safeEqual(cookieToken, headerToken)) {
    logger.warn('CSRF: token mismatch', { path: req.originalUrl });
    res.status(403).json({ error: 'Security token invalid.', code: 'csrf_failed' });
    return;
  }

  const origin = req.get('origin');
  if (origin) {
    const normalised = origin.replace(/\/$/, '');
    const host = req.get('host');
    let sameOrigin = false;
    try {
      sameOrigin = !!host && new URL(origin).host === host;
    } catch {
      sameOrigin = false;
    }
    if (!config.frontendOrigins.includes(normalised) && !sameOrigin) {
      logger.warn('CSRF: untrusted origin', { origin, path: req.originalUrl });
      res.status(403).json({ error: 'Origin not allowed.', code: 'origin_not_allowed' });
      return;
    }
  }

  next();
}
