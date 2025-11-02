import { handle as newsletterSignup } from '../server/handlers/newsletterSignup';

function withCORS(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    const resp = await newsletterSignup(request);
    return withCORS(resp);
  } catch (err) {
    const body = JSON.stringify({ ok: false, error: 'Internal Server Error' });
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return withCORS(new Response(body, { status: 500, headers }));
  }
}