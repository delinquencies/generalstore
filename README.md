# Oddly Enough

Oddly Enough is a general-store storefront preview for vintage finds and everyday goods. The current poster-style storefront lives in `public/plain/`. The owner portal runs on the local preview server.

## Run the storefront locally

Install Node.js 22.18 or later, then run these commands from a terminal.

```sh
git clone https://github.com/delinquencies/generalstore.git
cd generalstore
node scripts/preview-plain.mjs
```

Open [the storefront](http://127.0.0.1:4173/) and [the owner portal](http://127.0.0.1:4173/admin). The preview server uses built-in Node.js modules, so this path needs no npm install. Press Ctrl+C to stop it.

## Use the owner portal

Sign in as `owner` with the password printed in the terminal. The generated password changes each time the server starts. Set `ODDLY_ENOUGH_ADMIN_PASSWORD` in your local environment to choose a persistent password.

1. Add a product with a name, description, department, condition, price, and stock.
2. Add any specifications, search keywords, and packed shipping measurements you have. Item dimensions appear on the product page. Packed measurements feed shipping estimates.
3. Save a draft or upload at least one photo and publish it. The first photo is the cover.
4. Use **Your Products  Edit** to update a listing. **Featured spotlight**, **One of one (1/1)**, and **Sale price** control the storefront treatments. Selecting new photos replaces the existing set.
5. Refresh the storefront after publishing or editing a listing.

Products and photos live in `.oddly-enough/catalog.json`. Test newsletter signups live in `.oddly-enough/newsletter/`. Git ignores this local data and local environment files. Back up the catalog file separately if you want to retain your listings.

## Preview capabilities

- The shop starts with sample inventory. Locally published listings join the catalog.
- Search, department and condition filters, the featured carousel, saved items, and the bag work in the browser. Saved items and bag contents are specific to that browser.
- The optional shipping estimator supports one item at a time. Copy the relevant settings from `.env.example` into `.env.local`, configure a Shippo test token and ship-from address, and start the server with `node --env-file=.env.local scripts/preview-plain.mjs`.
- Checkout is a preview. Payment, order creation, production inventory, and email delivery still need integration. Contact and policy pages still need launch copy.

## Host the static storefront

For a static Cloudflare Pages preview, connect the GitHub repository, leave the build command blank, and use `public/plain` as the output directory. The static preview serves sample inventory. The owner portal, locally saved listings, newsletter capture, and shipping estimates require the local server or a separate production backend.

## Earlier Next.js prototype

The repository also contains an earlier Next.js prototype under `src/`. To run it, use `npm ci` and `npm run dev`, then open [localhost:3000](http://localhost:3000). Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` to verify it. See the [architecture](ARCHITECTURE.md), [implementation plan](IMPLEMENTATION_PLAN.md), and [commerce notes](docs/COMMERCE.md) for background.
