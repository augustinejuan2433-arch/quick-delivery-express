QUICK DELIVERY EXPRESS — FREE HOSTING STARTER
================================================

Included:
- index.html: branded public homepage
- track.html: public tracking lookup using the Supabase RPC
- admin.html: private staff sign-in, shipment creation and manual status updates
- config.example.js: configuration template
- styles.css, track.js, admin.js

IMPORTANT: This is a starter implementation. It is not yet a production-verified courier platform. Test with dummy shipments before using it for real customer data.

A. Configure the website
1. Copy config.example.js and rename the copy to config.js.
2. Open config.js in a text editor.
3. Replace SUPABASE_URL with:
   https://aqfzyfbhyupomcvveqlz.supabase.co
4. Replace SUPABASE_PUBLISHABLE_KEY with your copied sb_publishable_... key (or the legacy anon/public key if that is the one you copied).
5. Save config.js. Never put a service_role or secret key in this file.
6. Keep config.js alongside index.html, track.html and admin.html.

B. Supabase setup checks
- The shipments table must exist.
- The assign_tracking_number() trigger must exist.
- public_track_shipment(text) must exist and be executable by anon.
- Staff must sign in with the Auth user you created.
- Public sign-ups should remain disabled.
- The current SQL policies grant shipment access to any authenticated user. This is only acceptable while the project has exactly the trusted staff account(s), sign-ups are disabled, and credentials are protected. Before inviting additional users, replace this with an admin-role allowlist/RBAC policy.
- This starter shows latest status only; it does not yet provide a full immutable shipment-event timeline.

C. Free hosting
You can deploy the static files to a free static host such as GitHub Pages or Cloudflare Pages, subject to their current free-plan terms. Upload the files in this folder as the site root. Domain can be connected later.
Do not upload README or config.example as a replacement for config.js. Upload the configured config.js only after checking it contains no secret key.

D. Notifications
The current version supports public tracking and manual status updates. It does NOT send automatic email, SMS or WhatsApp messages yet. Email/SMS delivery needs a provider and secure server-side function; many providers charge. We should add a genuinely free email workflow only after selecting and testing a provider, and never expose provider secrets in browser code.

E. Before real launch
- Add role-based admin authorization and restrict staff policies.
- Add a shipment event-history table and audit log.
- Add server-side notification delivery and delivery failure handling.
- Add privacy policy, terms, contact details, operational procedures, customs/insurance disclosures and legal review.
- Test authentication, RLS, tracking number enumeration resistance, backups and restore.
- Confirm the company is legally authorised and insured for the routes/services advertised.
