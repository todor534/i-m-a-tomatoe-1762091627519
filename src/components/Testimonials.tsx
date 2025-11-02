import React from 'react';

type Testimonial = {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Maria S.',
    location: 'Greenfield',
    text:
      'These tomatoes taste like summer sunshine. I use them for salads and fresh salsa—the flavor is unreal and they last longer than store-bought.',
    rating: 5,
    avatar: 'https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090029080-img-customer-maria.png',
  },
  {
    id: 't2',
    name: 'Liam R.',
    location: 'Oakridge',
    text:
      'Picked at peak ripeness, incredibly sweet and juicy. My kids snack on them like candy. You can really tell they’re grown with care.',
    rating: 5,
    avatar: 'https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090087276-img-customer-liam.png',
  },
  {
    id: 't3',
    name: 'Ava K.',
    location: 'Maple Town',
    text:
      'Made the best marinara of my life. Thick flesh, low acidity, and that true tomato aroma. I’m on a weekly subscription now.',
    rating: 5,
    avatar: 'https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090144587-img-customer-ava.png',
  },
  {
    id: 't4',
    name: 'Noah T.',
    location: 'Riverside',
    text:
      'Crisp skins, zero mush, and consistent quality. Love that they’re organic and local. Delivery was right on time.',
    rating: 4,
    avatar: 'https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090201697-img-customer-noah.png',
  },
];

const styles: { [k: string]: React.CSSProperties } = {
  section: {
    position: 'relative',
    padding: '72px 16px',
    background: 'linear-gradient(180deg, #fffaf7 0%, #ffffff 100%)',
    overflow: 'hidden',
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
  },
  headerWrap: {
    textAlign: 'center',
    marginBottom: 28,
  },
  kicker: {
    display: 'inline-block',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#c0362c',
    background: 'rgba(192,54,44,0.08)',
    border: '1px solid rgba(192,54,44,0.18)',
    padding: '6px 10px',
    borderRadius: 999,
  },
  title: {
    margin: '12px 0 8px',
    fontSize: 32,
    lineHeight: 1.2,
    fontWeight: 800,
    color: '#1b1b1b',
  },
  subtitle: {
    margin: '0 auto',
    maxWidth: 720,
    color: '#5a5a5a',
    fontSize: 16,
  },
  metrics: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 14,
    color: '#2b2b2b',
    fontSize: 14,
  },
  starGroup: {
    display: 'inline-flex',
    gap: 2,
  },
  star: {
    color: '#ff9f1a',
    fontSize: 16,
    lineHeight: 1,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 18,
    marginTop: 22,
  },
  card: {
    position: 'relative',
    background: '#ffffff',
    border: '1px solid #eee',
    borderRadius: 14,
    padding: 18,
    boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
  },
  quoteMark: {
    position: 'absolute',
    top: 10,
    right: 14,
    fontSize: 28,
    color: 'rgba(192,54,44,0.18)',
    userSelect: 'none',
  },
  person: {
    display: 'grid',
    gridTemplateColumns: '44px 1fr',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    backgroundColor: '#f4f4f4',
  },
  name: {
    margin: 0,
    color: '#202020',
    fontSize: 15,
    fontWeight: 700,
  },
  meta: {
    margin: 0,
    color: '#6b6b6b',
    fontSize: 13,
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    margin: '6px 0 8px',
  },
  text: {
    color: '#333',
    fontSize: 15,
    lineHeight: 1.55,
    margin: 0,
  },
  ctaBar: {
    marginTop: 26,
    textAlign: 'center',
  },
  ctaLink: {
    display: 'inline-block',
    padding: '10px 16px',
    background: '#c0362c',
    color: '#fff',
    borderRadius: 10,
    border: '1px solid #a22b23',
    fontWeight: 700,
    fontSize: 15,
    textDecoration: 'none',
    boxShadow: '0 6px 14px rgba(192,54,44,0.25)',
  },
  decoLeft: {
    position: 'absolute',
    left: -40,
    bottom: -24,
    width: 140,
    height: 140,
    backgroundImage: 'url("https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090240893-img-tomato-vine-left.png")',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    opacity: 0.12,
    pointerEvents: 'none',
  },
  decoRight: {
    position: 'absolute',
    right: -30,
    top: -10,
    width: 120,
    height: 120,
    backgroundImage: 'url("https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090275178-img-tomato-slice-right.png")',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    opacity: 0.1,
    transform: 'rotate(-8deg)',
    pointerEvents: 'none',
  },
};

function Stars({ value }: { value: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(value));
  return (
    <span style={styles.starGroup} aria-hidden="true">
      {stars.map((filled, i) => (
        <span key={i} style={styles.star}>
          {filled ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}

export default function Testimonials(): JSX.Element {
  const avg =
    Math.round(
      ((testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length) + Number.EPSILON) *
        10
    ) / 10;

  return (
    <section id="testimonials" aria-label="Customer testimonials" style={styles.section}>
      <div aria-hidden="true" style={styles.decoLeft} />
      <div aria-hidden="true" style={styles.decoRight} />
      <div style={styles.inner}>
        <div style={styles.headerWrap}>
          <span style={styles.kicker}>Loved by locals</span>
          <h2 style={styles.title}>Real words from happy tomato lovers</h2>
          <p style={styles.subtitle}>
            Hand-grown, organic tomatoes from our soil to your table. Here’s what neighbors say
            after tasting the difference.
          </p>
          <div style={styles.metrics}>
            <Stars value={5} />
            <span aria-label={`Average rating ${avg} out of 5`} role="text">
              {avg} average rating · {testimonials.length}+ reviews
            </span>
          </div>
        </div>

        <div style={styles.grid}>
          {testimonials.map((t) => (
            <article key={t.id} style={styles.card} aria-label={`Testimonial from ${t.name}`}>
              <div style={styles.quoteMark} aria-hidden="true">“</div>
              <div style={styles.person}>
                <img
                  src={t.avatar}
                  alt={`${t.name} from ${t.location}`}
                  loading="lazy"
                  width={44}
                  height={44}
                  style={styles.avatar}
                />
                <div>
                  <p style={styles.name}>{t.name}</p>
                  <p style={styles.meta}>{t.location}</p>
                </div>
              </div>
              <div style={styles.ratingRow}>
                <Stars value={t.rating} />
                <span className="sr-only">{t.rating} out of 5 stars</span>
              </div>
              <p style={styles.text}>{t.text}</p>
            </article>
          ))}
        </div>

        <div style={styles.ctaBar}>
          <a href="#order" style={styles.ctaLink}>
            Taste for yourself — order now
          </a>
        </div>
      </div>
    </section>
  );
}