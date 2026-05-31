/**
 * POST /api/mark-verified
 * Called by admin.html when Kiran clicks "Submit All Verified."
 * Saves verified resource IDs + today's date to Airtable,
 * then sends an email summary to the site owner.
 *
 * Airtable setup:
 *   Base: appsOXR5oyQqYQDkB
 *   Table name: "VerifiedDates"
 *   Fields: ResourceId (text), VerifiedOn (text)
 *
 * Environment variables (Cloudflare Pages dashboard):
 *   AIRTABLE_API_KEY  — same key as suggest form
 *   OWNER_EMAIL       — email address to notify (e.g. hello@strugglebussupport.org)
 *
 * Email is sent via Cloudflare MailChannels (free, no extra API key).
 * Requires SPF record: "v=spf1 include:relay.mailchannels.net ~all"
 * on the strugglebussupport.org domain DNS.
 */

const AIRTABLE_BASE  = 'appsOXR5oyQqYQDkB';
const AIRTABLE_TABLE = 'VerifiedDates';

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  try {
    const { verifiedIds } = await request.json();

    if (!Array.isArray(verifiedIds) || verifiedIds.length === 0) {
      return new Response(JSON.stringify({ error: 'No verified IDs provided.' }), { status: 400, headers });
    }

    const today = new Date().toISOString().split('T')[0];
    const key   = env.AIRTABLE_API_KEY;

    // Save each verified ID to Airtable
    const results = [];
    for (const id of verifiedIds) {
      try {
        const res = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${key}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fields: { ResourceId: id, VerifiedOn: today } }),
          }
        );
        results.push({ id, ok: res.ok });
      } catch (e) {
        results.push({ id, ok: false, error: e.message });
      }
    }

    // Build code snippet for owner to paste into data.js
    const codeSnippet = verifiedIds.map(id => `  '${id}': '${today}',`).join('\n');

    // Send email to owner via MailChannels
    const ownerEmail = env.OWNER_EMAIL;
    if (ownerEmail) {
      try {
        await fetch('https://api.mailchannels.net/tx/v1/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: ownerEmail, name: 'Site Owner' }] }],
            from: { email: 'verify@strugglebussupport.org', name: 'Struggle Bus Support' },
            subject: `Kiran verified ${verifiedIds.length} listing${verifiedIds.length !== 1 ? 's' : ''} — ${today}`,
            content: [{
              type: 'text/plain',
              value: [
                `Kiran completed verification for ${verifiedIds.length} listings on ${today}.`,
                '',
                'Paste the following into VERIFIED_DATES in js/data.js:',
                '',
                codeSnippet,
                '',
                'Then commit and push to deploy the update.',
                '',
                '— Struggle Bus Support automated notification',
              ].join('\n'),
            }],
          }),
        });
      } catch (e) {
        // Email failure is non-critical — verifications are still saved to Airtable
        console.warn('Email send failed:', e.message);
      }
    }

    const saved   = results.filter(r => r.ok).length;
    const failed  = results.filter(r => !r.ok).length;

    return new Response(JSON.stringify({
      success: true,
      saved,
      failed,
      message: `Saved ${saved} verification${saved !== 1 ? 's' : ''} to Airtable.${ownerEmail ? ' Owner notified by email.' : ''}`,
    }), { status: 200, headers });

  } catch (e) {
    console.error('mark-verified error:', e);
    return new Response(JSON.stringify({ error: 'Server error — try again.' }), { status: 500, headers });
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
