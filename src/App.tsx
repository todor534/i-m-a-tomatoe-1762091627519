import React, { useEffect, useMemo, useState } from 'react';

type BoxSize = 'small' | 'medium' | 'family';
type DeliveryMethod = 'pickup' | 'delivery';

type OrderPayload = {
  fullName: string;
  email: string;
  phone?: string;
  size: BoxSize;
  quantity: number;
  delivery: DeliveryMethod;
  address?: string;
  notes?: string;
  promoCode?: string;
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    color: '#13221E',
    backgroundColor: '#FAFBFA',
    lineHeight: 1.45,
  },
  container: {
    width: '100%',
    maxWidth: 1120,
    margin: '0 auto',
    padding: '0 20px',
  },
  topNotice: {
    background: '#0E7A39',
    color: '#E9FFF3',
    fontWeight: 600,
    fontSize: 14,
    textAlign: 'center',
    padding: '8px 12px',
  },
  headerWrap: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'saturate(180%) blur(10px)',
    borderBottom: '1px solid #E6EFE9',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 68,
    gap: 16,
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textDecoration: 'none',
  },
  logo: { width: 40, height: 40, borderRadius: 8, objectFit: 'cover' },
  brandText: { fontSize: 18, fontWeight: 700, color: '#0B3D2E', letterSpacing: 0.3 },
  nav: { display: 'flex', alignItems: 'center', gap: 18 },
  navLink: {
    color: '#0B3D2E',
    fontWeight: 600,
    textDecoration: 'none',
    fontSize: 14,
  },
  ctaBtn: {
    background: '#0E7A39',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 14px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(20, 126, 61, 0.25)',
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    padding: '56px 0 24px',
    background: 'linear-gradient(180deg, #F3FFF8 0%, #FFFFFF 100%)',
    borderBottom: '1px solid #E6EFE9',
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: 28,
    alignItems: 'center',
  },
  heroTitle: { fontSize: 44, lineHeight: 1.05, margin: 0, color: '#0B3D2E', fontWeight: 800 },
  heroSub: { fontSize: 18, color: '#38524B', marginTop: 14 },
  heroBadges: { display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' },
  badge: {
    display: 'inline-flex',
    gap: 8,
    alignItems: 'center',
    padding: '8px 10px',
    borderRadius: 999,
    background: '#F0FBF4',
    border: '1px solid #DFF4E7',
    color: '#0E7A39',
    fontWeight: 700,
    fontSize: 12,
  },
  heroCTAs: { display: 'flex', gap: 12, marginTop: 16, alignItems: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    ...(() => ({}))(),
    background: '#0E7A39',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '12px 16px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 10px 24px rgba(14, 122, 57, 0.30)',
  },
  btnGhost: {
    background: 'transparent',
    color: '#0E7A39',
    borderRadius: 12,
    border: '2px solid #BFEAD0',
    padding: '10px 14px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  heroImageWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid #DDEBE3',
    boxShadow: '0 18px 50px rgba(8, 66, 49, 0.15)',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    maxHeight: 440,
    objectFit: 'cover',
    display: 'block',
  },
  socialProof: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    marginTop: 18,
  },
  proofCard: {
    background: '#FFFFFF',
    border: '1px solid #E6EFE9',
    borderRadius: 12,
    padding: 12,
    textAlign: 'center',
  },
  proofNumber: { fontSize: 20, fontWeight: 900, color: '#0B3D2E' },
  proofText: { fontSize: 12, color: '#4B635C' },

  section: { padding: '44px 0' },
  sectionHeader: { textAlign: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 28, margin: 0, color: '#0B3D2E', fontWeight: 900 },
  sectionSub: { fontSize: 16, color: '#4B635C', marginTop: 8 },

  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginTop: 18,
  },
  card: {
    background: '#fff',
    border: '1px solid #E6EFE9',
    borderRadius: 14,
    padding: 16,
  },
  cardTitle: { margin: 0, fontSize: 18, color: '#0B3D2E', fontWeight: 800 },
  cardText: { marginTop: 8, color: '#3D544E', fontSize: 14 },

  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginTop: 18,
  },
  priceCard: {
    background: '#FFFFFF',
    border: '2px solid #DDEBE3',
    borderRadius: 16,
    padding: 16,
  },
  priceHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  tag: {
    background: '#0E7A39',
    color: '#fff',
    fontSize: 11,
    fontWeight: 800,
    padding: '4px 8px',
    borderRadius: 999,
    letterSpacing: 0.3,
  },
  price: { marginTop: 8, fontWeight: 900, color: '#0B3D2E', fontSize: 28 },
  per: { fontSize: 12, color: '#5A756E' },
  ul: { marginTop: 10, paddingLeft: 18, color: '#3D544E', fontSize: 14 },
  li: { marginBottom: 6 },

  testimonials: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginTop: 18,
  },
  testimonialCard: {
    background: '#fff',
    border: '1px solid #E6EFE9',
    borderRadius: 14,
    padding: 16,
  },
  reviewText: { fontStyle: 'italic', color: '#28433C' },
  reviewer: { marginTop: 10, display: 'flex', gap: 10, alignItems: 'center' },
  avatar: { width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' },
  reviewerMeta: { fontSize: 13, color: '#45665C' },

  orderWrap: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: 18,
    alignItems: 'start',
  },
  orderPanel: {
    background: '#FFFFFF',
    border: '1px solid #E6EFE9',
    borderRadius: 16,
    padding: 18,
  },
  panelTitle: { margin: 0, fontSize: 20, color: '#0B3D2E', fontWeight: 900 },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 },
  formCol: { display: 'flex', flexDirection: 'column' as const, gap: 6 },
  label: { fontSize: 13, fontWeight: 700, color: '#22463E' },
  input: {
    border: '1px solid #D6E6DD',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 14,
    outline: 'none',
  },
  select: {
    border: '1px solid #D6E6DD',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 14,
    outline: 'none',
    background: '#fff',
  },
  textarea: {
    border: '1px solid #D6E6DD',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 14,
    outline: 'none',
    minHeight: 80,
    resize: 'vertical' as const,
  },
  radioRow: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const },
  help: { fontSize: 12, color: '#55786E' },
  summary: {
    background: '#F7FBF8',
    border: '1px dashed #CFE6DA',
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
  },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 14, color: '#28433C' },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: 10, fontWeight: 900, fontSize: 18, color: '#0B3D2E' },
  submitBtn: {
    marginTop: 14,
    width: '100%',
    background: '#0E7A39',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '12px 16px',
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 10px 26px rgba(19, 107, 55, 0.3)',
  },
  mutedBtn: {
    marginTop: 10,
    width: '100%',
    background: '#F6FFFA',
    color: '#0E7A39',
    border: '1px solid #BFEAD0',
    borderRadius: 10,
    padding: '10px 12px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  status: { marginTop: 10, fontSize: 14 },
  success: { color: '#0E7A39', fontWeight: 700 },
  error: { color: '#B30035', fontWeight: 700 },

  faqGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginTop: 18,
  },
  faqItem: {
    background: '#fff',
    border: '1px solid #E6EFE9',
    borderRadius: 12,
    padding: 14,
  },
  faqQ: { fontWeight: 900, color: '#0B3D2E', margin: 0, fontSize: 16 },
  faqA: { marginTop: 8, color: '#3D544E', fontSize: 14 },

  newsletter: {
    background: 'linear-gradient(180deg, #F1FFF7 0%, #FFFFFF 100%)',
    borderTop: '1px solid #E6EFE9',
    padding: '26px 0',
  },
  newsletterRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    alignItems: 'center',
    gap: 14,
  },
  newsInputWrap: { display: 'flex', gap: 8 },
  newsInput: {
    flex: 1,
    border: '1px solid #D6E6DD',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 14,
    outline: 'none',
    background: '#fff',
  },
  newsBtn: {
    background: '#0E7A39',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 14px',
    fontWeight: 800,
    cursor: 'pointer',
  },

  footer: {
    padding: '24px 0',
    borderTop: '1px solid #E6EFE9',
    color: '#4B635C',
    fontSize: 14,
  },
  footerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const },
  footerBrand: { display: 'flex', alignItems: 'center', gap: 10 },
  footLinks: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const },
  footSmall: { fontSize: 12, color: '#5B776F' },

  // Responsive tweaks
  hideOnMobile: { display: 'none' },
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function formatCurrency(n: number) {
  return `$${n.toFixed(2)}`;
}

const PRICING: Record<BoxSize, { title: string; price: number; pounds: number; best?: boolean }> = {
  small: { title: 'Snack Box', price: 12, pounds: 3 },
  medium: { title: 'Family Box', price: 22, pounds: 6, best: true },
  family: { title: 'Feast Crate', price: 40, pounds: 12 },
};

export default function App() {
  const [mobile, setMobile] = useState(false);

  // Order state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [size, setSize] = useState<BoxSize>('medium');
  const [quantity, setQuantity] = useState(1);
  const [delivery, setDelivery] = useState<DeliveryMethod>('pickup');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState<{ ok?: boolean; message?: string }>({});

  // Newsletter
  const [newsEmail, setNewsEmail] = useState('');
  const [newsStatus, setNewsStatus] = useState<{ ok?: boolean; message?: string }>({});

  // Price calc
  const linePrice = useMemo(() => PRICING[size].price * quantity, [size, quantity]);
  const deliveryFee = useMemo(() => (delivery === 'delivery' ? 5 : 0), [delivery]);
  const discount = useMemo(() => {
    if (promoCode.trim().toUpperCase() === 'FRESH5') return 5;
    return 0;
  }, [promoCode]);
  const total = useMemo(() => Math.max(0, linePrice + deliveryFee - discount), [linePrice, deliveryFee, discount]);

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 960);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => scrollToId(id), 150);
    }
  }, []);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setOrderStatus({});
    try {
      const payload: OrderPayload = {
        fullName,
        email,
        phone: phone || undefined,
        size,
        quantity,
        delivery,
        address: delivery === 'delivery' ? address : undefined,
        notes: notes || undefined,
        promoCode: promoCode || undefined,
      };
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Order failed. Please try again.');
      }
      setOrderStatus({ ok: true, message: 'Thank you! Your order was received. We just emailed you a confirmation.' });
      // reset minimal fields
      setQuantity(1);
      setNotes('');
      setPromoCode('');
    } catch (err: any) {
      setOrderStatus({ ok: false, message: err?.message || 'Something went wrong.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsStatus({});
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsEmail }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Signup failed.');
      }
      setNewsStatus({ ok: true, message: 'You are in! Fresh updates coming your way.' });
      setNewsEmail('');
    } catch (err: any) {
      setNewsStatus({ ok: false, message: err?.message || 'Something went wrong.' });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topNotice}>Harvested this morning • Organically grown • Free pickup at the farmstand</div>

      <div style={styles.headerWrap}>
        <div style={{ ...styles.container }}>
          <header style={styles.header}>
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={styles.brand}>
              <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762091237124-img-logo.png" alt="Farm logo" style={styles.logo} />
              <span style={styles.brandText}>Green Valley Tomatoes</span>
            </a>
            <nav style={{ ...styles.nav, ...(mobile ? { display: 'none' } : {}) }}>
              <a href="#benefits" onClick={(e) => { e.preventDefault(); scrollToId('benefits'); }} style={styles.navLink}>Why Ours</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToId('pricing'); }} style={styles.navLink}>Boxes</a>
              <a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToId('testimonials'); }} style={styles.navLink}>Reviews</a>
              <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToId('faq'); }} style={styles.navLink}>FAQ</a>
              <button onClick={() => scrollToId('order')} style={styles.ctaBtn}>Order Tomatoes</button>
            </nav>
            <button onClick={() => scrollToId('order')} style={{ ...styles.ctaBtn, ...(mobile ? {} : { display: 'none' }) }}>Order</button>
          </header>
        </div>
      </div>

      <section style={styles.hero}>
        <div style={{ ...styles.container }}>
          <div style={{ ...styles.heroGrid, ...(mobile ? { gridTemplateColumns: '1fr', gap: 18 } : {}) }}>
            <div>
              <h1 style={styles.heroTitle}>Sun‑Ripened Organic Tomatoes, Delivered Fresh From Our Farm</h1>
              <p style={styles.heroSub}>
                Taste tomatoes the way they should be—picked at peak flavor, grown without chemicals, and in your kitchen within 24 hours.
              </p>
              <div style={styles.heroBadges}>
                <span style={styles.badge}>USDA Organic</span>
                <span style={styles.badge}>Picked‑to‑Order</span>
                <span style={styles.badge}>Heirloom + Roma + Cherry</span>
                <span style={styles.badge}>Locally Grown</span>
              </div>
              <div style={styles.heroCTAs}>
                <button onClick={() => scrollToId('order')} style={styles.btnPrimary}>Get My Tomatoes</button>
                <button onClick={() => scrollToId('benefits')} style={styles.btnGhost}>Why we’re different</button>
              </div>

              <div style={{ ...styles.socialProof, ...(mobile ? { gridTemplateColumns: 'repeat(2, 1fr)' } : {}) }}>
                <div style={styles.proofCard}>
                  <div style={styles.proofNumber}>4.9/5</div>
                  <div style={styles.proofText}>Avg. customer rating</div>
                </div>
                <div style={styles.proofCard}>
                  <div style={styles.proofNumber}>48h</div>
                  <div style={styles.proofText}>From vine to table</div>
                </div>
                <div style={styles.proofCard}>
                  <div style={styles.proofNumber}>100%</div>
                  <div style={styles.proofText}>Certified organic</div>
                </div>
                <div style={styles.proofCard}>
                  <div style={styles.proofNumber}>1,200+</div>
                  <div style={styles.proofText}>Happy local families</div>
                </div>
              </div>
            </div>

            <div style={styles.heroImageWrap} aria-hidden="true">
              <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762091312686-img-tomatoes-hero.png" alt="Fresh organic tomatoes" style={styles.heroImage} />
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Why Our Tomatoes Taste Better</h2>
            <p style={styles.sectionSub}>Careful soil health, slow ripening, and zero shortcuts—just pure tomato flavor.</p>
          </div>
          <div style={{ ...styles.benefitsGrid, ...(mobile ? { gridTemplateColumns: '1fr' } : {}) }}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Picked the morning of delivery</h3>
              <p style={styles.cardText}>We harvest hours before you receive them, so you get firm, fragrant tomatoes bursting with flavor.</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>No sprays, ever</h3>
              <p style={styles.cardText}>Certified organic methods from seed to harvest—no synthetic pesticides or fertilizers.</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Heirloom varieties</h3>
              <p style={styles.cardText}>We grow taste-first varieties: Brandywine, Cherokee Purple, San Marzano, and sun-sweet cherries.</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Rich, living soil</h3>
              <p style={styles.cardText}>Compost, cover crops, and microbial life give our tomatoes their signature depth and sweetness.</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Handled with care</h3>
              <p style={styles.cardText}>Hand‑picked, gently packed, and never refrigerated—so the texture stays perfect.</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Local and seasonal</h3>
              <p style={styles.cardText}>Grown right here in Green Valley. We sell what’s in season for maximum freshness.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" style={{ ...styles.section, paddingTop: 0 }}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Pick Your Box</h2>
            <p style={styles.sectionSub}>Simple pricing. Free farm pickup or $5 local delivery.</p>
          </div>
          <div style={{ ...styles.pricingGrid, ...(mobile ? { gridTemplateColumns: '1fr' } : {}) }}>
            {(['small', 'medium', 'family'] as BoxSize[]).map((key) => {
              const p = PRICING[key];
              return (
                <div key={key} style={{ ...styles.priceCard, ...(p.best ? { borderColor: '#0E7A39', boxShadow: '0 12px 30px rgba(14,122,57,0.12)' } : {}) }}>
                  <div style={styles.priceHeader}>
                    <h3 style={{ ...styles.cardTitle, margin: 0 }}>{p.title}</h3>
                    {p.best ? <span style={styles.tag}>Most Popular</span> : null}
                  </div>
                  <div style={styles.price}>
                    {formatCurrency(p.price)}
                    <span style={styles.per}> / box</span>
                  </div>
                  <ul style={styles.ul}>
                    <li style={styles.li}>{p.pounds} lbs of mixed organic tomatoes</li>
                    <li style={styles.li}>Heirloom, Roma, and Cherry mix</li>
                    <li style={styles.li}>Harvested same day</li>
                  </ul>
                  <button onClick={() => { setSize(key); scrollToId('order'); }} style={{ ...styles.btnPrimary, width: '100%', marginTop: 8 }}>
                    Choose {p.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="testimonials" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>What Neighbors Are Saying</h2>
            <p style={styles.sectionSub}>Real reviews from our weekly customers.</p>
          </div>
          <div style={{ ...styles.testimonials, ...(mobile ? { gridTemplateColumns: '1fr' } : {}) }}>
            <div style={styles.testimonialCard}>
              <p style={styles.reviewText}>"The sweetest tomatoes I've had since my grandma’s garden. BLTs every day this week!"</p>
              <div style={styles.reviewer}>
                <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762091355539-img-avatar-1.png" alt="Reviewer" style={styles.avatar} />
                <div>
                  <strong>Emma R.</strong>
                  <div style={styles.reviewerMeta}>Green Valley • Snack Box</div>
                </div>
              </div>
            </div>
            <div style={styles.testimonialCard}>
              <p style={styles.reviewText}>"Arrived still warm from the sun. The heirlooms made our caprese unforgettable."</p>
              <div style={styles.reviewer}>
                <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762091412290-img-avatar-2.png" alt="Reviewer" style={styles.avatar} />
                <div>
                  <strong>Keon D.</strong>
                  <div style={styles.reviewerMeta}>Maple Ridge • Family Box</div>
                </div>
              </div>
            </div>
            <div style={styles.testimonialCard}>
              <p style={styles.reviewText}>"Zero waste, zero bland tomatoes. Worth every penny—kids eat them like candy."</p>
              <div style={styles.reviewer}>
                <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762091459944-img-avatar-3.png" alt="Reviewer" style={styles.avatar} />
                <div>
                  <strong>Sofia L.</strong>
                  <div style={styles.reviewerMeta}>Riverside • Feast Crate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="order" style={{ ...styles.section, background: '#F9FEFB', borderTop: '1px solid #E6EFE9', borderBottom: '1px solid #E6EFE9' }}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Order Fresh Tomatoes</h2>
            <p style={styles.sectionSub}>We’ll confirm your harvest date and pickup/delivery details right away.</p>
          </div>

          <div style={{ ...styles.orderWrap, ...(mobile ? { gridTemplateColumns: '1fr' } : {}) }}>
            <div style={styles.orderPanel}>
              <h3 style={styles.panelTitle}>Your Details</h3>
              <form onSubmit={handleSubmitOrder}>
                <div style={styles.formRow}>
                  <div style={styles.formCol}>
                    <label style={styles.label} htmlFor="fullName">Full name</label>
                    <input id="fullName" style={styles.input} value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Jane Doe" />
                  </div>
                  <div style={styles.formCol}>
                    <label style={styles.label} htmlFor="email">Email</label>
                    <input id="email" type="email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formCol}>
                    <label style={styles.label} htmlFor="phone">Phone (optional)</label>
                    <input id="phone" style={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 000‑0000" />
                  </div>
                  <div style={styles.formCol}>
                    <label style={styles.label} htmlFor="promo">Promo code</label>
                    <input id="promo" style={styles.input} value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="FRESH5" />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formCol}>
                    <label style={styles.label} htmlFor="size">Box size</label>
                    <select id="size" style={styles.select} value={size} onChange={(e) => setSize(e.target.value as BoxSize)}>
                      <option value="small">Snack Box — {PRICING.small.pounds} lbs — {formatCurrency(PRICING.small.price)}</option>
                      <option value="medium">Family Box — {PRICING.medium.pounds} lbs — {formatCurrency(PRICING.medium.price)} (Most popular)</option>
                      <option value="family">Feast Crate — {PRICING.family.pounds} lbs — {formatCurrency(PRICING.family.price)}</option>
                    </select>
                  </div>
                  <div style={styles.formCol}>
                    <label style={styles.label} htmlFor="qty">Quantity</label>
                    <input
                      id="qty"
                      style={styles.input}
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
                    />
                  </div>
                </div>

                <div style={{ ...styles.formCol, marginTop: 12 }}>
                  <label style={styles.label}>Delivery method</label>
                  <div style={styles.radioRow}>
                    <label>
                      <input
                        type="radio"
                        name="delivery"
                        value="pickup"
                        checked={delivery === 'pickup'}
                        onChange={() => setDelivery('pickup')}
                      />{' '}
                      Free farm pickup (Green Valley)
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="delivery"
                        value="delivery"
                        checked={delivery === 'delivery'}
                        onChange={() => setDelivery('delivery')}
                      />{' '}
                      Local delivery (+$5)
                    </label>
                  </div>
                  <div style={styles.help}>
                    We’ll email your pickup window or delivery time after placing your order.
                  </div>
                </div>

                {delivery === 'delivery' && (
                  <div style={{ ...styles.formCol, marginTop: 12 }}>
                    <label style={styles.label} htmlFor="address">Delivery address</label>
                    <input
                      id="address"
                      style={styles.input}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Farm Lane, Green Valley"
                      required
                    />
                    <div style={styles.help}>We deliver within 10 miles of the farm.</div>
                  </div>
                )}

                <div style={{ ...styles.formCol, marginTop: 12 }}>
                  <label style={styles.label} htmlFor="notes">Notes (optional)</label>
                  <textarea id="notes" style={styles.textarea} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any preferences or gate codes?" />
                </div>

                <div style={styles.summary} aria-live="polite">
                  <div style={styles.summaryRow}>
                    <span>{PRICING[size].title} × {quantity}</span>
                    <strong>{formatCurrency(linePrice)}</strong>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Delivery</span>
                    <strong>{deliveryFee ? formatCurrency(deliveryFee) : 'Free'}</strong>
                  </div>
                  {discount > 0 && (
                    <div style={styles.summaryRow}>
                      <span>Promo</span>
                      <strong>-{formatCurrency(discount)}</strong>
                    </div>
                  )}
                  <div style={styles.totalRow}>
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div style={{ ...styles.help, marginTop: 8 }}>No upfront payment. Pay at pickup or upon delivery.</div>
                </div>

                <button type="submit" style={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Placing order…' : 'Place Order'}
                </button>
                <button type="button" style={styles.mutedBtn} onClick={() => scrollToId('faq')}>Questions? Read FAQ</button>

                {orderStatus.message && (
                  <div style={{ ...styles.status, ...(orderStatus.ok ? styles.success : styles.error) }}>
                    {orderStatus.message}
                  </div>
                )}
              </form>
            </div>

            <aside style={styles.orderPanel}>
              <h3 style={styles.panelTitle}>What’s in season</h3>
              <ul style={styles.ul}>
                <li style={styles.li}>Heirloom slicers: Brandywine, Cherokee Purple</li>
                <li style={styles.li}>Paste: San Marzano, Roma</li>
                <li style={styles.li}>Snacking: Sungold, Sweet Million</li>
              </ul>
              <div style={{ marginTop: 8 }}>
                <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762091507117-img-tomatoes-side.png" alt="Assorted tomatoes" style={{ width: '100%', borderRadius: 12, border: '1px solid #DDEBE3' }} />
              </div>
              <div style={{ ...styles.help, marginTop: 10 }}>
                We pack a balanced mix unless you specify preferences in Notes.
              </div>
              <div style={{ marginTop: 12, background: '#F0FBF4', border: '1px solid #DFF4E7', borderRadius: 12, padding: 12 }}>
                <strong style={{ color: '#0E7A39' }}>Farmer’s Promise:</strong>
                <div style={{ marginTop: 6, color: '#2E4D44', fontSize: 14 }}>
                  If you don’t love your tomatoes, we’ll replace them or refund you—no fuss.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="faq" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p style={styles.sectionSub}>Everything you need to know before you bite.</p>
          </div>
          <div style={{ ...styles.faqGrid, ...(mobile ? { gridTemplateColumns: '1fr' } : {}) }}>
            <div style={styles.faqItem}>
              <h3 style={styles.faqQ}>How soon will I get my tomatoes?</h3>
              <p style={styles.faqA}>We harvest the morning of your order day. Pickup is same-day. Local delivery is typically within 24 hours.</p>
            </div>
            <div style={styles.faqItem}>
              <h3 style={styles.faqQ}>Can I choose only heirlooms or only romas?</h3>
              <p style={styles.faqA}>Yes! Add your preference in the Notes. We’ll do our best based on the day’s harvest.</p>
            </div>
            <div style={styles.faqItem}>
              <h3 style={styles.faqQ}>Are your tomatoes organic?</h3>
              <p style={styles.faqA}>Yes—certified organic practices with living soil, compost, and no synthetic inputs.</p>
            </div>
            <div style={styles.faqItem}>
              <h3 style={styles.faqQ}>Do you ship?</h3>
              <p style={styles.faqA}>We currently offer local pickup and delivery only to keep quality at its peak.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.newsletter}>
        <div style={styles.container}>
          <div style={{ ...styles.newsletterRow, ...(mobile ? { gridTemplateColumns: '1fr', gap: 10 } : {}) }}>
            <div>
              <h3 style={{ ...styles.sectionTitle, fontSize: 22, margin: 0 }}>Get harvest alerts and recipes</h3>
              <p style={{ ...styles.sectionSub, marginTop: 6 }}>Join our newsletter for weekly availability and simple, tasty ideas.</p>
            </div>
            <form onSubmit={handleNewsletter} style={styles.newsInputWrap}>
              <input
                type="email"
                required
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                placeholder="you@example.com"
                style={styles.newsInput}
              />
              <button type="submit" style={styles.newsBtn}>Subscribe</button>
            </form>
          </div>
          {newsStatus.message && (
            <div style={{ ...styles.container, marginTop: 10 }}>
              <div style={{ ...(newsStatus.ok ? styles.success : styles.error) }}>{newsStatus.message}</div>
            </div>
          )}
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={{ ...styles.container }}>
          <div style={styles.footerRow}>
            <div style={styles.footerBrand}>
              <img src="https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762091237124-img-logo.png" alt="Farm logo" style={{ ...styles.logo, width: 32, height: 32 }} />
              <strong>Green Valley Tomatoes</strong>
            </div>
            <div style={styles.footLinks}>
              <a href="#order" onClick={(e) => { e.preventDefault(); scrollToId('order'); }} style={styles.navLink}>Order</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToId('pricing'); }} style={styles.navLink}>Boxes</a>
              <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToId('faq'); }} style={styles.navLink}>FAQ</a>
              <a href="mailto:hello@greenvalley.farm" className="contact" style={styles.navLink}>Contact</a>
            </div>
          </div>
          <div style={{ ...styles.footerRow, marginTop: 8 }}>
            <div style={styles.footSmall}>© {new Date().getFullYear()} Green Valley Farm. All rights reserved.</div>
            <div style={styles.footSmall}>Made with love and compost.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}