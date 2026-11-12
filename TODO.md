# Oddly Enough launch checklist

## 1. Put the storefront preview online

- [x] Push the storefront and setup instructions to [GitHub](https://github.com/delinquencies/generalstore).
- [x] Cap product detail photo height and show the full image.
- [x] Label the static preview as sample inventory and disable checkout, shipping estimates, and newsletter signup on static hosting.
- [ ] In Cloudflare Pages, connect `delinquencies/generalstore` and select `main` as the production branch.
- [ ] Select **None** as the framework preset, leave the build command blank, and set the build output directory to `public/plain`. Leave the root directory at the repository root.
- [ ] Deploy to the Cloudflare preview URL. Check the homepage, search, featured carousel, product pages, saved items, and bag on a phone and desktop.

## 2. Prepare the store and catalog

- [ ] Confirm the public store name, support email, domain, and social or marketplace URLs. Link only profiles and storefronts that are ready.
- [ ] Review the [draft policies](docs/STORE_POLICIES.md), confirm shipping and returns commitments, fill in the support email and legal seller name, and publish the approved pages.
- [ ] Prepare real launch listings with owned photos, prices, stock, condition, and packed dimensions and weights. Include close-ups of wear and maker’s marks where they help.
- [ ] Choose a production commerce backend and a way to migrate local listings and photos. Set up owner access, backups, and a tested restore.
- [ ] Remove sample products from the live catalog and verify real listing, search, availability, and sale information.

## 3. Make checkout and fulfillment work

- [ ] Confirm the payment provider and configure its test environment. Wire checkout to server-side pricing, tax, shipping, stock checks, and order creation.
- [ ] Configure shipping rates for single-item and multi-item orders. Confirm the ship-from address, then test labels and tracking.
- [ ] Set up payment confirmation, receipts, order and shipping emails, refunds, and an owner view for open orders.
- [ ] Prevent two customers from purchasing the same one-of-one item. Test competing carts, failed payments, duplicate payment events, cancellations, and refunds.
- [ ] Connect The Next Find form to the email service, verify consent and unsubscribe, and send a test email. Keep signup disabled online until that flow works.

## 4. Run the launch check

- [ ] Place and fulfill an end-to-end test order on the hosted store, including payment, stock update, receipt, shipping, and refund.
- [ ] Check keyboard and mobile navigation, image loading, product-page metadata, and broken links.
- [ ] Connect the production domain and verify HTTPS. Remove the storefront’s `noindex` directive once the real catalog and checkout are ready.

Local setup and preview limitations are in [README.md](README.md).
