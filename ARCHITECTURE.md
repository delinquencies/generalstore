# Architecture

## Stage 2 application

The app lives in the root of the generalstore checkout. Route entry points and metadata live in `src/app`. Stitch sections and shared storefront components live in `src/components`. The fixture catalog and media references live in `src/lib`. Search and collection filtering run in App Router server components. Interactive bag, favorites, and homepage filters are client components. The browser bag stores SKU-linked handles and quantities for this preview. The server fixture catalog determines the displayed unit prices and quantity limits.

The approved HTML establishes the frontend styling. Tailwind 3.4.17 retains the utility behavior and plugin syntax of the export. Next.js 16.4 and React 19 are declared as compatible major release ranges. Use Node 22 LTS, generate and commit a dependency lockfile after installation, and verify the resolved versions before merging.

## Commerce backend

Add a separate Medusa v2 application in Stage 3. Select and pin a stable Medusa release against its installation requirements, PostgreSQL compatibility, and Stripe provider documentation when initializing it. Use a Medusa-supported PostgreSQL version, one initial stock location and sales channel, Stripe's supported payment provider, and an S3-compatible file provider. Keep Medusa Admin with the commerce service and use its product, price, order, inventory, fulfillment, and reservation models.

The storefront consumes a public catalog projection from Medusa Store APIs. Any privileged credentials remain on the server. Product copy, images, inventory, variants, categories, and collections come from Medusa. Use a dedicated collection for featured homepage items first. Evaluate a small Medusa Admin extension only if owner-managed slots or manual order exceed built-in controls.

Use Medusa carts and stock-aware order workflows. When moving off fixtures, treat server-calculated totals and availability as authoritative and use Medusa's Stripe payment state and verified webhook flow for order status. Test inventory contention and duplicate webhook delivery. See [commerce operations](docs/COMMERCE.md).

References: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Next.js releases](https://nextjs.org/blog), [Tailwind v3 installation](https://v3.tailwindcss.com/docs/installation/using-postcss), [Medusa documentation](https://docs.medusajs.com/), [Medusa Stripe provider](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe).
