# Chemin Serein — Portfolio Demo

A fully self-contained demo version of the funeral coordination platform.
**There is no real database anywhere in this bundle.** Every "backend" call
is intercepted by `assets/mock-backend.js` and answered from fake data that
lives entirely in the visitor's own browser tab (sessionStorage) — nothing
is ever sent over the network, and nothing persists between visits.

## How it behaves
- Fresh visit (new tab) → clean, identical demo data every time
- While someone is actively clicking around → their changes (a booking made,
  a review submitted, a family file edited) stick around and show up
  elsewhere in the demo, so the "whole system working together" effect
  still comes through
- Closing the tab and coming back → resets to clean again

## Demo logins

**Staff dashboard** (`dashboard.html`):
| Email | Password | Role |
|---|---|---|
| sophie@demo.local | demo123 | Admin |
| marc@demo.local | demo123 | Staff |
| isabelle@demo.local | demo123 | Photographer |

**Family portal** (`portal.html`):
| Email | Password |
|---|---|
| julie.bernard@example.com | demo1234 |

To demo the **sign-up** flow instead of just signing in, use
`nathalie.g@example.com` (any password, 8+ characters) — that family file
is deliberately left unlinked so the "create portal access" path can be
shown too.

## What's genuinely interactive
- Public booking (view real availability, book, then cancel/reschedule
  using the reference code it gives you)
- Live chat (keyword-based auto-replies, same logic as the real site)
- Contact form, job applications, review submission
- Family portal (timeline, documents, messages, invoice, uploads)
- The full staff dashboard (inquiries, family files, jobs, staff, booking
  management, live chat inbox, reviews moderation, invoicing, etc.)

## Deploying it
Upload this whole folder to a **separate** GitHub repo (not the client's
real one) with GitHub Pages enabled, same as the live site. Nothing in here
references the real project in any way — brand name, logo, and all
credentials have been replaced with fictional placeholders.

## What's fake vs. real behavior
Everything is functionally real *except* there's no actual server. A few
specific simplifications worth knowing about:
- File "uploads" are remembered by name only — there's no real file storage,
  so "viewing" an uploaded document shows a placeholder image, not the
  actual file content
- Realtime cross-device sync is a no-op (harmless) since there's only ever
  one visitor in a demo — nothing to sync with
- The `_demo_password` values are plain text in the seed data, obviously
  not how real authentication works — totally fine here since none of it
  is real
