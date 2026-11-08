# Instant downloads (M Linx shop)

Digital templates sold on `/marketplace#downloads`. Pay with Stripe, download right away.

## What's in the code

| Piece | File |
|---|---|
| Products, prices shown, private ideas list | `lib/shop.ts` |
| Stripe calls, signed download links | `lib/shopServer.ts` |
| Starts checkout | `app/api/shop/checkout/route.ts` |
| Thank-you page (checks the payment, shows the link) | `app/shop/thanks/page.tsx` |
| Hands out the file | `app/api/shop/download/route.ts` |
| The files themselves (never public) | `private/downloads/` |
| Product previews (real captures of the files) | `public/shots/shop/` |

A product only shows **Buy & download** when `STRIPE_SECRET_KEY`, its price id and `SHOP_DOWNLOAD_SECRET` (32+ characters) are all set. Otherwise it shows **Coming soon · ask me**.

## Turning it on (Meg)

1. **Stripe account** for M Studio (dashboard.stripe.com). Stay in **test mode** first.
2. **Managed Payments:** Settings → Managed Payments → accept the terms. Stripe becomes the merchant of record and handles sales tax. It adds 3.5% on top of normal fees. To skip it, set `STRIPE_MANAGED_PAYMENTS=0` (then sales tax is yours to handle).
3. **Products:** create three one-time products and copy each **price id** (`price_...`):
   - Cleaning Quote Calculator, $19
   - Turnover Checklist & Onboarding Pack, $15
   - Guest Welcome Book Template, $12
   Pick a **product tax code marked "Eligible for Managed Payments"** for each (a digital download / digital content code). If none fits a template, Stripe will say so; then use `STRIPE_MANAGED_PAYMENTS=0`.
4. **Vercel → Project → Settings → Environment Variables:** add the values from `.env.example` (shop section). `SHOP_DOWNLOAD_SECRET` is any random 32+ characters (`openssl rand -hex 32`).
5. **Redeploy.** Buy each product once with the test card `4242 4242 4242 4242`, check the download opens.
6. Swap to **live** keys and live price ids, redeploy.

If prices change, change them in Stripe **and** `priceLabel` in `lib/shop.ts`.

## Adding a product

1. Add a line to `shopIdeas` in `lib/shop.ts` the moment the idea comes up.
2. When it's ready: put the file in `private/downloads/`, a real preview in `public/shots/shop/`, and an entry in `shopProducts` with a new `priceEnv`.
3. Create the product in Stripe and set the env var.

## Not built yet

- No webhook or order database. Stripe keeps the order record and emails the receipt; the thank-you page URL is the buyer's way back to the file.
- Not tested against a real Stripe account yet (none existed when this was written). Do step 5 before going live.
- Refunds happen in the Stripe dashboard.
