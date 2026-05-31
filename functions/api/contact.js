/**
 * POST /api/contact
 * Saves contact form submissions to Airtable.
 *
 * Airtable setup needed:
 *   Base: same as suggest form (appsOXR5oyQqYQDkB)
 *   Table name: "ContactForm"
 *   Fields: Name (text), Email (text), Subject (text), Message (text), SubmittedAt (text), IsFlagReport (checkbox/bool)
 *
 * Environment variables required (Cloudflare Pages → Settings → Environment variables):
 *   AIRTABLE_API_KEY  — same key already used for suggest form
 */

const AIRTABLE_BASE  = 'appsOXR5oyQqYQDkB';
const AIRTABLE_TABLE = 'ContactForm';

export async function onRequestPost({ request, env }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const body = await request.json();
    const { name, email, subject, message, resourceId, resourceName } = body;

    if (!message || message.trim().length < 5) {
      return new Response(JSON.stringify({ error: 'Message is required.' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const fields = {
      Name:        (name  || '').trim() || '(not provided)',
      Email:       (email || '').trim() || '(not provided)',
      Subject:     (subject || 'General').trim(),
      Message:     message.trim(),
      SubmittedAt: new Date().toISOString(),
    };

    if (resourceId) {
      fields.Subject     = 'Problem with listing: ' + (resourceName || resourceId);
      fields.ResourceId  = resourceId;
      fields.ResourceUrl = 'https://strugglebussupport.org/resource.html?id=' + resourceId;
    }

    const key = env.AIRTABLE_API_KEY;
    if (!key) {
      console.error('AIRTABLE_API_KEY not set');
      return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
        status: 500,
        headers: corsHeaders,
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
        body: JSON.stringify({ fields }),
      }
    );

    if (!atRes.ok) {
      const err = await atRes.text();
      console.error('Airtable error:', err);
      return new Response(JSON.stringify({ error: 'Could not save — please email hello@strugglebussupport.org directly.' }), {
        status: 502,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    console.error('Contact handler error:', e);
    return new Response(JSON.stringify({ error: 'Unexpected error. Please try again.' }), {
      status: 500,
      headers: corsHeaders,
    });
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
