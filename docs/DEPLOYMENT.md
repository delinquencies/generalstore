# Deployment

This milestone runs locally. No hosting or paid services are required. The application has no production deployment configuration.

For the initial production topology, plan a Node.js storefront behind Cloudflare, a separate Medusa service with Medusa Admin, PostgreSQL, and S3-compatible object storage. Confirm hosting and cost before provisioning. Verify network paths, TLS, health checks, logs, secrets, rate limits, backup schedules, and a tested restore. Keep webhook secrets and admin access on the commerce service. Restrict CDN caching to responses known to be public.

Before enabling indexing, configure the approved origin, canonicals, sitemap, social metadata, and accurate structured data. Add merchant-feed and analytics integrations only against verified inventory and approved tracking settings. Confirm storefront branding, contact details, legal text, tax rules, shipping and returns, media rights, and owner access.
