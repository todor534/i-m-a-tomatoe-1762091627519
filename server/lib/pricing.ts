/**
 * Pricing utilities for organic tomato orders
 * - Defines catalog SKUs and prices
 * - Calculates subtotal, bulk discounts, coupons, shipping, tax, and total
 * - Pure TypeScript, no external dependencies
 */

export type Currency = 'USD';

export type ShippingMethod = 'standard' | 'express' | 'pickup';

export type CatalogSku = {
  sku: string;
  name: string;
  unitLabel: string; // e.g., "1 lb", "5 lb box"
  unitWeightLb: number;
  unitPrice: number; // in USD dollars
  maxPerOrder?: number;
  minPerOrder?: number;
  description?: string;
};

export type Coupon = {
  code: string;
  type: 'percent' | 'fixed' | 'shipping';
  percent?: number; // 0.10 for 10%
  amount?: number; // fixed dollars
  minSubtotal?: number; // applies to item subtotal after bulk discount
  requiresNewCustomer?: boolean;
  appliesToShippingMethod?: ShippingMethod[]; // if type is 'shipping'
  expiresAt?: string; // ISO date string
  label: string;
};

export type PricingInput = {
  items: Array<{ sku: string; quantity: number }>;
  shippingMethod?: ShippingMethod;
  country?: string;
  region?: string; // state/province code
  zip?: string;
  couponCode?: string | null;
  newCustomer?: boolean;
};

export type LineItem = {
  sku: string;
  name: string;
  unitPrice: number;
  unitLabel: string;
  quantity: number;
  lineSubtotal: number;
  weightLb: number;
};

export type ShippingBreakdown = {
  method: ShippingMethod;
  cost: number;
  description: string;
  freeThreshold?: number;
  cappedAt?: number;
};

export type CouponBreakdown = {
  code: string;
  amount: number;
  label: string;
  reason?: string;
};

export type BulkDiscountBreakdown = {
  percent: number;
  amount: number;
  tierName: string | null;
};

export type TaxBreakdown = {
  rate: number; // 0.00 for 0%
  amount: number;
  label: string;
};

export type PricingResult = {
  currency: Currency;
  items: LineItem[];
  subtotal: number; // before discounts
  bulkDiscount: BulkDiscountBreakdown;
  coupon?: CouponBreakdown | null;
  discountTotal: number; // bulk + coupon
  shipping: ShippingBreakdown;
  tax: TaxBreakdown;
  totalWeightLb: number;
  total: number;
  notes?: string[];
};

const CURRENCY: Currency = 'USD';

/**
 * Catalog definition
 * Prices reflect seasonal direct-from-farm organic tomatoes
 */
const CATALhttps://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762089894384-img-og.png: CatalogSku[] = [
  {
    sku: 'tomato-1lb',
    name: 'Organic Tomatoes - 1 lb',
    unitLabel: '1 lb bag',
    unitWeightLb: 1,
    unitPrice: 4.5,
    maxPerOrder: 40,
    description: 'Perfect for a salad or two — field-ripened, same-week harvest.',
  },
  {
    sku: 'tomato-5lb',
    name: 'Organic Tomatoes - 5 lb',
    unitLabel: '5 lb box',
    unitWeightLb: 5,
    unitPrice: 20,
    maxPerOrder: 30,
    description: 'Great value for families and weekly meal prep.',
  },
  {
    sku: 'tomato-10lb',
    name: 'Organic Tomatoes - 10 lb',
    unitLabel: '10 lb box',
    unitWeightLb: 10,
    unitPrice: 36,
    maxPerOrder: 20,
    description: 'Best for batch cooking, canning, or sharing.',
  },
  {
    sku: 'tomato-20lb',
    name: 'Organic Tomatoes - 20 lb',
    unitLabel: '20 lb crate',
    unitWeightLb: 20,
    unitPrice: 64,
    maxPerOrder: 10,
    description: 'Chef and canner favorite — biggest savings per pound.',
  },
];

/**
 * Published coupon list
 * Add/update here to change available promotions.
 */
const COUPONS: Coupon[] = [
  {
    code: 'FRESHTOMATO10',
    type: 'percent',
    percent: 0.1,
    minSubtotal: 25,
    label: '10% off fresh pickings',
  },
  {
    code: 'HARVEST20',
    type: 'percent',
    percent: 0.2,
    minSubtotal: 80,
    label: '20% off harvest orders $80+',
  },
  {
    code: 'WELCOME5',
    type: 'fixed',
    amount: 5,
    requiresNewCustomer: true,
    minSubtotal: 20,
    label: 'Welcome bonus $5 off',
  },
  {
    code: 'FREESHIP',
    type: 'shipping',
    appliesToShippingMethod: ['standard'],
    minSubtotal: 45,
    label: 'Free standard shipping $45+',
  },
  {
    code: 'LOCALPICKUP',
    type: 'shipping',
    appliesToShippingMethod: ['pickup'],
    label: 'Free local pickup',
  },
];

/**
 * Bulk discount tiers based on total weight
 */
type BulkTier = { minLb: number; percent: number; name: string };
const BULK_TIERS: BulkTier[] = [
  { minLb: 100, percent: 0.12, name: 'Farm Partner 12% off (100+ lb)' },
  { minLb: 60, percent: 0.08, name: 'Canner 8% off (60+ lb)' },
  { minLb: 30, percent: 0.05, name: 'Family 5% off (30+ lb)' },
];

const FREE_SHIPPING_THRESHOLD = 99;
const STANDARD_BASE = 8;
const STANDARD_PER_LB = 0.3;
const STANDARD_CAP = 29;

const EXPRESS_BASE = 18;
const EXPRESS_PER_LB = 0.6;
const EXPRESS_CAP = 49;

// Fresh produce generally tax-exempt in many states.
// Default to 0% tax unless a jurisdiction requires otherwise.
// This implementation keeps it at 0 with a clear label.
const DEFAULT_TAX_RATE = 0;
const TAX_LABEL = 'Fresh produce (tax-exempt)';

// Utility helpers
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function findSku(sku: string): CatalogSku | undefined {
  return CATALhttps://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762089894384-img-og.png.find((s) => s.sku === sku);
}

function normalizeCode(code?: string | null): string | null {
  if (!code) return null;
  return code.toString().trim().toUpperCase() || null;
}

function getCoupon(code?: string | null): Coupon | undefined {
  const norm = normalizeCode(code);
  if (!norm) return undefined;
  return COUPONS.find((c) => c.code.toUpperCase() === norm);
}

function isExpired(coupon: Coupon): boolean {
  if (!coupon.expiresAt) return false;
  const now = new Date();
  const exp = new Date(coupon.expiresAt);
  return now.getTime() > exp.getTime();
}

function computeBulkDiscount(subtotal: number, totalLb: number): BulkDiscountBreakdown {
  const tier = BULK_TIERS.find((t) => totalLb >= t.minLb);
  if (!tier) {
    return { percent: 0, amount: 0, tierName: null };
  }
  const amount = round2(subtotal * tier.percent);
  return { percent: tier.percent, amount, tierName: tier.name };
}

function computeShipping(subtotalAfterDiscounts: number, totalLb: number, method: ShippingMethod): ShippingBreakdown {
  if (method === 'pickup') {
    return {
      method,
      cost: 0,
      description: 'Free local farm pickup',
    };
  }

  if (method === 'standard') {
    if (subtotalAfterDiscounts >= FREE_SHIPPING_THRESHOLD) {
      return {
        method,
        cost: 0,
        description: `Free standard shipping on $${FREE_SHIPPING_THRESHOLD}+`,
        freeThreshold: FREE_SHIPPING_THRESHOLD,
      };
    }
    const cost = Math.min(STANDARD_CAP, STANDARD_BASE + STANDARD_PER_LB * totalLb);
    return {
      method,
      cost: round2(cost),
      description: `Standard: $${STANDARD_BASE} + $${STANDARD_PER_LB.toFixed(2)}/lb (cap $${STANDARD_CAP})`,
      freeThreshold: FREE_SHIPPING_THRESHOLD,
      cappedAt: STANDARD_CAP,
    };
  }

  // express
  const cost = Math.min(EXPRESS_CAP, EXPRESS_BASE + EXPRESS_PER_LB * totalLb);
  return {
    method,
    cost: round2(cost),
    description: `Express: $${EXPRESS_BASE} + $${EXPRESS_PER_LB.toFixed(2)}/lb (cap $${EXPRESS_CAP})`,
    cappedAt: EXPRESS_CAP,
  };
}

function applyCoupon(
  coupon: Coupon | undefined,
  {
    newCustomer,
    shippingMethod,
    subtotalAfterBulk,
    currentShippingCost,
  }: {
    newCustomer?: boolean;
    shippingMethod: ShippingMethod;
    subtotalAfterBulk: number;
    currentShippingCost: number;
  }
): CouponBreakdown | null {
  if (!coupon) return null;
  if (isExpired(coupon)) {
    return { code: coupon.code, amount: 0, label: coupon.label, reason: 'Expired' };
  }
  if (coupon.requiresNewCustomer && !newCustomer) {
    return { code: coupon.code, amount: 0, label: coupon.label, reason: 'New customers only' };
  }
  if (coupon.minSubtotal && subtotalAfterBulk < coupon.minSubtotal) {
    return {
      code: coupon.code,
      amount: 0,
      label: coupon.label,
      reason: `Requires $${coupon.minSubtotal}+ subtotal`,
    };
  }

  if (coupon.type === 'shipping') {
    if (coupon.appliesToShippingMethod && !coupon.appliesToShippingMethod.includes(shippingMethod)) {
      return { code: coupon.code, amount: 0, label: coupon.label, reason: 'Not valid for chosen shipping' };
    }
    const amount = round2(Math.min(currentShippingCost, currentShippingCost)); // cannot exceed shipping
    return { code: coupon.code, amount, label: coupon.label };
  }

  if (coupon.type === 'fixed') {
    const amount = round2(Math.min(coupon.amount || 0, subtotalAfterBulk));
    return { code: coupon.code, amount, label: coupon.label };
  }

  if (coupon.type === 'percent') {
    const amount = round2(subtotalAfterBulk * (coupon.percent || 0));
    return { code: coupon.code, amount, label: coupon.label };
  }

  return null;
}

/**
 * Public API
 */

export function listCatalog(): CatalogSku[] {
  return CATALhttps://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762089894384-img-og.png.slice();
}

export function isValidSku(sku: string): boolean {
  return !!findSku(sku);
}

export function getSkuDetails(sku: string): CatalogSku | undefined {
  return findSku(sku);
}

export function listCoupons(): Coupon[] {
  return COUPONS.slice();
}

/**
 * Calculate full pricing for an order
 */
export function calculatePricing(input: PricingInput): PricingResult {
  const shippingMethod: ShippingMethod = input.shippingMethod || 'standard';

  // Build line items
  const items: LineItem[] = [];
  for (const rawItem of input.items || []) {
    const detail = findSku(rawItem.sku);
    if (!detail) continue;

    const maxQ = detail.maxPerOrder ?? 999;
    const minQ = detail.minPerOrder ?? 1;
    const qty = clamp(Math.floor(rawItem.quantity || 0), minQ, maxQ);
    if (qty <= 0) continue;

    const lineSubtotal = round2(detail.unitPrice * qty);
    items.push({
      sku: detail.sku,
      name: detail.name,
      unitPrice: detail.unitPrice,
      unitLabel: detail.unitLabel,
      quantity: qty,
      lineSubtotal,
      weightLb: detail.unitWeightLb * qty,
    });
  }

  const subtotal = round2(items.reduce((sum, li) => sum + li.lineSubtotal, 0));
  const totalWeightLb = items.reduce((sum, li) => sum + li.weightLb, 0);

  // Bulk discount
  const bulkDiscount = computeBulkDiscount(subtotal, totalWeightLb);
  const afterBulk = round2(Math.max(0, subtotal - bulkDiscount.amount));

  // Base shipping before coupon
  let shipping = computeShipping(afterBulk, totalWeightLb, shippingMethod);

  // Coupon
  const couponDef = getCoupon(input.couponCode);
  let couponBreakdown = applyCoupon(couponDef, {
    newCustomer: input.newCustomer,
    shippingMethod,
    subtotalAfterBulk: afterBulk,
    currentShippingCost: shipping.cost,
  });

  // If coupon type was 'shipping' and valid, zero shipping by that amount
  if (couponBreakdown && couponDef && couponDef.type === 'shipping') {
    const applyAmount = round2(Math.min(shipping.cost, couponBreakdown.amount));
    shipping = { ...shipping, cost: round2(shipping.cost - applyAmount) };
    couponBreakdown = { ...couponBreakdown, amount: applyAmount };
  }

  // If coupon type affects subtotal, leave shipping untouched
  const couponAmountAffectsSubtotal =
    couponBreakdown && couponDef && (couponDef.type === 'fixed' || couponDef.type === 'percent')
      ? couponBreakdown.amount
      : 0;

  const subtotalAfterAllDiscounts = round2(Math.max(0, afterBulk - (couponAmountAffectsSubtotal || 0)));

  // Re-check free standard shipping threshold if shipping is standard and not already zeroed by coupon
  if (shippingMethod === 'standard' && shipping.cost > 0 && subtotalAfterAllDiscounts >= FREE_SHIPPING_THRESHOLD) {
    shipping = { ...shipping, cost: 0, description: `Free standard shipping on $${FREE_SHIPPING_THRESHOLD}+` };
  }

  // Tax
  const taxRate = DEFAULT_TAX_RATE;
  const taxAmount = round2(subtotalAfterAllDiscounts * taxRate);
  const tax: TaxBreakdown = { rate: taxRate, amount: taxAmount, label: TAX_LABEL };

  const discountTotal = round2(bulkDiscount.amount + (couponBreakdown?.amount || 0));
  const total = round2(subtotalAfterAllDiscounts + shipping.cost + tax.amount);

  const notes: string[] = [];
  if (bulkDiscount.percent > 0 && bulkDiscount.tierName) {
    notes.push(bulkDiscount.tierName);
  }
  if (shipping.method === 'standard' && shipping.cost === 0) {
    notes.push(`Free standard shipping threshold met ($${FREE_SHIPPING_THRESHOLD})`);
  }
  if (couponBreakdown && couponBreakdown.amount > 0) {
    notes.push(`Coupon applied: ${couponBreakdown.code}`);
  }
  if (items.length === 0) {
    notes.push('No valid items in order');
  }

  return {
    currency: CURRENCY,
    items,
    subtotal,
    bulkDiscount,
    coupon: couponBreakdown,
    discountTotal,
    shipping,
    tax,
    totalWeightLb,
    total,
    notes,
  };
}