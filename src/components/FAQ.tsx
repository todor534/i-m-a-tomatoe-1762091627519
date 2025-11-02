import React, { useState } from 'react';

type FAQEntry = {
  q: string;
  a: React.ReactNode;
};

const faqs: FAQEntry[] = [
  {
    q: 'How fresh are the tomatoes?',
    a: (
      <>
        We harvest at peak ripeness in the early morning and pack the same day. Local deliveries arrive within 24–48 hours of harvest. Shipped orders go out Monday–Wednesday to ensure they reach you fresh and fast.
      </>
    ),
  },
  {
    q: 'Are your tomatoes certified organic?',
    a: (
      <>
        Yes. We follow strict organic practices: no synthetic pesticides, herbicides, or GMOs. We build soil health with compost, crop rotations, and beneficial insects for natural pest control.
      </>
    ),
  },
  {
    q: 'Where do you deliver?',
    a: (
      <>
        • Free local delivery within about 20 miles of our farm (enter your address at checkout to confirm).<br />
        • Nationwide shipping in recyclable, insulated packaging with ice packs when needed.<br />
        Delivery options and fees are shown at checkout.
      </>
    ),
  },
  {
    q: 'What are the prices and minimum order?',
    a: (
      <>
        Prices vary by variety and season. You’ll see live pricing on the order form, with quantity discounts applied automatically. Minimums: typically 2 lb for local delivery and 5 lb for shipping.
      </>
    ),
  },
  {
    q: 'Which varieties are available?',
    a: (
      <>
        We grow flavorful heirlooms, sweet cherry/grape, meaty Roma/paste, and classic beefsteak tomatoes. Availability changes with the season—current varieties are listed on the order form.
      </>
    ),
  },
  {
    q: 'How should I store them?',
    a: (
      <>
        • If slightly firm: keep at room temperature, out of direct sun, stem-side down.<br />
        • Once fully ripe: refrigerate to extend freshness, then bring to room temp before eating for best flavor.<br />
        • To speed ripening: place in a paper bag with a ripe banana or apple.
      </>
    ),
  },
  {
    q: 'Do you offer subscriptions?',
    a: (
      <>
        Yes—weekly or biweekly seasonal boxes. You can pause, skip, or cancel anytime before your billing day. Subscriptions get first pick of premium varieties.
      </>
    ),
  },
  {
    q: 'What if something arrives damaged?',
    a: (
      <>
        We stand behind every order. If your tomatoes arrive damaged or not as expected, contact us within 24 hours with a photo. We’ll replace or refund—no hassle.
      </>
    ),
  },
  {
    q: 'How do I place an order?',
    a: (
      <>
        Use the simple form below to choose your varieties and delivery method. It takes about a minute. When you’re ready, tap “Order Now” to checkout.
        {' '}
        <a href="#order" style={styles.link}>Order now</a>
      </>
    ),
  },
];

function ArrowIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{
        transition: 'transform 0.2s ease',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" style={styles.section} aria-labelledby="faq-heading">
      <div style={styles.container}>
        <h2 id="faq-heading" style={styles.heading}>Frequently asked questions</h2>
        <p style={styles.subheading}>
          Everything you need to know about our organic tomatoes, delivery, and orders. Can’t find your answer?
          {' '}
          <a href="mailto:hello@yourfarm.com" style={styles.link}>Email us</a>.
        </p>

        <div style={styles.list}>
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            const buttonId = `faq-trigger-${idx}`;
            const panelId = `faq-panel-${idx}`;
            return (
              <div key={idx} style={styles.item}>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(idx)}
                  style={styles.button}
                >
                  <span style={styles.question}>{item.q}</span>
                  <span style={styles.iconWrap}>
                    <ArrowIcon open={isOpen} />
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  style={{ ...styles.panel, ...(isOpen ? styles.panelOpen : {}) }}
                >
                  <div style={styles.answer}>{item.a}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.ctaBox}>
          <div style={styles.ctaText}>
            Ready for peak-season flavor? Reserve your box now.
          </div>
          <a href="#order" style={styles.ctaBtn}>Order tomatoes</a>
        </div>
      </div>
    </section>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  section: {
    padding: '64px 0',
    background: '#faf9f7',
    borderTop: '1px solid #eee6dc',
  },
  container: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '0 20px',
  },
  heading: {
    margin: 0,
    fontSize: '28px',
    lineHeight: 1.2,
    fontWeight: 800,
    color: '#2b2b2b',
    textAlign: 'center',
  },
  subheading: {
    margin: '12px auto 28px',
    color: '#555',
    textAlign: 'center',
    maxWidth: 720,
    fontSize: '16px',
  },
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
  },
  item: {
    background: '#fff',
    border: '1px solid #efe8df',
    borderRadius: 12,
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'space-between',
    padding: '16px 18px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#2b2b2b',
    textAlign: 'left',
  },
  question: {
    fontWeight: 600,
    lineHeight: 1.4,
  },
  iconWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8b5e34',
  },
  panel: {
    padding: '0 18px 0',
    color: '#444',
    lineHeight: 1.6,
  },
  panelOpen: {
    padding: '0 18px 16px',
  },
  answer: {
    fontSize: '15px',
  },
  link: {
    color: '#8b5e34',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  ctaBox: {
    marginTop: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    background: '#fff',
    border: '1px solid #efe8df',
    borderRadius: 12,
    padding: 16,
  },
  ctaText: {
    color: '#2b2b2b',
    fontWeight: 600,
  },
  ctaBtn: {
    background: '#8b5e34',
    color: '#fff',
    borderRadius: 10,
    padding: '10px 14px',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '14px',
    border: '1px solid #7a522f',
  },
};