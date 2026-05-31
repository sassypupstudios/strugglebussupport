/**
 * POST /api/subscribe
 * Saves newsletter email signups to Airtable.
 *
 * Airtable setup:
 *   Base: appsOXR5oyQqYQDkB
 *   Table name: "NewsletterSubscribers"
 *   Fields: Email (text), Name (text), SubscribedAt (text), Source (text)
 *
 * Environment variables:
 *   AIRTABLE_API_KEY — same key as the suggest form
 */

const AIRTABLE_BASE  = 'appsOXR5oyQqYQDkB';
const AIRTABLE_TABLE = 'NewsletterSubscribers';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  try {
    const body  = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const name  = (body.name  || '').trim();
    const source = (body.source || 'homepage').trim();

    if (!email || !EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
        status: 400, headers,
      });
    }

    const key = env.AIRTABLE_API_KEY;
    if (!key) {
      return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
        status: 500, headers,
      });
    }

    const atRes = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            Email:        email,
            Name:         name || '(not provided)',
            SubscribedAt: new Date().toISOString(),
            Source:       source,
          },
        }),
      }
    );

    if (!atRes.ok) {
      const err = await atRes.text();
      console.error('Airtable error:', err);
      return new Response(JSON.stringify({ error: 'Could not save. Please try again.' }), {
        status: 502, headers,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });

  } catch (e) {
    console.error('Subscribe error:', e);
    return new Response(JSON.stringify({ error: 'Unexpected error.' }), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
