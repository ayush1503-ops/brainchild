import 'dotenv/config';
import http from 'http';

const API_BASE = 'http://localhost:3001/api';

async function makeRequest(path: string, options: { method?: string; headers?: Record<string, string>; body?: any } = {}) {
  const url = new URL(`${API_BASE}${path}`);
  const postData = options.body ? JSON.stringify(options.body) : '';

  return new Promise<{ status: number; data: any }>((resolve, reject) => {
    const req = http.request(
      url,
      {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          ...options.headers
        }
      },
      (res) => {
        let raw = '';
        res.on('data', chunk => { raw += chunk; });
        res.on('end', () => {
          let parsed = raw;
          try { parsed = JSON.parse(raw); } catch {}
          resolve({ status: res.statusCode || 500, data: parsed });
        });
      }
    );
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runSecurityTests() {
  console.log('🔒 Starting Security Assertion Test Suite...\n');
  let totalPassed = 0;
  let totalFailed = 0;

  function assert(name: string, condition: boolean, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASSED: ${name}`);
      totalPassed++;
    } else {
      console.log(`  ❌ FAILED: ${name} ${detail ? `(${detail})` : ''}`);
      totalFailed++;
    }
  }

  try {
    // 1. Unauthenticated access check
    const unauthRes = await makeRequest('/users');
    assert(
      'Unauthenticated request to /api/users is blocked (401)',
      unauthRes.status === 401,
      `Received status ${unauthRes.status}`
    );

    // 2. Health check endpoint (Public)
    const healthRes = await makeRequest('/health');
    assert('Public health endpoint returns 200 OK', healthRes.status === 200);

    // 3. SQL Injection Defense Test in Search Input
    const sqliPayload = "'; OR 1=1; UNION SELECT * FROM admin_users--";
    const sqliRes = await makeRequest(`/games/public?search=${encodeURIComponent(sqliPayload)}`);
    assert(
      'SQL Injection payload in search does not break server or execute SQL',
      sqliRes.status === 200 && Array.isArray(sqliRes.data?.games || sqliRes.data),
      `Received status ${sqliRes.status}`
    );

    // 4. SQL Injection Defense Test in Login Email
    const sqliLoginRes = await makeRequest('/auth/login', {
      method: 'POST',
      body: { email: "' OR '1'='1", password: 'password123' }
    });
    assert(
      'SQL Injection payload in login email fails cleanly with 401 without SQL error',
      sqliLoginRes.status === 401 && sqliLoginRes.data?.error === 'Invalid credentials',
      `Received status ${sqliLoginRes.status}`
    );

    // 5. XSS Payload Handling Test
    const xssPayload = "<script>alert('XSS')</script><img src=x onerror=alert(1)>";
    const xssRes = await makeRequest('/subscribers', {
      method: 'POST',
      body: { email: `test-${Date.now()}@example.com`, name: xssPayload, interests: ['Aetherbound'] }
    });
    assert(
      'XSS payload in subscription form is handled cleanly',
      xssRes.status === 200 || xssRes.status === 201,
      `Received status ${xssRes.status}`
    );

    // 6. Mass Assignment Protection Check
    const massAssignRes = await makeRequest('/auth/login', {
      method: 'POST',
      body: { email: 'admin@brainchild.games', password: 'wrongpassword', role: 'SUPER_ADMIN', isAdmin: true }
    });
    assert(
      'Mass assignment attempt on login body does not bypass auth',
      massAssignRes.status === 401,
      `Received status ${massAssignRes.status}`
    );

    // 7. Non-existent ID (IDOR / Path Traversal) Check
    const idorRes = await makeRequest('/games/non-existent-id-99999');
    assert(
      'Non-existent resource ID returns 404 cleanly without exposing DB errors or stack traces',
      idorRes.status === 404,
      `Received status ${idorRes.status}`
    );

    console.log(`\n========================================`);
    console.log(`Security Test Results: ${totalPassed} Passed, ${totalFailed} Failed`);
    console.log(`========================================\n`);

    if (totalFailed > 0) {
      process.exit(1);
    }
  } catch (error: any) {
    console.error('Security test runner error:', error.message);
    process.exit(1);
  }
}

runSecurityTests();
