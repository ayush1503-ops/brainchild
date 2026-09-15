import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = {
    Studio: [
      { label: "About Us", href: "#" },
      { label: "Our Games", href: "#games" },
      { label: "News", href: "#news" },
      { label: "Careers", href: "#careers" },
    ],
    Connect: [
      { label: "Discord", href: "#" },
      { label: "Twitter", href: "#" },
      { label: "YouTube", href: "#" },
      { label: "Newsletter", href: "#" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  };

  return (
    <footer className="bg-studio-dark border-t border-studio-muted/10">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="font-display text-2xl font-bold text-studio-light">
              Studio
            </Link>
            <p className="text-studio-muted text-sm mt-4 leading-relaxed">
              Crafting immersive game worlds with passion, precision, and a touch of chaos.
            </p>
          </div>

          {Object.entries(navLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-medium text-studio-light mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-studio-muted/70 hover:text-studio-accent transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-studio-muted/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-studio-muted/50 text-sm">
              © {currentYear} Studio. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-studio-muted/50 hover:text-studio-accent transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-studio-muted/50 hover:text-studio-accent transition-colors"
                aria-label="Discord"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.38-.444.87-.608 1.246C12.098 7.243 8.437 8.13 5.33 7.493a.077.077 0 0 0-.032.03C3.923 7.64 2.57 9.346 2.317 11.41a.077.077 0 0 0 .007.117 18.934 18.934 0 0 0 3.497 6.97.077.077 0 0 0 .092-.015c8.6-2.31 13.476-9.45 12.473-16.584a.061.061 0 0 0-.018-.072.083.083 0 0 0-.073-.034zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-studio-muted/50 hover:text-studio-accent transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}