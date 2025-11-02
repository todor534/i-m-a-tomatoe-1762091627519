import { } from 'node:module'; // noop import to ensure ES module; safe to remove if unnecessary

type DeliveryMethod = 'pickup' | 'delivery';

interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
}

interface OrderRequest {
  name: string;
  email: string;
  quantity: number; // pounds of tomatoes
  delivery: DeliveryMethod;
  address?: Address; // required if delivery === 'delivery'
  notes?: string;
  newsletterOptIn?: boolean;
}

interface Pricing {
  currency: 'USD';
  unitPrice: number;
  baseUnitPrice: number;
  subtotalBeforeDiscounts: number;
  volumeDiscount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

const BASE_UNIT_PRICE = 4.0; // $4.00 per lb base
const DELIVERY_FEE = 9.0; // flat delivery fee
const TAX_RATE = 0; // farm produce - treated as 0 for simplicity

export async function handle(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method Not Allowed' }, 405);
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const parse = parseOrderRequest(payload);
  if (!parse.ok) {
    return json({ error: 'Validation failed', details: parse.errors }, 400);
  }
  const data = parse.data;

  const pricing = calculatePricing(data.quantity, data.delivery);

  const now = new Date();
  const orderId = `ORD-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${randomId(6)}`;

  const fulfillment = buildFulfillmentInfo(data.delivery, data.address);

  const responseBody = {
    success: true,
    orderId,
    receivedAt: now.toISOString(),
    customer: {
      name: data.name,
      email: data.email,
      newsletterOptIn: !!data.newsletterOptIn,
    },
    items: [
      {
        sku: 'ORG-TOMATO-1LB',
        name: 'Organic Tomatoes',
        quantity: data.quantity,
        unit: 'lb',
        unitPrice: pricing.unitPrice,
      },
    ],
    pricing,
    fulfillment,
    notes: data.notes || undefined,
  };

  return json(responseBody, 200);
}

function calculatePricing(quantity: number, delivery: DeliveryMethod): Pricing {
  const baseUnitPrice = BASE_UNIT_PRICE;
  const unitPrice = tieredUnitPrice(quantity);
  const subtotalBeforeDiscounts = round2(baseUnitPrice * quantity);
  const subtotal = round2(unitPrice * quantity);
  const volumeDiscount = round2(subtotalBeforeDiscounts - subtotal);
  const deliveryFee = delivery === 'delivery' ? DELIVERY_FEE : 0;
  const tax = round2((subtotal + deliveryFee) * TAX_RATE);
  const total = round2(subtotal + deliveryFee + tax);

  return {
    currency: 'USD',
    unitPrice,
    baseUnitPrice,
    subtotalBeforeDiscounts,
    volumeDiscount,
    subtotal,
    deliveryFee,
    tax,
    total,
  };
}

function tieredUnitPrice(quantity: number): number {
  // Simple tiered pricing
  // 1-9 lb: $4.00/lb
  // 10-24 lb: $3.50/lb
  // 25+ lb: $3.00/lb
  if (quantity >= 25) return 3.0;
  if (quantity >= 10) return 3.5;
  return 4.0;
}

function buildFulfillmentInfo(delivery: DeliveryMethod, address?: Address) {
  if (delivery === 'pickup') {
    const nextSat = nextDayOfWeek(new Date(), 6);
    const window = '9:00 AM - 12:00 PM';
    return {
      method: 'pickup',
      pickup: {
        date: nextSat.toISOString(),
        window,
        location: 'On-farm pickup, 123 Country Lane, Yourtown',
      },
    };
  } else {
    const eta = addBusinessDays(new Date(), 3);
    return {
      method: 'delivery',
      address,
      estimatedDeliveryDate: eta.toISOString(),
    };
  }
}

function parseOrderRequest(input: unknown): { ok: true; data: OrderRequest } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const obj = (typeof input === 'object' && input !== null) ? input as Record<string, unknown> : null;
  if (!obj) {
    return { ok: false, errors: ['Body must be a JSON object'] };
  }

  const name = safeString(obj.name, 2, 80, 'name', errors);
  const email = safeString(obj.email, 5, 120, 'email', errors);
  const quantityVal = toNumber(obj.quantity);
  const delivery = (typeof obj.delivery === 'string' ? obj.delivery : '') as DeliveryMethod;
  const notes = typeof obj.notes === 'string' ? sanitizeNote(obj.notes) : undefined;
  const newsletterOptIn = !!obj.newsletterOptIn;

  if (!name) {
    errors.push('Name is required');
  }
  if (!email || !isValidEmail(email)) {
    errors.push('A valid email is required');
  }
  if (quantityVal == null || !Number.isFinite(quantityVal)) {
    errors.push('Quantity must be a number');
  } else {
    if (!Number.isInteger(quantityVal)) {
      errors.push('Quantity must be an integer number of pounds');
    } else if (quantityVal < 1 || quantityVal > 200) {
      errors.push('Quantity must be between 1 and 200 lbs');
    }
  }
  if (delivery !== 'pickup' && delivery !== 'delivery') {
    errors.push('Delivery must be "pickup" or "delivery"');
  }

  let address: Address | undefined;
  if (delivery === 'delivery') {
    const addrObj = (typeof obj.address === 'object' && obj.address !== null) ? obj.address as Record<string, unknown> : null;
    if (!addrObj) {
      errors.push('Address is required for delivery');
    } else {
      const line1 = safeString(addrObj.line1, 3, 120, 'address.line1', errors);
      const line2 = typeof addrObj.line2 === 'string' ? safeString(addrObj.line2, 0, 120) : undefined;
      const city = safeString(addrObj.city, 2, 80, 'address.city', errors);
      const state = typeof addrObj.state === 'string' ? safeString(addrObj.state, 2, 40) : undefined;
      const postalCode = safeString(addrObj.postalCode, 3, 20, 'address.postalCode', errors);

      if (!line1) errors.push('address.line1 is required');
      if (!city) errors.push('address.city is required');
      if (!postalCode) errors.push('address.postalCode is required');

      if (line1 && city && postalCode) {
        address = { line1, line2, city, state, postalCode };
      }
    }
  }

  if (errors.length) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name: name!,
      email: email!,
      quantity: quantityVal!,
      delivery,
      address,
      notes,
      newsletterOptIn,
    },
  };
}

function isValidEmail(email: string): boolean {
  // Simple email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function safeString(val: unknown, min = 0, max = 255, label?: string, errors?: string[]): string | undefined {
  if (typeof val !== 'string') return undefined;
  let s = val.trim().replace(/\s+/g, ' ');
  if (s.length < min) {
    if (label && errors) errors.push(`${label} must be at least ${min} characters`);
    return undefined;
  }
  if (s.length > max) {
    s = s.slice(0, max);
  }
  return s;
}

function sanitizeNote(note: string): string {
  const s = note.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  return s.slice(0, 500);
}

function toNumber(val: unknown): number | undefined {
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && val.trim() !== '') {
    const n = Number(val);
    return Number.isNaN(n) ? undefined : n;
  }
  return undefined;
}

function addBusinessDays(date: Date, days: number): Date {
  const d = new Date(date);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      added++;
    }
  }
  return d;
}

function nextDayOfWeek(date: Date, dayOfWeek: number): Date {
  const d = new Date(date);
  const delta = (dayOfWeek + 7 - d.getDay()) % 7 || 7;
  d.setDate(d.getDate() + delta);
  return d;
}

function randomId(length = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders() });
}