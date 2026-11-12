import assert from "node:assert/strict";
import { test } from "node:test";
import { money, restoreCart, searchCatalog, setQuantity } from "../src/lib/catalog.ts";

test("search combines terms, department, and condition", () => {
  const results = searchCatalog({ query: "  COBALT glaze ", department: "vintage", condition: "Vintage" });
  assert.deepEqual(results.map(({ slug }) => slug), ["bitossi-cobalt-vessel"]);
  assert.deepEqual(searchCatalog({ query: "cobalt", condition: "New" }), []);
});

test("quantity changes honor one-of-a-kind and sold-out fixture inventory", () => {
  const slug = "bitossi-cobalt-vessel";
  const cart = setQuantity({}, slug, 3);
  assert.deepEqual(cart, { [slug]: 1 });
  assert.deepEqual(setQuantity(cart, "fluted-diner-sugar-shaker", 1), cart);
  assert.deepEqual(setQuantity(cart, slug, 0), {});
});

test("persisted cart rejects invalid lines and clamps available stock", () => {
  assert.deepEqual(restoreCart({ unknown: 2, "marvis-cinnamon-mint": 99, "bitossi-cobalt-vessel": 1.5 }), { "marvis-cinnamon-mint": 24 });
  assert.deepEqual(restoreCart(null), {});
  assert.equal(money(24500), "$245");
  assert.equal(money(2455), "$24.55");
});
