# Hair by Lynna — interactive portfolio demo

Public entry: [index.html](./index.html)

**Purpose:** demonstrate the user-facing flow and administrative functions of the salon booking project for Chezmaxo's portfolio. This is an independently authored, simplified mock, **not** the client's production booking application.

## What visitors can try

- English/French switch and responsive salon design
- Service selection, Sunday-first appointment calendar and example appointment times
- Creating an in-memory fictional booking (no email or payment is sent)
- Customer booking-status panel and reporting a fictional deposit sent
- Owner dashboard with fictional bookings: approve, decline, cancel, reschedule, mark a sample deposit verified, mark completed
- Toggle example availability and see aggregate fictional statistics
- Preview simulated Email/Telegram event notices in the status panel
- Reset demo or reload to restore sample data

## Privacy and isolation

- No real Hair by Lynna database records, appointments, admin users, credentials, keys, business address or customer email addresses.
- **No Supabase, Brevo, Telegram, payments, or API requests.**
- Sample names use Demo / Sample / Example and emails use the non-deliverable `example.test` domain.
- Data is kept **in memory only**, not localStorage, cookies, sessionStorage or a server. Refresh resets the demo.
- Any text visitors enter is used for that tab's mock record only. The interface explicitly says not to enter real personal information.
- Artwork and the portfolio thumbnail are original CSS/SVG illustrations rather than client photographs.
- Do not confuse this portfolio demo with a functioning client booking channel. All actionable UI is labeled as a demo.

## Deployment

Static HTML/CSS/JS under `demos/hair-by-lynna/`, no build steps or dependencies. The portfolio card is in `portfolio.html` and its EN/FR copy is in `js/i18n.js`.

Chezmaxo production (subject to hosting deployment): `https://www.chezmaxo.ca/demos/hair-by-lynna/index.html`.

**Note:** For a client-approved public case study, check any contractual or branding approvals with Lynna. This demo does not copy the real client database or private operational settings.
