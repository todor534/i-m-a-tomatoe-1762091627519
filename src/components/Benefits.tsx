import type { CSSProperties } from 'react';

const styles: Record<string, CSSProperties> = {
  section: {
    background: '#ffffff',
    padding: '64px 20px',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
  },
  heading: {
    fontSize: '2rem',
    lineHeight: 1.2,
    fontWeight: 800,
    color: '#111827',
    margin: 0,
  },
  subheading: {
    marginTop: 10,
    fontSize: '1.125rem',
    color: '#4b5563',
    maxWidth: 780,
  },
  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: '#ecfdf5',
    color: '#065f46',
    border: '1px solid #a7f3d0',
    padding: '6px 12px',
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.2,
  },
  badgeIcon: {
    width: 16,
    height: 16,
    borderRadius: 4,
    objectFit: 'cover',
    background: '#ffffff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20,
    marginTop: 28,
  },
  card: {
    background: '#fafaf9',
    border: '1px solid #efefee',
    borderRadius: 14,
    padding: 20,
    boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
  },
  iconWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 12,
    background: '#ffffff',
    border: '1px solid #f0f0f0',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  },
  icon: {
    width: 36,
    height: 36,
    objectFit: 'contain',
  },
  cardTitle: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#111827',
  },
  cardText: {
    margin: 0,
    color: '#4b5563',
    fontSize: '0.975rem',
    lineHeight: 1.5,
  },
  ctaWrap: {
    marginTop: 30,
    textAlign: 'center',
  },
  ctaButton: {
    background: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '14px 22px',
    borderRadius: 9999,
    fontWeight: 800,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 10px 22px rgba(220,38,38,0.25)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
  },
  ctaNote: {
    marginTop: 10,
    color: '#6b7280',
    fontSize: '0.9rem',
  },
};

export default function Benefits() {
  const scrollToOrder = () => {
    const el = document.getElementById('order');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="benefits" style={styles.section} aria-label="Benefits of our organic tomatoes">
      <div style={styles.container}>
        <h2 style={styles.heading}>Why Choose Our Organic Tomatoes</h2>
        <p style={styles.subheading}>
          Grown in living soil, picked to order, and delivered farm-fresh for the sweetest, juiciest bite of the season.
        </p>

        <div style={styles.badges} aria-label="Quality badges">
          <span style={styles.badge}>
            <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090873627-img-leaf.png" alt="" style={styles.badgeIcon} />
            USDA Organic
          </span>
          <span style={styles.badge}>
            <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090923477-img-seed.png" alt="" style={styles.badgeIcon} />
            Non‑GMO
          </span>
          <span style={styles.badge}>
            <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090970881-img-box.png" alt="" style={styles.badgeIcon} />
            Plastic‑free packaging
          </span>
          <span style={styles.badge}>
            <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762091013430-img-clock.png" alt="" style={styles.badgeIcon} />
            Picked to order
          </span>
        </div>

        <div style={styles.grid}>
          <article style={styles.card}>
            <div style={styles.iconWrap}>
              <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762091065139-img-ripe.png" alt="Vine-ripened tomato icon" style={styles.icon} />
            </div>
            <h3 style={styles.cardTitle}>Vine‑Ripened Freshness</h3>
            <p style={styles.cardText}>
              Harvested the morning of delivery for peak sweetness, juiciness, and that sun‑kissed aroma you can only get from truly fresh tomatoes.
            </p>
          </article>

          <article style={styles.card}>
            <div style={styles.iconWrap}>
              <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762091110698-img-shield-leaf.png" alt="Organic shield icon" style={styles.icon} />
            </div>
            <h3 style={styles.cardTitle}>100% Organic Growing</h3>
            <p style={styles.cardText}>
              No synthetic pesticides or fertilizers—just healthy soil, beneficial insects, and compost‑rich beds that nourish every plant naturally.
            </p>
          </article>

          <article style={styles.card}>
            <div style={styles.iconWrap}>
              <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762091156675-img-taste.png" alt="Flavor icon" style={styles.icon} />
            </div>
            <h3 style={styles.cardTitle}>Unbeatable Flavor</h3>
            <p style={styles.cardText}>
              Heirloom and premium varieties selected for rich, balanced flavor—perfect for caprese, sauces, or eating with a pinch of salt.
            </p>
          </article>

          <article style={styles.card}>
            <div style={styles.iconWrap}>
              <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762091205060-img-truck.png" alt="Delivery truck icon" style={styles.icon} />
            </div>
            <h3 style={styles.cardTitle}>Fast Local Delivery</h3>
            <p style={styles.cardText}>
              Chilled after harvest and delivered within 24 hours in recyclable packaging to lock in quality from field to table.
            </p>
          </article>
        </div>

        <div style={styles.ctaWrap}>
          <button
            type="button"
            style={styles.ctaButton}
            onClick={scrollToOrder}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(1px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 14px rgba(220,38,38,0.25)';
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.98';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 22px rgba(220,38,38,0.25)';
              (e.currentTarget as HTMLButtonElement).style.opacity = '1';
            }}
          >
            Order Your Tomatoes
          </button>
          <div style={styles.ctaNote}>Free local delivery on orders over $30</div>
        </div>
      </div>
    </section>
  );
}