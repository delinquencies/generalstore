# Future marketplace integrations

Medusa remains authoritative for stock. Keep channel records keyed by marketplace and Medusa variant, with external listing IDs, channel eligibility, approval and publishing state, channel price and currency, last acknowledged availability, and sync errors. Add external order and line IDs with unique constraints to make imports idempotent.

When channel work is authorized, record an outbound event alongside the source change and deliver it asynchronously with retry backoff and reconciliation. Use versioned inventory updates to prevent older retries overwriting fresher state. On inbound orders, validate identifiers, apply reservations once, and send fulfillment updates from Medusa. Review marketplace eligibility per SKU.

For one-of-a-kind stock, allow sale on one channel at a time initially. With external marketplace latency, retire the previous listing and confirm its state and outstanding orders before exposing the item elsewhere. Keep a manual exception workflow for ambiguous availability or reconciliation failures.
