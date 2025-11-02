import React from 'react';
import { scrollToId } from '../utils/scroll';

const styles: { [k: string]: React.CSSProperties } = {
  footer: {
    background: '#0d4128',
    color: '#f2f7f4',
    padding: '48px 20px 20px',
    marginTop: '48px',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
  },
  topRow: {
    display: 'flex',
    gap: 32,
    flexWrap: 'wrap' as const,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  brandCol: {
    flex: '1 1 260px',
    minWidth: 240,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  logoImg: {
    width: 36,
    height: 36,
    objectFit: 'contain' as const,
    display: 'block',
  },
  brandName: {
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: 0.2,
    color: '#fff',
  },
  brandCopy: {
    fontSize: 14,
    lineHeight: 1.6,
    color: '#dbe7e0',
    margin: 0,
  },
  ctaRow: {
    display: 'flex',
    gap: 12,
    marginTop: 14,
    flexWrap: 'wrap' as const,
  },
  ctaButton: {
    padding: '10px 14px',
    background: '#e7362d',
    color: '#fff',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 14,
  },
  ctaGhost: {
    padding: '10px 14px',
    background: 'transparent',
    color: '#fff',
    borderRadius: 8,
    border: '1px solid #3f7a5e',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
  },
  navCol: {
    flex: '1 1 180px',
    minWidth: 180,
  },
  heading: {
    fontSize: 14,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    color: '#b9d4c7',
    margin: '2px 0 10px',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: 8,
  },
  navLink: {
    color: '#f2f7f4',
    textDecoration: 'none',
    fontSize: 14,
  },
  navLinkHover: {
    textDecoration: 'underline',
  },
  contactCol: {
    flex: '1 1 240px',
    minWidth: 220,
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#dbe7e0',
    fontSize: 14,
    margin: '4px 0',
    textDecoration: 'none',
  },
  socialRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  socialIcon: {
    width: 28,
    height: 28,
    display: 'inline-block',
    borderRadius: 6,
    overflow: 'hidden',
    background: '#0b3722',
    border: '1px solid #2f6e52',
  },
  socialImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block',
  },
  badgeCol: {
    flex: '1 1 220px',
    minWidth: 220,
  },
  badges: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    marginTop: 6,
  },
  badgeImg: {
    height: 40,
    width: 'auto',
    display: 'block',
    background: '#0b3722',
    borderRadius: 8,
    border: '1px solid #2f6e52',
    padding: 6,
  },
  paymentRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    marginTop: 12,
    flexWrap: 'wrap' as const,
  },
  paymentImg: {
    height: 28,
    width: 'auto',
    display: 'block',
    background: '#0b3722',
    borderRadius: 6,
    border: '1px solid #2f6e52',
    padding: 4,
  },
  divider: {
    margin: '20px 0',
    height: 1,
    background: 'linear-gradient(90deg, transparent, #2f6e52, transparent)',
    border: 'none',
  },
  bottomRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    color: '#cfe3da',
    fontSize: 12,
  },
  legalLinks: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap' as const,
  },
  legalLink: {
    color: '#cfe3da',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  const handleNav =
    (id: string): React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> =>
    (e) => {
      e.preventDefault();
      scrollToId(id);
    };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.topRow}>
          <div style={styles.brandCol}>
            <div style={styles.logoRow}>
              <img
                src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090324115-img-logo-mark.png"
                alt="Organic Tomatoes logo"
                style={styles.logoImg}
                loading="lazy"
              />
              <span style={styles.brandName}>Organic Tomatoes</span>
            </div>
            <p style={styles.brandCopy}>
              Farm‑fresh, soil‑grown organic tomatoes picked at peak ripeness. No
              pesticides. No compromise. Just sweet, juicy flavor from our fields to your
              table.
            </p>
            <div style={styles.ctaRow}>
              <button style={styles.ctaButton} onClick={handleNav('order')}>
                Order Now
              </button>
              <button style={styles.ctaGhost} onClick={handleNav('benefits')}>
                Why Ours?
              </button>
            </div>
          </div>

          <nav style={styles.navCol} aria-label="Footer">
            <div style={styles.heading}>Navigate</div>
            <ul style={styles.navList}>
              <li>
                <a href="#hero" style={styles.navLink} onClick={handleNav('hero')}>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#benefits"
                  style={styles.navLink}
                  onClick={handleNav('benefits')}
                >
                  Benefits
                </a>
              </li>
              <li>
                <a href="#order" style={styles.navLink} onClick={handleNav('order')}>
                  Order
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  style={styles.navLink}
                  onClick={handleNav('testimonials')}
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#faq" style={styles.navLink} onClick={handleNav('faq')}>
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          <div style={styles.contactCol}>
            <div style={styles.heading}>Contact</div>
            <a href="mailto:hello@organictomatoes.farm" style={styles.contactItem}>
              hello@organictomatoes.farm
            </a>
            <a href="tel:+1234567890" style={styles.contactItem}>
              +1 (234) 567‑890
            </a>
            <div style={styles.socialRow} aria-label="Social media">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={styles.socialIcon}
                aria-label="Instagram"
              >
                <img
                  src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090384357-img-social-instagram.png"
                  alt="Instagram"
                  style={styles.socialImg}
                  loading="lazy"
                />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={styles.socialIcon}
                aria-label="Facebook"
              >
                <img
                  src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090425876-img-social-facebook.png"
                  alt="Facebook"
                  style={styles.socialImg}
                  loading="lazy"
                />
              </a>
            </div>
          </div>

          <div style={styles.badgeCol}>
            <div style={styles.heading}>Trust & Quality</div>
            <div style={styles.badges}>
              <img
                src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090479649-img-cert-organic.png"
                alt="Certified Organic"
                style={styles.badgeImg}
                loading="lazy"
              />
              <img
                src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090525983-img-cert-pesticide-free.png"
                alt="Pesticide-Free"
                style={styles.badgeImg}
                loading="lazy"
              />
              <img
                src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090574736-img-cert-local.png"
                alt="Locally Grown"
                style={styles.badgeImg}
                loading="lazy"
              />
            </div>
            <div style={styles.paymentRow} aria-label="Accepted payments">
              <img
                src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090635539-img-payment-visa.png"
                alt="Visa"
                style={styles.paymentImg}
                loading="lazy"
              />
              <img
                src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090674984-img-payment-mastercard.png"
                alt="Mastercard"
                style={styles.paymentImg}
                loading="lazy"
              />
              <img
                src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090733170-img-payment-amex.png"
                alt="American Express"
                style={styles.paymentImg}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <hr style={styles.divider} />

        <div style={styles.bottomRow}>
          <div>© {year} Organic Tomatoes. All rights reserved.</div>
          <div style={styles.legalLinks}>
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                alert('Privacy Policy: We only use your info to process orders and newsletter signup.');
              }}
              style={styles.legalLink}
            >
              Privacy
            </a>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                alert('Terms of Sale: All orders subject to availability and seasonal conditions.');
              }}
              style={styles.legalLink}
            >
              Terms
            </a>
            <a href="mailto:hello@organictomatoes.farm" style={styles.legalLink}>
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;