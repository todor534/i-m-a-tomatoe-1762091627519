import React, { useMemo, useState } from 'react';

type DeliveryMethod = 'pickup' | 'delivery';
type Unit = 'lbs' | 'box';

type OrderPayload = {
  name: string;
  email: string;
  phone?: string;
  method: DeliveryMethod;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  quantity: number;
  unit: Unit;
  preferredDate?: string;
  notes?: string;
  subscribe?: boolean;
};

type ApiResponse = {
  ok: boolean;
  orderId?: string;
  error?: string;
  total?: number;
};

const PRICE_PER_LB = 4.0; // UI estimate only; server will confirm final total
const https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090970881-img-box.png_LBS = 10; // 1 box ≈ 10 lbs
const DELIVERY_FEE_FLAT = 8; // UI estimate only

const styles: { [k: string]: React.CSSProperties } = {
  section: {
    padding: '48px 16px',
    background: '#fff',
  },
  card: {
    maxWidth: 980,
    margin: '0 auto',
    background: '#ffffff',
    border: '1px solid #e6e6e6',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
  },
  headingWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  tomatoBadge: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#ff7043',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
    boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.08)',
  },
  heading: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.2,
    color: '#1b4332',
    letterSpacing: 0.2,
  },
  subhead: {
    marginTop: 4,
    color: '#3d5a40',
    fontSize: 14,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 24,
  },
  panel: {
    border: '1px dashed #dfe7dd',
    borderRadius: 10,
    padding: 16,
  },
  panelTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    color: '#2d6a4f',
    marginBottom: 12,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  rowSingle: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 12,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#344e41',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #ced4da',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.15s ease',
  },
  inputError: {
    borderColor: '#c1121f',
    background: '#fff5f5',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 6,
  },
  radioGroup: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  },
  radioItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  button: {
    background: '#2d6a4f',
    color: '#fff',
    border: 'none',
    padding: '12px 18px',
    fontSize: 15,
    fontWeight: 700,
    borderRadius: 10,
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(45,106,79,0.25)',
  },
  buttonDisabled: {
    opacity: 0.65,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  buttonSecondary: {
    background: '#f1f5f3',
    color: '#2d6a4f',
    border: '1px solid #dfe7dd',
    padding: '12px 16px',
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 10,
    cursor: 'pointer',
  },
  priceCard: {
    background: 'linear-gradient(180deg, #f3faf5, #ffffff)',
    border: '1px solid #e2efe6',
    borderRadius: 12,
    padding: 16,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 14,
    padding: '6px 0',
    color: '#263a2d',
  },
  priceEm: {
    fontWeight: 700,
  },
  priceTotal: {
    fontWeight: 800,
    fontSize: 18,
    color: '#1b4332',
    paddingTop: 8,
    borderTop: '1px dashed #dfe7dd',
    marginTop: 8,
  },
  note: {
    fontSize: 12,
    color: '#5b6b61',
    marginTop: 10,
  },
  secureRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: '#5b6b61',
    marginTop: 6,
  },
  error: {
    marginTop: 10,
    color: '#c1121f',
    background: '#fff5f5',
    border: '1px solid #ffd6d6',
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
  },
  success: {
    marginTop: 10,
    color: '#1b4332',
    background: '#edfff3',
    border: '1px solid #cdebd8',
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
  },
};

function formatCurrency(n: number) {
  if (!isFinite(n)) return '$0.00';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const OrderForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<DeliveryMethod>('pickup');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [unit, setUnit] = useState<Unit>('lbs');
  const [quantity, setQuantity] = useState<number>(5);
  const [preferredDate, setPreferredDate] = useState<string>(todayPlus(2));
  const [notes, setNotes] = useState('');
  const [subscribe, setSubscribe] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<{ orderId?: string; message: string } | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const pounds = useMemo(() => (unit === 'lbs' ? quantity : quantity * https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090970881-img-box.png_LBS), [unit, quantity]);
  const subtotal = useMemo(() => pounds * PRICE_PER_LB, [pounds]);
  const deliveryFee = useMemo(() => (method === 'delivery' ? DELIVERY_FEE_FLAT : 0), [method]);
  const estTotal = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please enter your full name.';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email.';
    if (!quantity || quantity <= 0) errs.quantity = 'Quantity must be greater than zero.';
    if (unit === 'lbs' && quantity < 2) errs.quantity = 'Minimum order is 2 lbs.';
    if (unit === 'box' && quantity < 1) errs.quantity = 'Minimum order is 1 box.';
    if (method === 'delivery') {
      if (!address1.trim()) errs.address1 = 'Street address is required for delivery.';
      if (!city.trim()) errs.city = 'City is required for delivery.';
      if (!state.trim()) errs.state = 'State is required for delivery.';
      if (!zip.trim()) errs.zip = 'ZIP code is required for delivery.';
    }
    if (preferredDate && preferredDate < todayPlus(0)) {
      errs.preferredDate = 'Please choose a future date.';
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowErrors(true);
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }

    const payload: OrderPayload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      method,
      address:
        method === 'delivery'
          ? {
              line1: address1.trim(),
              line2: address2.trim() || undefined,
              city: city.trim(),
              state: state.trim(),
              zip: zip.trim(),
            }
          : undefined,
      quantity,
      unit,
      preferredDate: preferredDate || undefined,
      notes: notes.trim() || undefined,
      subscribe,
    };

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse = await res.json().catch(() => ({ ok: false, error: 'Unexpected response' }));

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Unable to place order. Please try again.');
      }

      setSubmitSuccess({
        orderId: data.orderId,
        message:
          'Thank you! Your order was received. We will confirm availability and pickup/delivery details by email shortly.',
      });

      // optional: reset form
      setName('');
      setEmail('');
      setPhone('');
      setMethod('pickup');
      setAddress1('');
      setAddress2('');
      setCity('');
      setState('');
      setZip('');
      setUnit('lbs');
      setQuantity(5);
      setPreferredDate(todayPlus(2));
      setNotes('');
      setSubscribe(true);
      setShowErrors(false);
      setFieldErrors({});
    } catch (err: any) {
      setSubmitError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const qtyMin = unit === 'lbs' ? 2 : 1;
  const qtyStep = 1;

  return (
    <section id="order" style={styles.section} aria-labelledby="order-title">
      <div style={styles.card}>
        <div style={styles.headingWrap}>
          <div aria-hidden="true" style={styles.tomatoBadge}>🍅</div>
          <div>
            <h2 id="order-title" style={styles.heading}>Order Organic Tomatoes</h2>
            <div style={styles.subhead}>Picked fresh. No sprays. Grown with love.</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.formGrid}>
            <div style={styles.panel} aria-label="Customer information">
              <h3 style={styles.panelTitle}>Your info</h3>
              <div style={styles.row}>
                <div>
                  <label style={styles.label} htmlFor="name">Full name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Farmer"
                    style={{ ...styles.input, ...(showErrors && fieldErrors.name ? styles.inputError : null) }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {showErrors && fieldErrors.name ? <div style={styles.helpText}>{fieldErrors.name}</div> : null}
                </div>
                <div>
                  <label style={styles.label} htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@example.com"
                    style={{ ...styles.input, ...(showErrors && fieldErrors.email ? styles.inputError : null) }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {showErrors && fieldErrors.email ? <div style={styles.helpText}>{fieldErrors.email}</div> : null}
                </div>
              </div>

              <div style={styles.rowSingle}>
                <div>
                  <label style={styles.label} htmlFor="phone">Phone (optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(555) 123-4567"
                    style={styles.input}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={styles.panel} aria-label="Order details">
              <h3 style={styles.panelTitle}>Order details</h3>

              <div style={styles.row}>
                <div>
                  <label style={styles.label}>Units</label>
                  <div style={styles.radioGroup} role="radiogroup" aria-label="Units">
                    <label style={styles.radioItem}>
                      <input
                        type="radio"
                        name="unit"
                        value="lbs"
                        checked={unit === 'lbs'}
                        onChange={() => setUnit('lbs')}
                      />
                      <span>By the pound</span>
                    </label>
                    <label style={styles.radioItem}>
                      <input
                        type="radio"
                        name="unit"
                        value="box"
                        checked={unit === 'box'}
                        onChange={() => setUnit('box')}
                      />
                      <span>By the box (~{https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090970881-img-box.png_LBS} lbs)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label style={styles.label} htmlFor="quantity">Quantity</label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={qtyMin}
                    step={qtyStep}
                    placeholder="5"
                    style={{ ...styles.input, ...(showErrors && fieldErrors.quantity ? styles.inputError : null) }}
                    value={Number.isFinite(quantity) ? quantity : ''}
                    onChange={(e) => setQuantity(Math.max(qtyMin, parseInt(e.target.value || '0', 10)))}
                  />
                  <div style={styles.helpText}>
                    {unit === 'lbs'
                      ? `Minimum 2 lbs.`
                      : `Minimum 1 box (~${https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762090970881-img-box.png_LBS} lbs each).`}
                  </div>
                  {showErrors && fieldErrors.quantity ? <div style={styles.helpText}>{fieldErrors.quantity}</div> : null}
                </div>
              </div>

              <div style={styles.row}>
                <div>
                  <label style={styles.label}>Receive via</label>
                  <div style={styles.radioGroup} role="radiogroup" aria-label="Receive via">
                    <label style={styles.radioItem}>
                      <input
                        type="radio"
                        name="method"
                        value="pickup"
                        checked={method === 'pickup'}
                        onChange={() => setMethod('pickup')}
                      />
                      <span>Farm pickup</span>
                    </label>
                    <label style={styles.radioItem}>
                      <input
                        type="radio"
                        name="method"
                        value="delivery"
                        checked={method === 'delivery'}
                        onChange={() => setMethod('delivery')}
                      />
                      <span>Local delivery</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label style={styles.label} htmlFor="date">Preferred date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    min={todayPlus(1)}
                    style={{ ...styles.input, ...(showErrors && fieldErrors.preferredDate ? styles.inputError : null) }}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                  />
                  <div style={styles.helpText}>
                    We’ll confirm availability for your selected day.
                  </div>
                  {showErrors && fieldErrors.preferredDate ? (
                    <div style={styles.helpText}>{fieldErrors.preferredDate}</div>
                  ) : null}
                </div>
              </div>
            </div>

            {method === 'delivery' ? (
              <div style={styles.panel} aria-label="Delivery address">
                <h3 style={styles.panelTitle}>Delivery address</h3>

                <div style={styles.rowSingle}>
                  <div>
                    <label style={styles.label} htmlFor="address1">Street address</label>
                    <input
                      id="address1"
                      name="address1"
                      type="text"
                      autoComplete="address-line1"
                      placeholder="123 Farm Lane"
                      style={{ ...styles.input, ...(showErrors && fieldErrors.address1 ? styles.inputError : null) }}
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                    {showErrors && fieldErrors.address1 ? <div style={styles.helpText}>{fieldErrors.address1}</div> : null}
                  </div>
                </div>

                <div style={styles.rowSingle}>
                  <div>
                    <label style={styles.label} htmlFor="address2">Apt/Suite (optional)</label>
                    <input
                      id="address2"
                      name="address2"
                      type="text"
                      autoComplete="address-line2"
                      placeholder="Unit B"
                      style={styles.input}
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>
                </div>

                <div style={styles.row}>
                  <div>
                    <label style={styles.label} htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="Tomato Town"
                      style={{ ...styles.input, ...(showErrors && fieldErrors.city ? styles.inputError : null) }}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    {showErrors && fieldErrors.city ? <div style={styles.helpText}>{fieldErrors.city}</div> : null}
                  </div>
                  <div>
                    <label style={styles.label} htmlFor="state">State</label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      autoComplete="address-level1"
                      placeholder="CA"
                      style={{ ...styles.input, ...(showErrors && fieldErrors.state ? styles.inputError : null) }}
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                    />
                    {showErrors && fieldErrors.state ? <div style={styles.helpText}>{fieldErrors.state}</div> : null}
                  </div>
                </div>

                <div style={styles.rowSingle}>
                  <div>
                    <label style={styles.label} htmlFor="zip">ZIP code</label>
                    <input
                      id="zip"
                      name="zip"
                      type="text"
                      autoComplete="postal-code"
                      placeholder="90210"
                      style={{ ...styles.input, ...(showErrors && fieldErrors.zip ? styles.inputError : null) }}
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                    />
                    {showErrors && fieldErrors.zip ? <div style={styles.helpText}>{fieldErrors.zip}</div> : null}
                  </div>
                </div>
              </div>
            ) : null}

            <div style={styles.panel} aria-label="Notes and preferences">
              <h3 style={styles.panelTitle}>Notes</h3>
              <div style={styles.rowSingle}>
                <div>
                  <label style={styles.label} htmlFor="notes">Anything we should know?</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    placeholder="Variety preferences, ripeness level, delivery instructions, etc."
                    style={{ ...styles.input, resize: 'vertical' }}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={500}
                  />
                  <div style={styles.helpText}>{500 - (notes?.length || 0)} characters left</div>
                </div>
              </div>
              <div style={styles.checkboxRow}>
                <input
                  id="subscribe"
                  type="checkbox"
                  checked={subscribe}
                  onChange={(e) => setSubscribe(e.target.checked)}
                />
                <label htmlFor="subscribe">Send me farm updates and harvest alerts</label>
              </div>
            </div>

            <div style={styles.priceCard} aria-label="Estimated total">
              <div style={{ ...styles.priceRow, fontWeight: 700, color: '#1b4332' }}>
                <span>Order summary</span>
                <span>{unit === 'lbs' ? `${quantity} lbs` : `${quantity} box${quantity > 1 ? 'es' : ''} (~${pounds} lbs)`}</span>
              </div>
              <div style={styles.priceRow}>
                <span>Tomatoes</span>
                <span>
                  {formatCurrency(PRICE_PER_LB)} × {pounds} lbs
                </span>
              </div>
              {method === 'delivery' ? (
                <div style={styles.priceRow}>
                  <span>Estimated delivery</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
              ) : null}
              <div style={{ ...styles.priceRow, ...styles.priceTotal }}>
                <span>Estimated total</span>
                <span className="total">{formatCurrency(estTotal)}</span>
              </div>

              <div style={styles.note}>
                Final total may vary slightly by exact weight and route. You’ll receive a confirmation email with the
                final invoice and pickup/delivery details.
              </div>
              <div style={styles.secureRow}>
                <span role="img" aria-label="lock">🔒</span>
                <span>Your information is kept private and never shared.</span>
              </div>
            </div>

            {submitError ? <div role="alert" style={styles.error}>{submitError}</div> : null}
            {submitSuccess ? (
              <div role="status" style={styles.success}>
                {submitSuccess.message}
                {submitSuccess.orderId ? <div style={{ marginTop: 6, fontWeight: 700 }}>Order ID: {submitSuccess.orderId}</div> : null}
              </div>
            ) : null}

            <div style={styles.actions}>
              <button
                type="submit"
                style={{ ...styles.button, ...(submitting ? styles.buttonDisabled : null) }}
                disabled={submitting}
                aria-disabled={submitting}
              >
                {submitting ? 'Placing order…' : 'Place order'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setEmail('');
                  setPhone('');
                  setMethod('pickup');
                  setAddress1('');
                  setAddress2('');
                  setCity('');
                  setState('');
                  setZip('');
                  setUnit('lbs');
                  setQuantity(5);
                  setPreferredDate(todayPlus(2));
                  setNotes('');
                  setSubscribe(true);
                  setShowErrors(false);
                  setFieldErrors({});
                  setSubmitError(null);
                  setSubmitSuccess(null);
                }}
                style={styles.buttonSecondary}
              >
                Reset
              </button>
              <div style={styles.helpText}>
                Questions? Reply to your order confirmation email and we’ll help.
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default OrderForm;