# WorkMart public website

A small, self-contained static website that gives Razorpay (and Google Play) a
public URL with your business info and the required policy pages:

| File | Page |
|---|---|
| `index.html` | Landing — what WorkMart is, how it works |
| `privacy.html` | Privacy Policy (DPDP Act + IT Act aligned) |
| `terms.html` | Terms & Conditions |
| `refunds.html` | Refund & Cancellation Policy (escrow model) |
| `pricing.html` | Pricing & Fees (2% + ₹20 platform fee) |
| `contact.html` | Contact Us + Grievance Officer |
| `styles.css` | Shared styling |

No build step, no dependencies — just static files.

## Before you go live: fill these placeholders
Search the `website/` files and update:
1. **Registered address** — `contact.html` has a `[Your registered business address — India]` placeholder. Add your real address (Razorpay wants a contact address).
2. **Registered entity name** — once your Pvt Ltd is incorporated, you may add "WorkMart is operated by <Company> Pvt Ltd" in the footer/terms. Optional for launch, but keep the site name consistent with what you submit to Razorpay.
3. **Play Store link** — replace the "Download for Android" `href="#"` and "coming soon" note in `index.html` once the app is published.
4. **Email** — the site and app use the official address **`workmartjobs@gmail.com`** for support, privacy and grievance. Make sure this inbox is monitored (Razorpay may email it).

## Deploy it free (pick one — ~5 minutes)

### Option A — Netlify Drop (easiest, no account signup needed to start)
1. Go to **https://app.netlify.com/drop**
2. Drag the whole **`website`** folder onto the page.
3. It gives you a live URL like `https://random-name-123.netlify.app`.
4. (Optional) Create a free account to rename it to something like `workmart.netlify.app` and keep it permanently.

### Option B — Vercel
1. Sign in at **https://vercel.com** (free).
2. "Add New → Project" → drag/upload the `website` folder, or connect the git repo and set the root to `website`.
3. Deploy → you get `https://workmart.vercel.app`.

### Option C — Your own domain (most professional)
Buy `workmart.in` (or similar) and point it at the Netlify/Vercel deployment, or any static host. Razorpay accepts free subdomains, but a real domain looks more legit and matches your email domain.

## What to give Razorpay
In the Razorpay activation form, under **Business / Website details**, paste your live URL (e.g. `https://workmart.netlify.app`). Razorpay specifically checks that these pages are publicly reachable:
- Privacy Policy → `/privacy.html`
- Terms & Conditions → `/terms.html`
- Refund/Cancellation → `/refunds.html`
- Contact Us → `/contact.html`
- Pricing → `/pricing.html`

They're all linked from the site footer, so once the homepage is live, the rest are one click away — which is exactly what the reviewer looks for.

## Keeping it in sync
These pages mirror the policies inside the app (`app/settings/privacy-policy.tsx`,
`terms-of-service.tsx`, `data-retention.tsx`). If you change one, update the other
so they stay consistent.
