import assert from "node:assert/strict";
import { test } from "node:test";
import { getStoreProduct, listStoreProducts } from "../src/lib/store-catalog.ts";

test("Medusa catalog maps USD prices and stock from the Store API", async (context) => {
  const settings = {
    MEDUSA_BACKEND_URL: "http://127.0.0.1:9000",
    MEDUSA_PUBLISHABLE_KEY: "pk_test_fixture",
    MEDUSA_REGION_ID: "reg_test_fixture",
  };
  for (const [key, value] of Object.entries(settings)) {
    const previous = process.env[key];
    context.after(() => {
      if (previous === undefined) delete process.env[key];
      else process.env[key] = previous;
    });
    process.env[key] = value;
  }
  const fetch = context.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url.pathname, "/store/products");
    assert.equal(url.searchParams.get("region_id"), "reg_test_fixture");
    assert.match(url.searchParams.get("fields"), /\+variants\.inventory_quantity/);
    assert.equal(options.headers["x-publishable-api-key"], "pk_test_fixture");
    return Response.json({ count: 1, products: [{
      handle: "test-vase",
      title: "Test Vase",
      collection: { handle: "vintage" },
      metadata: { condition: "Vintage" },
      variants: [{
        sku: "TEST-1",
        manage_inventory: true,
        inventory_quantity: 0,
        calculated_price: { calculated_amount: 21.95, currency_code: "usd" },
      }],
    }] });
  });
  const result = await listStoreProducts({ query: "vase", department: "vintage", condition: "Vintage" });
  assert.equal(result.connected, true);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].priceCents, 2195);
  assert.equal(result.items[0].stock, 0);
  const product = await getStoreProduct("test-vase");
  assert.equal(product?.sku, "TEST-1");
  assert.equal(fetch.mock.calls[1].arguments[0].searchParams.get("handle"), "test-vase");
});
