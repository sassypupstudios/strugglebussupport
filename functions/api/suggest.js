/**
 * Cloudflare Pages Function — POST /api/suggest
 *
 * Environment variables required (set in Cloudflare Pages dashboard):
 *   AIRTABLE_API_KEY   — your Airtable personal access token
 *
 * Airtable base: appsOXR5oyQqYQDkB
 * Table name:    Suggestions
 *
 * Expected table fields:
 *   Name, Category, Address, Phone, Hours, Website,
 *   Eligibility, Description, Submitter Name, Submitter Email, Status
 */

const AIRTABLE_BASE = 'appsOXR5oyQqYQDkB';
const AIRTABLE_TABLE = 'tblOn0Dcxl8sR7ePZ';

export async function onRequestPost({ request, env }) {
  // CORS preflight handled by _headers; reject non-POST just in case
  const origin = request.headers.get('Origin') || '';

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const { name, category, address, phone, hours, website,
          eligibility, description, submitterName, submitterEmail } = body;

  if (!name || !category || !description) {
    return jsonResponse({ error: 'name, category, and description are required' }, 422);
  }

  if (!env.AIRTABLE_API_KEY) {
    console.error('AIRTABLE_API_KEY is not set');
    return jsonResponse({ error: 'Server configuration error' }, 500);
  }

  const record = {
    fields: {
      'Name':            String(name).slice(0, 200),
      'Category':        String(category).slice(0, 100),
      'Address':         String(address || '').slice(0, 300),
      'Phone':           String(phone || '').slice(0, 50),
      'Hours':           String(hours || '').slice(0, 200),
      'Website':         String(website || '').slice(0, 500),
      'Eligibility':     String(eligibility || '').slice(0, 1000),
      'Description':     String(description).slice(0, 2000),
      'Submitter Name':  String(submitterName || '').slice(0, 100),
      'Submitter Email': String(submitterEmail || '').slice(0, 200),
      'Status':          'Pending Review',
    },
  };

  const airtableRes = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.AIRTABLE_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(record),
    }
  );

  if (!airtableRes.ok) {
    const err = await airtableRes.text();
    console.error('Airtable error:', err);
    return jsonResponse({ error: 'Failed to save submission' }, 502);
  }

  return jsonResponse({ success: true }, 201);
}

// Return 405 for anything that isn't POST
export async function onRequest({ request }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }
  return jsonResponse({ error: 'Method not allowed' }, 405);
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
