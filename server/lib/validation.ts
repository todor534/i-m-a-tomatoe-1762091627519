/* Common validation/sanitization utilities for server handlers */

export type ValidationErrors = Record<string, string>;

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: ValidationErrors };

export type NewsletterInput = {
  email: string;
  name?: string;
};

export type OrderAddress = {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
};

export type OrderInput = {
  name: string;
  email: string;
  phone?: string;
  product: string;
  quantity: number;
  delivery: 'pickup' | 'local_delivery' | 'shipping' | string;
  address?: OrderAddress;
  notes?: string;
};

/* Basic type guards and helpers */

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype;
}

function collapseWhitespace(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export function coerceString(v: unknown, fallback = ''): string {
  if (typeof v === 'string') return v;
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return fallback;
}

export function coerceNumber(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/* Field validators */

export function isValidEmail(email: string): boolean {
  // Robust-enough email check for backend validation
  const str = email.toLowerCase();
  if (str.length > 254) return false;
  // eslint-disable-next-line no-control-regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(str);
}

export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/[^\d]/g, '');
  if (digits.length === 0) return '';
  return hasPlus ? `+${digits}` : digits;
}

export function isValidPhone(phone: string): boolean {
  const norm = normalizePhone(phone);
  // allow local 7-15 digits, with optional leading '+'
  const re = /^\+?\d{7,15}$/;
  return re.test(norm);
}

export function isValidPostalCode(code: string): boolean {
  const s = code.trim();
  // Accept common formats: US ZIP, ZIP+4, Canadian, simple alphanum 3-12
  const patterns = [
    /^\d{5}(-\d{4})?$/, // US
    /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, // CA
    /^[A-Za-z0-9 \-]{3,12}$/, // fallback generic
  ];
  return patterns.some((p) => p.test(s));
}

export function sanitizeNote(s: string, maxLen = 1000): string {
  const collapsed = collapseWhitespace(s);
  return collapsed.slice(0, maxLen);
}

/* Newsletter validation */

export function validateNewsletterInput(payload: unknown): ValidationResult<NewsletterInput> {
  const errors: ValidationErrors = {};

  if (!isPlainObject(payload)) {
    return { ok: false, errors: { payload: 'Invalid payload' } };
  }

  const email = collapseWhitespace(coerceString(payload.email));
  const nameRaw = coerceString(payload.name).trim();
  const name = nameRaw ? collapseWhitespace(nameRaw) : undefined;

  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (name && (name.length < 2 || name.length > 80)) {
    errors.name = 'Name must be between 2 and 80 characters';
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { email: email.toLowerCase(), name } };
}

/* Order validation */

export function validateOrderInput(payload: unknown): ValidationResult<OrderInput> {
  const errors: ValidationErrors = {};

  if (!isPlainObject(payload)) {
    return { ok: false, errors: { payload: 'Invalid payload' } };
  }

  // Name
  const name = collapseWhitespace(coerceString(payload.name));
  if (!name) {
    errors.name = 'Name is required';
  } else if (name.length < 2 || name.length > 80) {
    errors.name = 'Name must be between 2 and 80 characters';
  }

  // Email
  const email = collapseWhitespace(coerceString(payload.email)).toLowerCase();
  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone (optional)
  const phoneInput = coerceString(payload.phone).trim();
  let phone: string | undefined;
  if (phoneInput) {
    if (!isValidPhone(phoneInput)) {
      errors.phone = 'Please enter a valid phone number';
    } else {
      phone = normalizePhone(phoneInput);
    }
  }

  // Product
  const product = collapseWhitespace(coerceString((payload as any).product || (payload as any).variant || (payload as any).sku));
  if (!product) {
    errors.product = 'Product is required';
  } else if (product.length > 64) {
    errors.product = 'Product is too long';
  }

  // Quantity
  const qtyRaw = coerceNumber((payload as any).quantity);
  let quantity: number | undefined;
  if (qtyRaw == null) {
    errors.quantity = 'Quantity is required';
  } else {
    // tomatoes usually ordered in units or pounds; constrain to 1..100
    const q = Math.round(qtyRaw);
    if (q < 1) {
      errors.quantity = 'Quantity must be at least 1';
    } else if (q > 100) {
      errors.quantity = 'Quantity must be 100 or less';
    } else {
      quantity = q;
    }
  }

  // Delivery
  const delivery = collapseWhitespace(
    coerceString((payload as any).delivery || (payload as any).deliveryOption || (payload as any).fulfillment)
  ).toLowerCase() as OrderInput['delivery'];

  if (!delivery) {
    errors.delivery = 'Delivery option is required';
  } else {
    const allowed = ['pickup', 'local_delivery', 'shipping'];
    if (!allowed.includes(delivery)) {
      // allow custom strings but enforce basic format
      if (!/^[a-z][a-z0-9_ -]{1,30}$/.test(delivery)) {
        errors.delivery = 'Invalid delivery option';
      }
    }
  }

  // Address requirement logic
  const needsAddress = delivery === 'local_delivery' || delivery === 'shipping';

  // Accept address either nested as address.* or flat fields:
  const addrSource = isPlainObject((payload as any).address) ? ((payload as any).address as Record<string, unknown>) : (payload as Record<string, unknown>);

  const line1Raw = coerceString(addrSource.line1 || addrSource.addressLine1).trim();
  const line2Raw = coerceString(addrSource.line2 || addrSource.addressLine2).trim();
  const cityRaw = coerceString(addrSource.city).trim();
  const stateRaw = coerceString(addrSource.state || addrSource.region).trim();
  const postalRaw = coerceString(addrSource.postalCode || addrSource.zip || addrSource.zipcode).trim();

  let address: OrderAddress | undefined;

  if (needsAddress) {
    if (!line1Raw) errors.address_line1 = 'Street address is required';
    if (!cityRaw) errors.address_city = 'City is required';
    if (!postalRaw) errors.address_postalCode = 'Postal code is required';
    if (postalRaw && !isValidPostalCode(postalRaw)) {
      errors.address_postalCode = 'Please enter a valid postal code';
    }
    if (!errors.address_line1 && !errors.address_city && !errors.address_postalCode) {
      address = {
        line1: collapseWhitespace(line1Raw),
        line2: line2Raw ? collapseWhitespace(line2Raw) : undefined,
        city: collapseWhitespace(cityRaw),
        state: stateRaw ? collapseWhitespace(stateRaw) : undefined,
        postalCode: collapseWhitespace(postalRaw),
      };
    }
  } else {
    // If provided for pickup, lightly validate fields
    if (line1Raw || cityRaw || postalRaw || stateRaw || line2Raw) {
      if (postalRaw && !isValidPostalCode(postalRaw)) {
        errors.address_postalCode = 'Please enter a valid postal code';
      }
      address = {
        line1: line1Raw ? collapseWhitespace(line1Raw) : '',
        line2: line2Raw ? collapseWhitespace(line2Raw) : undefined,
        city: cityRaw ? collapseWhitespace(cityRaw) : '',
        state: stateRaw ? collapseWhitespace(stateRaw) : undefined,
        postalCode: postalRaw ? collapseWhitespace(postalRaw) : '',
      };
    }
  }

  // Notes (optional)
  const notesRaw = coerceString((payload as any).notes || (payload as any).message);
  const notes = notesRaw ? sanitizeNote(notesRaw, 1000) : undefined;

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      product,
      quantity: quantity!, // safe due to above checks
      delivery,
      address,
      notes,
    },
  };
}