export const TOMATO_VARIETIES = ['Heirloom', 'Roma', 'Cherry', 'Beefsteak', 'San Marzano'] as const;
export type TomatoVariety = typeof TOMATO_VARIETIES[number];

export const PACKAGE_SIZES = ['1 lb', '3 lb', '5 lb', '10 lb'] as const;
export type PackageSize = typeof PACKAGE_SIZES[number];

export const DELIVERY_METHODS = ['pickup', 'delivery'] as const;
export type DeliveryMethod = typeof DELIVERY_METHODS[number];

export type CurrencyCode = 'USD';

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'OUT_OF_STOCK'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

export interface PricingTier {
  size: PackageSize;
  priceCents: number;
  compareAtCents?: number;
}

export interface ProductOffering {
  id: string;
  name: string;
  description?: string;
  varieties: TomatoVariety[];
  sizes: PricingTier[];
  inStock: boolean;
  imageUrl?: string;
}

export interface OrderItem {
  variety: TomatoVariety;
  size: PackageSize;
  quantity: number;
  unitPriceCents: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface DeliveryInfo {
  method: DeliveryMethod;
  requestedDate?: string; // ISO date string (YYYY-MM-DD)
  address?: Address; // required when method === 'delivery'
  instructions?: string;
}

export interface CartTotals {
  subtotalCents: number;
  deliveryFeeCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  currency: CurrencyCode;
}

export interface OrderRequest {
  customer: CustomerInfo;
  items: OrderItem[];
  delivery: DeliveryInfo;
  newsletterOptIn?: boolean;
  notes?: string;
  // For idempotency on server side (optional)
  clientId?: string;
}

export interface OrderResponseData {
  orderId: string;
  totals: CartTotals;
  estimatedReady?: string; // ISO datetime string
}

export type ValidationErrors = Record<string, string>;

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  message?: string;
  status?: number;
};

export type ApiFailure = {
  ok: false;
  message: string;
  errors?: ValidationErrors;
  code?: ErrorCode;
  status?: number;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface NewsletterSignupRequest {
  email: string;
  firstName?: string;
  source?: 'hero' | 'footer' | 'checkout' | 'other';
}

export interface NewsletterSignupData {
  subscribed: boolean;
}

export interface BenefitItem {
  title: string;
  description: string;
  iconUrl?: string; // e.g., https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762089938749-img-icon-organic.png
}

export interface Testimonial {
  quote: string;
  author: string;
  location?: string;
  avatarUrl?: string; // e.g., https://jg7nnjuy9jonydmm.public.blob.vercel-storage.com/ai/1762089980949-img-avatar-jane.png
  rating?: number; // 1-5
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface HeroCta {
  label: string;
  href?: string;
  onClickId?: string; // element id to scroll to
}

export type OrderApiResponse = ApiResponse<OrderResponseData>;
export type NewsletterApiResponse = ApiResponse<NewsletterSignupData>;