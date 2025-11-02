import { handle as createOrder } from '../server/handlers/createOrder';

const jsonHeaders = { 'Content-Type': 'application/json' };

export default async function handler(req: Request): Promise<Response> {
  try {
    const method = (req.method || 'GET').toUpperCase();

    if (method === 'POST') {
      return await createOrder(req);
    }

    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: { Allow: 'POST', ...jsonHeaders },
      });
    }

    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...jsonHeaders, Allow: 'POST' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal Server Error' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
}