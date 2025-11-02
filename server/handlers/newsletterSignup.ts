export type NewsletterRequestBody = {
  email?: string;
  name?: string;
  source?: string;
  honeypot?: string;
  hp?: string;
  website?: string;
};

const CORS_HEADERS: HeadersInit = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

const JSON_HEADERS: HeadersInit = {
  ...CORS_HEADERS,
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

// Naive in-memory store to de-duplicate and rate-limit within a single instance
const subscribedEmails = new Set<string>();
const lastAttempt = new Map<string, number>(); // key: ip|email -> timestamp

const RATE_LIMIT_WINDOW_MS = 10_000; // 10s per ip+email

export async function handle(req: Request): Promise<Response> {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (req.method !== 'POST') {
      return json({ success: false, error: 'Method Not Allowed' }, 405);
    }

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return json({ success: false, error: 'Unsupported Media Type' }, 415);
    }

    let body: NewsletterRequestBody;
    try {
      body = await req.json();
    } catch {
      return json({ success: false, error: 'Invalid JSON body' }, 400);
    }

    const rawEmail = (body.email ?? '').toString().trim().toLowerCase();
    const name = sanitizeName((body.name ?? '').toString());
    const honeypot =
      (body.honeypot ?? body.hp ?? body.website ?? '').toString().trim();

    // Honeypot trap: silently succeed to avoid tipping off bots
    if (honeypot) {
      return json({
        success: true,
        data: { email: rawEmail || undefined, name: name || undefined, ignored: true },
      });
    }

    if (!rawEmail) {
      return json({ success: false, error: 'Email is required' }, 400);
    }

    if (!isValidEmail(rawEmail)) {
      return json({ success: false, error: 'Please provide a valid email address' }, 400);
    }

    // Rate limit by IP+email
    const ip = getClientIp(req);
    const rateKey = `${ip}|${rawEmail}`;
    const now = Date.now();
    const last = lastAttempt.get(rateKey) ?? 0;
    if (now - last < RATE_LIMIT_WINDOW_MS) {
      return json({ success: false, error: 'Too many requests, please try again shortly' }, 429);
    }
    lastAttempt.set(rateKey, now);

    // De-duplicate within this instance
    const alreadySubscribed = subscribedEmails.has(rawEmail);
    if (!alreadySubscribed) {
      subscribedEmails.add(rawEmail);
    }

    // Here you could integrate with an email service provider (Mailchimp, ConvertKit, etc.)
    // For this demo, we simulate a successful subscription.

    return json({
      success: true,
      data: {
        email: rawEmail,
        name: name || undefined,
        alreadySubscribed,
      },
      message: alreadySubscribed
        ? 'You are already on the list. Thanks!'
        : 'Thanks for signing up! We will be in touch soon.',
    });
  } catch (err) {
    console.error('newsletterSignup error:', err);
    return json({ success: false, error: 'Unexpected server error' }, 500);
  }
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS,
  });
}

function isValidEmail(email: string): boolean {
  if (email.length < 6 || email.length > 254) return false;
  // Simple RFC5322-ish heuristic
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function sanitizeName(name: string): string {
  // Remove control characters and trim
  let n = name.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  // Limit length
  if (n.length > 100) n = n.slice(0, 100);
  return n;
}

function getClientIp(req: Request): string {
  // Common proxy headers
  const headers = req.headers;
  const direct = headers.get('cf-connecting-ip')
    || headers.get('x-real-ip')
    || (headers.get('x-forwarded-for') || '').split(',')[0].trim();
  return direct || '0.0.0.0';
}