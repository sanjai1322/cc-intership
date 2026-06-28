import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-bg-offwhite)] border-t border-[var(--color-border-light)] py-16">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Code Constellation Logo"
                className="w-8 h-8 object-contain rounded-lg"
              />
              <span className="font-[var(--font-syne)] font-bold text-xl text-[var(--color-text-dark)]">
                Code Constellation
              </span>
            </div>
            <p className="text-[var(--color-text-body)] text-sm max-w-sm leading-relaxed">
              We Build It. You Just Present It. Premium project-based internships
              to accelerate your career.
            </p>
            <div className="text-sm font-medium text-[var(--color-text-body)]">
              UDYAM-TN-04-0129239
            </div>
          </div>

          {/* Links Col */}
          <div>
            <h4 className="font-[var(--font-syne)] font-bold text-[var(--color-text-dark)] mb-6 uppercase text-sm tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/#tracks"
                  className="text-sm text-[var(--color-text-body)] hover:text-[var(--color-primary-blue)] transition-colors"
                >
                  Internship Tracks
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-sm text-[var(--color-text-body)] hover:text-[var(--color-primary-blue)] transition-colors"
                >
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/apply"
                  className="text-sm text-[var(--color-text-body)] hover:text-[var(--color-primary-blue)] transition-colors"
                >
                  Apply Now
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/applications"
                  className="text-sm text-[var(--color-text-body)] hover:text-[var(--color-primary-blue)] transition-colors"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="font-[var(--font-syne)] font-bold text-[var(--color-text-dark)] mb-6 uppercase text-sm tracking-wider">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:codeconstellation.business@gmail.com"
                  className="flex items-center gap-3 text-sm text-[var(--color-text-body)] hover:text-[var(--color-primary-blue)] transition-colors"
                >
                  <Mail size={16} />
                  codeconstellation.business@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/codeconstellation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-[var(--color-text-body)] hover:text-[var(--color-primary-blue)] transition-colors"
                >
                  <span className="font-bold">IG</span>
                  @codeconstellation
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--color-text-body)]">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                <span>Chennai, Tamil Nadu, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-border-light)] text-center">
          <p className="text-[var(--color-text-muted)] text-sm">
            © {currentYear} Code Constellation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
