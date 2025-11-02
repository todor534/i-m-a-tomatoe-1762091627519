import React from 'react';
import { scrollToId } from '../utils/scroll';

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    background: 'linear-gradient(135deg, #ffefe9 0%, #fff7f2 40%, #ffffff 100%)',
    padding: '48px 16px',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 32,
    flexWrap: 'wrap',
  },
  left: {
    flex: '1 1 440px',
    minWidth: 280,
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: '#ffe2dc',
    color: '#b62525',
    padding: '8px 12px',
    borderRadius: 999,
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 16,
  },
  tomatoDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#e53935',
    boxShadow: '0 0 0 3px rgba(229,57,53,0.15)',
  },
  h1: {
    fontSize: 44,
    lineHeight: 1.1,
    letterSpacing: -0.5,
    margin: '0 0 12px',
    color: '#1d1d1f',
  },
  sub: {
    fontSize: 18,
    lineHeight: 1.6,
    color: '#4b5563',
    margin: '0 0 24px',
    maxWidth: 640,
  },
  ctas: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  primaryBtn: {
    appearance: 'none',
    border: 'none',
    background: '#e53935',
    color: '#fff',
    padding: '14px 20px',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(229,57,53,0.25)',
    transition: 'transform 120ms ease',
  },
  secondaryBtn: {
    appearance: 'none',
    border: '2px solid #e53935',
    background: 'transparent',
    color: '#e53935',
    padding: '12px 18px',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 120ms ease',
  },
  trustRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    color: '#374151',
    fontSize: 14,
  },
  check: {
    color: '#16a34a',
    fontWeight: 700,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: '#d1d5db',
  },
  right: {
    flex: '1 1 420px',
    minWidth: 280,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
    background: '#fff',
    width: '100%',
    maxWidth: 540,
    position: 'relative',
  },
  heroImg: {
    display: 'block',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
  },
  floatBadge: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'saturate(140%) blur(4px)',
    borderRadius: 14,
    padding: '10px 12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
  },
  badgeImg: {
    width: 28,
    height: 28,
    objectFit: 'contain',
  },
  badgeTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: 800,
    color: '#065f46',
  },
  badgeSub: {
    fontSize: 12,
    color: '#065f46',
    opacity: 0.8,
  },
  ribbon: {
    position: 'absolute',
    top: 12,
    right: -40,
    transform: 'rotate(35deg)',
    background: '#b62525',
    color: '#fff',
    padding: '8px 60px',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.6,
    boxShadow: '0 8px 20px rgba(182,37,37,0.28)',
  },
};

export default function Hero() {
  const handleOrderClick = () => {
    scrollToId('order');
  };

  const handleBenefitsClick = () => {
    scrollToId('benefits');
  };

  return (
    <section id="hero" style={styles.section} aria-label="Hero section">
      <div style={styles.container}>
        <div style={styles.left}>
          <div style={styles.pill} aria-label="Organic, local, hand-picked">
            <span style={styles.tomatoDot} />
            Sun‑ripened Organic Tomatoes
          </div>
          <h1 style={styles.h1}>
            Farm‑fresh organic tomatoes,
            delivered this week.
          </h1>
          <p style={styles.sub}>
            Picked at peak flavor early morning and delivered the same day.
            No chemicals, no middlemen—just juicy, vine‑ripened goodness
            from our fields to your table.
          </p>

          <div style={styles.ctas}>
            <button
              type="button"
              style={styles.primaryBtn}
              onClick={handleOrderClick}
              aria-label="Order tomatoes now"
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              Order Now — Fresh This Week
            </button>
            <button
              type="button"
              style={styles.secondaryBtn}
              onClick={handleBenefitsClick}
              aria-label="See benefits"
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              Why Our Tomatoes
            </button>
          </div>

          <div style={styles.trustRow}>
            <span style={styles.check}>✓</span>
            Picked same‑day
            <span style={styles.dot} />
            Free local delivery over $25
            <span style={styles.dot} />
            100% Organic Certified
            <span style={styles.dot} />
            Taste guarantee
          </div>
        </div>

        <div style={styles.right} aria-hidden="false">
          <div style={styles.heroCard}>
            <img
              src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090791321-img-hero-tomatoes.png"
              alt="Basket of vine‑ripened organic tomatoes just picked from the farm"
              style={styles.heroImg}
            />
            <div style={styles.ribbon}>LIMITED HARVEST</div>
            <div style={styles.floatBadge}>
              <img
                src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090832383-img-badge-organic.png"
                alt="Organic certification badge"
                style={styles.badgeImg}
              />
              <div style={styles.badgeTextWrap}>
                <span style={styles.badgeTitle}>Certified Organic</span>
                <span style={styles.badgeSub}>No pesticides. Ever.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}