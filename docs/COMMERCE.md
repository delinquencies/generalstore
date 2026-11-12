# Commerce operations

Use native Medusa products, categories, collections, variants, price sets, stock locations, inventory items, and reservations where available. Allocate a stable SKU to each sellable variant. A one-of-a-kind record uses one inventory-tracked variant, one available unit, and backorders disabled. Surface provenance, dimensions, photos, and condition in the public catalog. Keep supplier identity, acquisition costs, and internal notes in admin-only storage and exclude them from storefront projections.

For replenishable goods, use variants and optional GTIN where supplied. Model a prepacked multipack as a distinct SKU. Defer shared-component bundles until their inventory deductions can be handled atomically with the component stock. Keep preview fixture prices, availability, and bag state out of production order creation.

Use official Medusa and Stripe integrations. Test successful and declined payment, duplicate and reordered webhooks, cart total changes, expired payment sessions, fulfillment, partial refunds, cancellation, and concurrent attempts to purchase the last unit. Confirm how reservations expire and stock is released before launch.

## Local Medusa catalog preview

1. Install and start local [PostgreSQL for Windows](https://www.postgresql.org/download/windows/). Keep the server local and use a development database. Use Node.js 24 LTS.
2. From a directory next to the storefront, run `npx create-medusa-app@latest generalstore-medusa`. If prompted for a storefront, decline to keep using the Stitch storefront. The [Medusa installer](https://docs.medusajs.com/learn/installation) guides you through database setup. To restart Medusa later, run `npm run dev` in `generalstore-medusa/apps/backend`.
3. Open [Medusa Admin](http://localhost:9000/app). Create or select a USD region and a [publishable API key](https://docs.medusajs.com/resources/storefront-development/publishable-api-keys). Associate the key with the sales channel used by the test products. Link that channel to the inventory location. Publish a one-variant product with a USD price, inventory tracking, and one stocked unit.
4. Set these values in the storefront's ignored `.env.local`, then restart its dev server and open [Shop All](http://localhost:3000/shop).

```dotenv
MEDUSA_BACKEND_URL=http://127.0.0.1:9000
MEDUSA_PUBLISHABLE_KEY=pk_replace_with_your_local_key
MEDUSA_REGION_ID=reg_replace_with_your_usd_region
```

Assign an optional collection handle of `objects`, `home`, `essentials`, or `vintage` for department pages. Set the optional product metadata key `condition` to `New` or `Vintage` for the condition filter. Products outside those collections still appear in Shop All. Set a thumbnail to show a photo.

Check the price, then change stock to zero in Admin and refresh the product detail to verify the sold-out state. Medusa products are read-only during this milestone. The homepage and sample bag still use fixtures. Cart, order creation, and Stripe are subsequent milestones.
