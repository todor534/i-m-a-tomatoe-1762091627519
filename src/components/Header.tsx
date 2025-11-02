import React, { useEffect, useMemo, useState } from 'react';

type NavItem = {
  label: string;
  id: string;
};

const navItems: NavItem[] = [
  { label: 'Benefits', id: 'benefits' },
  { label: 'Testimonials', id: 'testimonials' },
  { label: 'FAQ', id: 'faq' },
];

const styles: { [k: string]: React.CSSProperties } = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    width: '100%',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'saturate(160%) blur(10px)',
    WebkitBackdropFilter: 'saturate(160%) blur(10px)',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    color: '#1a1a1a',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    objectFit: 'cover',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  titleWrap: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1,
  },
  title: {
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#5d6b60',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: 0,
    padding: 0,
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    borderRadius: 8,
    color: '#2a2a2a',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 14,
    transition: 'background-color 160ms ease, color 160ms ease, transform 120ms ease',
  },
  linkHover: {
    backgroundColor: 'rgba(234, 67, 53, 0.08)',
    color: '#c62828',
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'linear-gradient(135deg, #ff5a3c 0%, #d62828 100%)',
    color: '#fff',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 10,
    fontWeight: 800,
    fontSize: 14,
    cursor: 'pointer',
    boxShadow: '0 8px 18px rgba(214, 40, 40, 0.25), 0 2px 6px rgba(0,0,0,0.06)',
    transition: 'transform 80ms ease, box-shadow 160ms ease, opacity 160ms ease',
  },
  ctaHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 10px 22px rgba(214, 40, 40, 0.3), 0 3px 8px rgba(0,0,0,0.08)',
  },
  badge: {
    backgroundColor: '#1b5e20',
    color: '#fff',
    fontSize: 10,
    fontWeight: 800,
    padding: '3px 6px',
    borderRadius: 999,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  hamburger: {
    appearance: 'none',
    border: '1px solid rgba(0,0,0,0.1)',
    background: '#ffffff',
    padding: '8px 10px',
    borderRadius: 10,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    color: '#1a1a1a',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  hamburgerBars: {
    width: 18,
    height: 2,
    background: '#1a1a1a',
    position: 'relative',
    borderRadius: 2,
  },
  hamburgerBarsBeforeAfter: {
    content: '""',
    position: 'absolute' as const,
    left: 0,
    width: 18,
    height: 2,
    background: '#1a1a1a',
    borderRadius: 2,
  },
  mobileMenu: {
    position: 'fixed',
    top: 64,
    left: 12,
    right: 12,
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 14,
    boxShadow: '0 24px 40px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.06)',
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    zIndex: 70,
  },
  mobileLink: {
    padding: '12px 14px',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textDecoration: 'none',
    color: '#1a1a1a',
    fontWeight: 700,
  },
  mobileDivider: {
    height: 1,
    background: 'rgba(0,0,0,0.06)',
    margin: '8px 0',
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
};

function useHover<T extends HTMLElement>(): [React.RefObject<T>, boolean] {
  const ref = React.useRef<T>(null);
  const [hovered, setHovered] = React.useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);
  return [ref, hovered];
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const headerOffset = 72;
  const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

export default function Header() {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 900 : true
  );
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ctaRef, ctaHover] = useHover<HTMLButtonElement>();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    const onScroll = () => setScrolled(window.scrollY > 4);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    onResize();
    onScroll();
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  const headerStyle = useMemo<React.CSSProperties>(() => {
    return {
      ...styles.header,
      boxShadow: scrolled ? '0 4px 18px rgba(0,0,0,0.08)' : '0 1px 0 rgba(0,0,0,0.04)',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.06)',
    };
  }, [scrolled]);

  const onNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(id);
  };

  const onHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header style={headerStyle} role="banner">
      <div style={styles.container}>
        <a href="/" onClick={onHomeClick} style={styles.brand} aria-label="Go to top">
          <img
            src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762091237124-img-logo.png"
            width={36}
            height={36}
            alt="Organic Tomatoes logo"
            style={styles.logo}
          />
          <span style={styles.titleWrap}>
            <span style={styles.title}>Organic Tomatoes</span>
            <span style={styles.subtitle}>From our soil to your table</span>
          </span>
        </a>

        {!isMobile ? (
          <nav style={styles.nav} aria-label="Primary">
            <ul style={styles.navList}>
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={onNavClick(item.id)}
                    style={styles.link}
                    onMouseEnter={(e) =>
                      Object.assign((e.currentTarget as HTMLElement).style, styles.linkHover)
                    }
                    onMouseLeave={(e) =>
                      Object.assign((e.currentTarget as HTMLElement).style, styles.link)
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              ref={ctaRef}
              style={{ ...styles.cta, ...(ctaHover ? styles.ctaHover : {}) }}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('order');
              }}
            >
              Order Now
              <span style={styles.badge}>Fresh</span>
            </button>
          </nav>
        ) : (
          <div>
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              style={styles.hamburger}
            >
              <span style={{ ...styles.hamburgerBars }}>
                <span
                  style={{
                    ...styles.hamburgerBarsBeforeAfter,
                    top: -6,
                  }}
                />
                <span
                  style={{
                    ...styles.hamburgerBarsBeforeAfter,
                    top: 6,
                  }}
                />
              </span>
              Menu
            </button>
          </div>
        )}
      </div>

      {isMobile && open && (
        <div id="mobile-menu" style={styles.mobileMenu} role="dialog" aria-modal="true">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={onNavClick(item.id)}
              style={styles.mobileLink}
            >
              {item.label}
              <span style={{ fontSize: 12, color: '#647067' }}>Tap to view</span>
            </a>
          ))}
          <div style={styles.mobileDivider} />
          <button
            style={styles.cta}
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              scrollToSection('order');
            }}
          >
            Order Now
            <span style={styles.badge}>Fresh</span>
          </button>
          <p style={{ margin: '8px 2px 0', fontSize: 12, color: '#5d6b60' }}>
            Grown without pesticides. Harvested to order.
          </p>
          <span style={styles.srOnly}>Press Esc to close menu</span>
        </div>
      )}
    </header>
  );
}