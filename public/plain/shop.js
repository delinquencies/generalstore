"use strict";

const catalog = window.generalEditCatalog;
const query = new URLSearchParams(window.location.search);
const bagDrawer = document.querySelector("#bag-drawer");
const bagTrigger = document.querySelector(".store-bag");
const hasDrawer = typeof bagDrawer?.showModal === "function";
const openBagOnLoad = hasDrawer && query.get("view") === "cart";
const view = openBagOnLoad ? null : query.get("view");
const shop = document.querySelector("#store-view");
const status = document.querySelector("#store-status");
const departments = { objects: "Objects & Curiosities", home: "Home & Living", essentials: "Everyday Essentials", vintage: "Vintage & Found" };
const storageKey = "general-edit-plain-preview";
const previewTexasTaxBasisPoints = 825;
const bySlug = new Map(catalog.map((item) => [item.slug, item]));
const dollars = (cents) => (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: cents % 100 ? 2 : 0 });
const encode = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const productUrl = (item) => "./index.html?view=product&item=" + encodeURIComponent(item.slug);
const primary = "inline-flex min-h-11 items-center justify-center border-2 border-ink bg-ink px-4 py-2 font-mono-display text-xs font-bold uppercase text-white hover:bg-tangerine disabled:opacity-50";
const secondary = "inline-flex min-h-11 items-center justify-center border-2 border-ink bg-white px-3 py-2 font-mono-display text-xs font-bold uppercase hover:bg-canary";
const field = "min-w-0 border-2 border-ink bg-white px-3 py-2";
const grid = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";
const canEstimateShipping = () => cart.size === 1 && cart.values().next().value === 1;

function restore() {
  const cart = new Map();
  const favorites = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
    for (const [slug, quantity] of Object.entries(saved.cart ?? {})) {
      const item = bySlug.get(slug);
      if (item?.stock && Number.isInteger(quantity) && quantity > 0) cart.set(slug, Math.min(quantity, item.stock));
    }
    for (const slug of Array.isArray(saved.favorites) ? saved.favorites : []) if (bySlug.has(slug)) favorites.add(slug);
  } catch { /* A blocked or unreadable browser store starts with an empty bag. */ }
  return { cart, favorites };
}
const { cart, favorites } = restore();

const storeHeader = document.querySelector(".store-header");
const menuToggle = storeHeader?.querySelector(".store-menu-toggle");
if (menuToggle) {
  const closeMenu = () => {
    storeHeader.removeAttribute("data-menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    menuToggle.firstElementChild.textContent = "menu";
  };
  menuToggle.addEventListener("click", () => {
    if (menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      return;
    }
    storeHeader.setAttribute("data-menu-open", "");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    menuToggle.firstElementChild.textContent = "close";
  });
  storeHeader.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && storeHeader.hasAttribute("data-menu-open")) {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.matchMedia("(min-width: 72rem)").addEventListener("change", closeMenu);
  for (const link of storeHeader.querySelectorAll("[data-store-view]")) {
    if (link.dataset.storeView === view) link.setAttribute("aria-current", "page");
  }
  if (view === "shop") {
    const department = query.get("department") ?? "";
    storeHeader.querySelectorAll("[data-shop-link]").forEach((link) => {
      if (link.dataset.shopLink === department) link.setAttribute("aria-current", "page");
    });
    storeHeader.querySelectorAll("input[name=q]").forEach((input) => {
      input.value = (query.get("q") ?? "").slice(0, 100);
    });
  }
}

function sync() {
  const count = Array.from(cart.values()).reduce((total, amount) => total + amount, 0);
  document.querySelectorAll("[data-bag-count]").forEach((badge) => { badge.textContent = count; });
  document.querySelectorAll("[data-add]").forEach((button) => {
    const item = bySlug.get(button.dataset.add);
    if (!item) return;
    if (!button.dataset.initial) button.dataset.initial = button.innerHTML;
    button.disabled = item.stock === 0 || (cart.get(item.slug) ?? 0) >= item.stock;
    button.innerHTML = item.stock === 0 ? "Sold out" : button.disabled ? "In your bag" : button.dataset.initial;
  });
}

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ cart: Object.fromEntries(cart), favorites: [...favorites] })); }
  catch { /* Keep state in the current page when storage is blocked. */ }
  sync();
}

const effectivePrice = (item) => item.salePriceCents ?? item.priceCents;

function priceTag(item) {
  if (item.salePriceCents == null) return `<span class="product-poster-price">${dollars(item.priceCents)}</span>`;
  return `<span class="product-sale-price"><del><span class="sr-only">Regular price </span>${dollars(item.priceCents)}</del><span class="product-poster-price"><span class="sr-only">Sale price </span>${dollars(item.salePriceCents)}</span></span>`;
}

function photoTags(item) {
  return (item.oneOfOne ? '<span class="product-photo-tag product-photo-unique"><span aria-hidden="true">1/1</span><span class="sr-only">One of one</span></span>' : "")
    + (item.salePriceCents != null ? '<span class="product-photo-tag product-photo-sale">SALE</span>' : "");
}

function card(item, featured = false) {
  return `<article class="product-poster${featured === true && item.spotlight ? " product-spotlight" : ""}">
    <a href="${productUrl(item)}" class="product-poster-photo">
      <img src="${encode(item.photo.src)}" alt="${encode(item.photo.alt)}" loading="lazy">
      ${photoTags(item)}
    </a>
    <div class="product-poster-copy">
    <div class="flex items-start justify-between gap-3"><h3><a href="${productUrl(item)}">${encode(item.title)}</a></h3>${priceTag(item)}</div>
    <p class="flex-1 text-sm text-ink/70">${encode(item.description)}</p>
    <div class="flex flex-wrap gap-2">
      <button type="button" class="${primary} flex-1" data-add="${item.slug}">Add to bag</button>
      <button type="button" class="${secondary}" data-favorite="${item.slug}" aria-label="Favorite ${encode(item.title)}" aria-pressed="${favorites.has(item.slug)}">${favorites.has(item.slug) ? "★" : "☆"}</button>
    </div>
    </div>
  </article>`;
}

function section(title, body, department = "") {
  document.title = title + " | Oddly Enough";
  const art = Object.hasOwn(departments, department) && document.querySelector(`[data-department-poster="${department}"] img`);
  shop.innerHTML = `<section class="page-poster" data-page="${encode(view ?? "")}"><header class="page-poster-title"><h1>${encode(title)}</h1>${art ? `<img src="${encode(art.getAttribute("src"))}" alt="">` : ""}</header>${body}</section>`;
}

const searchText = (value) => value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();

function catalogPage() {
  const department = Object.hasOwn(departments, query.get("department")) ? query.get("department") : "";
  const condition = ["New", "Vintage"].includes(query.get("condition")) ? query.get("condition") : "";
  const term = (query.get("q") ?? "").slice(0, 100).trim();
  const terms = searchText(term).split(" ").filter(Boolean);
  const items = catalog.filter((item) => {
    const { materials, maker, origin } = item.specifications ?? {};
    const text = searchText([item.title, item.description, item.sku, departments[item.department], materials, maker, origin, ...(item.searchKeywords ?? [])].join(" "));
    return (!department || item.department === department) && (!condition || item.condition === condition) && terms.every((word) => text.includes(word));
  });
  if (terms.length) {
    const titleMatches = (item) => terms.filter((word) => searchText(item.title).includes(word)).length;
    items.sort((a, b) => titleMatches(b) - titleMatches(a));
  }
  section(departments[department] ?? "Shop All", `<form action="./index.html" class="poster-controls flex flex-wrap items-end gap-3">
    <input type="hidden" name="view" value="shop">
    <label class="grid min-w-0 gap-1 text-sm">Search<input name="q" type="search" maxlength="100" class="${field} w-full" value="${encode(term)}"></label>
    <label class="grid min-w-0 gap-1 text-sm">Department<select name="department" class="${field}"><option value="">All departments</option>${Object.entries(departments).map(([key, title]) => `<option value="${key}" ${key === department ? "selected" : ""}>${encode(title)}</option>`).join("")}</select></label>
    <label class="grid gap-1 text-sm">Condition<select name="condition" class="${field}"><option value="">Any condition</option>${["New", "Vintage"].map((label) => `<option ${label === condition ? "selected" : ""}>${label}</option>`).join("")}</select></label>
    <button class="${primary}">Apply</button>
  </form><p class="text-sm">${items.length} ${items.length === 1 ? "object" : "objects"}</p>${items.length ? `<div class="${grid}">${items.map(card).join("")}</div>` : '<p class="poster-message">No products match your search. <a class="underline" href="./index.html?view=shop">Clear search and filters</a>.</p>'}`, department || "objects");
}

const specificationLabels = {
  materials: "Materials or ingredients",
  maker: "Maker or brand",
  origin: "Origin",
  dimensions: "Dimensions",
  conditionNotes: "Condition notes",
};

function productPage() {
  const item = bySlug.get(query.get("item"));
  if (!item) return section("Object unavailable", '<p class="poster-message"><a class="underline" href="./index.html?view=shop">Browse the shop</a></p>');
  const extraPhotos = (item.images ?? []).slice(1);
  const specs = Object.entries(specificationLabels)
    .filter(([key]) => item.specifications?.[key])
    .map(([key, label]) => `<div><dt>${label}</dt><dd>${encode(item.specifications[key])}</dd></div>`).join("");
  section(item.title, `<article class="grid items-start gap-6 md:grid-cols-2">
    <div class="space-y-4">
    <div class="product-detail-photo">
      <img src="${encode(item.photo.src)}" alt="${encode(item.photo.alt)}" class="aspect-[4/5] w-full border-2 border-ink bg-cream-muted object-cover">
      ${photoTags(item)}
    </div>
    ${extraPhotos.length ? `<div class="grid grid-cols-2 gap-3">${extraPhotos.map((photo) => `<img src="${encode(photo.src)}" alt="${encode(photo.alt)}" class="w-full border-2 border-ink bg-cream-muted" loading="lazy">`).join("")}</div>` : ""}
    </div>
    <div class="poster-message space-y-4"><p>${priceTag(item)}</p><p>${encode(item.description)}</p>
    <p>${item.condition} · SKU ${item.sku} · ${item.stock === 0 ? "Sold out" : item.stock === 1 ? "One available" : "In stock"}</p>
    <button type="button" class="${primary}" data-add="${item.slug}">Add to bag</button>
    ${specs ? `<div class="product-specifications"><h2>Product details</h2><dl>${specs}</dl></div>` : ""}</div></article>`);
}

function bagPage() {
  let subtotal = 0;
  const rows = Array.from(cart, ([slug, quantity]) => {
    const item = bySlug.get(slug);
    const lineTotal = effectivePrice(item) * quantity;
    subtotal += lineTotal;
    return `<li class="flex flex-wrap items-center justify-between gap-3 p-4"><a class="font-sans font-semibold text-xl underline" href="${productUrl(item)}">${encode(item.title)}</a>
      <div class="flex flex-wrap items-center gap-3"><label>Quantity <select aria-label="Quantity for ${encode(item.title)}" class="${field}" data-quantity="${slug}">${Array.from({ length: item.stock }, (_, index) => `<option ${index + 1 === quantity ? "selected" : ""}>${index + 1}</option>`).join("")}</select></label>
      <span>${dollars(lineTotal)}</span><button type="button" class="underline" data-remove="${slug}">Remove</button></div></li>`;
  }).join("");
  const items = rows ? `<ul class="poster-bag-lines">${rows}</ul>` : '<p class="poster-message">Your bag is empty. <a class="underline" href="./index.html?view=shop">Browse the shop</a>.</p>';
  const estimatedTax = Math.round(subtotal * previewTexasTaxBasisPoints / 10_000);
  const summary = rows ? `<div class="poster-bag-summary">
    <dl class="bag-totals">
      <div><dt>Subtotal</dt><dd>${dollars(subtotal)}</dd></div>
      <div><dt>Estimated Texas sales tax (8.25%)</dt><dd>${dollars(estimatedTax)}</dd></div>
      <div><dt>Estimated total</dt><dd>${dollars(subtotal + estimatedTax)}</dd></div>
    </dl>
    <p class="mt-3 text-xs">Preview total before shipping.</p>
    <div class="bag-shipping">
      ${canEstimateShipping() ? `
      <form data-shipping-estimate>
        <label for="shipping-zip">US ZIP code</label>
        <div class="bag-shipping-fields">
          <input id="shipping-zip" name="zip" type="text" class="${field}" inputmode="numeric" autocomplete="shipping postal-code" pattern="[0-9]{5}" title="Enter a five-digit US ZIP code" maxlength="5" required>
          <button type="submit" class="${primary}">Estimate shipping</button>
        </div>
        <div class="bag-shipping-result" role="status" aria-live="polite"></div>
      </form>` : "<p>Shipping estimates are available for one item at a time.</p>"}
    </div>
    ${view === "checkout" ? "" : `<a class="${primary} checkout-link" href="./index.html?view=checkout">Checkout <span aria-hidden="true">&rarr;</span></a>`}
  </div>` : "";
  if (hasDrawer) {
    bagDrawer.querySelector(".bag-drawer-items").innerHTML = items;
    bagDrawer.querySelector(".bag-drawer-summary").innerHTML = summary;
  } else {
    section("Your Bag", items + summary);
  }
}

function checkoutSummary() {
  let subtotal = 0;
  const lines = Array.from(cart, ([slug, quantity]) => {
    const item = bySlug.get(slug);
    const total = effectivePrice(item) * quantity;
    subtotal += total;
    return `<li><a href="${productUrl(item)}">${encode(item.title)} <small>&times;${quantity}</small></a><span>${dollars(total)}</span></li>`;
  }).join("");
  const tax = Math.round(subtotal * previewTexasTaxBasisPoints / 10_000);
  return `<ul class="checkout-items">${lines}</ul>
    <dl class="bag-totals">
      <div><dt>Subtotal</dt><dd>${dollars(subtotal)}</dd></div>
      <div><dt>Preview tax (8.25%)</dt><dd>${dollars(tax)}</dd></div>
      <div><dt>Estimated total before shipping</dt><dd>${dollars(subtotal + tax)}</dd></div>
    </dl>`;
}

function checkoutPage() {
  document.title = "Checkout | Oddly Enough";
  shop.innerHTML = `<section class="checkout-poster">
    <header class="checkout-mast"><h1><span>Your bag.</span> Checkout</h1></header>
    ${cart.size ? `<div class="checkout-grid">
      <form class="checkout-panel checkout-address" data-shipping-estimate data-checkout>
        <h2>Ship it to</h2>
        <div class="checkout-fields">
          <label>Name<input name="name" autocomplete="shipping name" required></label>
          <label>Email<input name="email" type="email" autocomplete="email" required></label>
          <label class="checkout-wide">Street address<input name="street" autocomplete="shipping address-line1" required></label>
          <label class="checkout-wide">Apartment or suite <small>(optional)</small><input name="unit" autocomplete="shipping address-line2"></label>
          <label>City<input name="city" autocomplete="shipping address-level2" required></label>
          <label>State<input name="state" autocomplete="shipping address-level1" maxlength="2" pattern="[A-Za-z]{2}" title="Enter a two-letter state code" required></label>
          <label>US ZIP code<input name="zip" autocomplete="shipping postal-code" inputmode="numeric" maxlength="5" pattern="[0-9]{5}" required></label>
        </div>
        <button type="submit" class="${primary}" formnovalidate>Estimate shipping</button>
        <div class="bag-shipping-result" role="status" aria-live="polite"></div>
      </form>
      <aside class="checkout-panel checkout-order">
        <h2>In the bag</h2>
        <div id="checkout-summary">${checkoutSummary()}</div>
        <p class="checkout-payment">Online payment is coming soon. No order will be placed here yet.</p>
      </aside>
    </div>` : `<div class="checkout-panel"><p>Your bag is empty.</p><a class="${primary}" href="./index.html?view=shop">Browse the shop</a></div>`}
  </section>`;
}

function refreshCheckout() {
  if (view !== "checkout") return;
  const summary = document.querySelector("#checkout-summary");
  if (!cart.size || !summary) {
    checkoutPage();
    return;
  }
  summary.innerHTML = checkoutSummary();
  const result = shop.querySelector(".bag-shipping-result");
  result.textContent = "";
}

document.addEventListener("input", (event) => {
  const form = event.target.closest("[data-shipping-estimate]");
  if (form) form.querySelector(".bag-shipping-result").replaceChildren();
});

document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!form.matches("[data-shipping-estimate]")) return;
  event.preventDefault();
  const input = form.elements.zip;
  const button = form.querySelector("button");
  if (button.disabled || !input.reportValidity()) return;
  const result = form.querySelector(".bag-shipping-result");
  if (!canEstimateShipping()) {
    result.textContent = "Shipping estimates are available for one item at a time.";
    return;
  }
  const zip = input.value;
  const slug = cart.keys().next().value;
  const current = () => form.isConnected && input.value === zip && canEstimateShipping() && cart.has(slug);
  result.textContent = "Checking shipping rates…";
  button.disabled = true;
  try {
    const response = await fetch("/api/shipping-estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zip, slug }),
      signal: AbortSignal.timeout(10000),
    });
    const data = await response.json();
    if (!current()) return;
    if (!response.ok) {
      result.textContent = data.error;
      return;
    }
    if (!data.rates.length) {
      result.textContent = "No shipping options were returned for that ZIP code.";
      return;
    }
    const options = document.createElement("ul");
    for (const rate of data.rates) {
      const option = document.createElement("li");
      option.textContent = rate.carrier + " " + rate.service + " · " + dollars(rate.amountCents);
      options.append(option);
    }
    result.textContent = data.test ? "Test rates" : "Estimated rates. Final rates depend on the full address.";
    result.append(options);
  } catch {
    if (current()) result.textContent = "Couldn't get a shipping estimate. Try again in a moment.";
  } finally {
    button.disabled = false;
  }
});

function openBag() {
  bagPage();
  if (!bagDrawer.open) bagDrawer.showModal();
}

if (hasDrawer) {
  bagTrigger.setAttribute("aria-haspopup", "dialog");
  bagTrigger.setAttribute("aria-controls", "bag-drawer");
  bagTrigger.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openBag();
  });
  bagDrawer.addEventListener("click", (event) => {
    if (event.target === bagDrawer) bagDrawer.close();
  });
  bagDrawer.addEventListener("close", () => {
    if (document.activeElement === document.body) bagTrigger.focus({ preventScroll: true });
  });
}

function favoritesPage() {
  const items = catalog.filter((item) => favorites.has(item.slug));
  section("Favorites", items.length ? `<div class="${grid}">${items.map(card).join("")}</div>` : '<p class="poster-message">Your favorites are empty. <a class="underline" href="./index.html?view=shop">Browse the shop</a>.</p>');
}

const info = {
  contact: ["Contact", "Contact details will be published when the store opens."],
  shipping: ["Shipping", "Shipping destinations and rates are pending."],
  returns: ["Returns & Exchanges", "The store’s returns policy is pending."],
  privacy: ["Privacy Policy", "This preview stores your bag and favorites in your browser."],
  terms: ["Terms of Sale", "This preview uses sample inventory and accepts no orders."],
  accessibility: ["Accessibility", "Accessibility testing is in progress."],
};

function aboutPage() {
  section("About Us", `<div class="about-story"><div class="poster-message space-y-3">
    <p>We’re the people who check the back shelf and turn things over to see the price. We started Oddly Enough in Texas to make a shop out of that habit.</p>
    <p>Some things earn a spot because we’ve never seen another one, like an old lamp with a shape we can’t quite explain. Others earn it because we’d use them every day, like a kitchen brush that gets into the corners. Either way, the price has to make sense.</p>
  </div></div>`);
  shop.querySelector(".about-story").append(document.querySelector("#about-texas").content.cloneNode(true));
  const art = document.querySelector("#platform-art").content.cloneNode(true);
  shop.firstElementChild.append(art);
}

const footerPlatforms = document.querySelector("#footer-platforms");
if (footerPlatforms && view !== "about") {
  footerPlatforms.append(document.querySelector("#platform-art").content.cloneNode(true));
}

const signup = document.querySelector("#next-find-signup");
signup?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = signup.querySelector("button");
  const result = signup.querySelector("[role=status]");
  button.disabled = true;
  result.textContent = "Saving your signup…";
  try {
    const response = await fetch("/api/newsletter-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: signup.elements.email.value }),
      signal: AbortSignal.timeout(8000),
    });
    const data = await response.json();
    if (!response.ok || data.saved !== true) throw new Error(data.error);
    signup.reset();
    result.textContent = "Signup saved in the local preview.";
  } catch (error) {
    result.textContent = error.message === "Enter a valid email address."
      ? error.message
      : "Couldn’t save your signup. Try again in a moment.";
  } finally {
    button.disabled = false;
  }
});
const fresh = [...catalog.filter((item) => item.spotlight), ...catalog.filter((item) => !item.spotlight)].slice(0, 6);
const freshFilters = [
  ["All Featured", () => true],
  ["Vintage", (item) => item.condition === "Vintage"],
  ["Only One Left", (item) => item.stock === 1],
  ["Under $35", (item) => effectivePrice(item) < 3500],
];
const featuredTrack = document.querySelector("#fresh-grid");
const featuredPrevious = document.querySelector("#featured-previous");
const featuredNext = document.querySelector("#featured-next");

function updateFeaturedArrows() {
  if (!featuredPrevious || !featuredNext) return;
  featuredPrevious.disabled = featuredTrack.scrollLeft <= 1;
  featuredNext.disabled = featuredTrack.scrollLeft + featuredTrack.clientWidth >= featuredTrack.scrollWidth - 1;
}

if (featuredTrack && featuredPrevious && featuredNext) {
  const moveFeatured = (direction) => {
    const [first, second] = featuredTrack.children;
    if (second) featuredTrack.scrollBy({ left: direction * (second.offsetLeft - first.offsetLeft) });
  };
  featuredPrevious.addEventListener("click", () => moveFeatured(-1));
  featuredNext.addEventListener("click", () => moveFeatured(1));
  featuredTrack.addEventListener("scroll", updateFeaturedArrows, { passive: true });
  if (typeof ResizeObserver === "function") new ResizeObserver(updateFeaturedArrows).observe(featuredTrack);
}

function freshPage(active) {
  document.querySelector("#fresh-filters").innerHTML = freshFilters.map(([label, predicate], index) => `<button type="button" class="${index === active ? primary : secondary}" data-filter="${index}" aria-pressed="${index === active}">${label} (${fresh.filter(predicate).length})</button>`).join("");
  featuredTrack.innerHTML = fresh.filter(freshFilters[active][1]).map((item) => card(item, true)).join("");
  featuredTrack.scrollTo?.({ left: 0, behavior: "instant" });
  updateFeaturedArrows();
  sync();
}

if (view) {
  document.querySelector("#homepage").hidden = true;
  shop.hidden = false;
  if (view === "shop") catalogPage();
  else if (view === "product") productPage();
  else if (view === "cart") bagPage();
  else if (view === "checkout") checkoutPage();
  else if (view === "favorites") favoritesPage();
  else if (view === "about") aboutPage();
  else if (Object.hasOwn(info, view)) section(info[view][0], `<p class="poster-message">${encode(info[view][1])}</p>`);
  else section("Page unavailable", '<a class="underline" href="./index.html">Back home</a>');
} else {
  freshPage(0);
  const title = document.querySelector(".poster-title");
  if (title && typeof ResizeObserver === "function") {
    const lines = title.querySelectorAll(".poster-line");
    const fitType = () => {
      for (const line of lines) {
        const ink = line.firstElementChild;
        if (line.clientWidth && ink.offsetWidth) {
          ink.style.setProperty("--poster-fit", (line.clientWidth - 2) / ink.offsetWidth);
        }
      }
    };
    const observer = new ResizeObserver(fitType);
    for (const line of lines) {
      observer.observe(line);
      observer.observe(line.firstElementChild);
    }
    fitType();
  }
}
sync();
if (openBagOnLoad) {
  history.replaceState(null, "", "./index.html");
  openBag();
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-add], button[data-favorite], button[data-remove], button[data-filter]");
  if (!button) return;
  const { add, favorite, remove, filter } = button.dataset;
  if (add) {
    const item = bySlug.get(add);
    if (!item || (cart.get(add) ?? 0) >= item.stock) return;
    cart.set(add, (cart.get(add) ?? 0) + 1);
    status.textContent = item.title + " added to your bag.";
  } else if (favorite) {
    if (favorites.has(favorite)) favorites.delete(favorite);
    else favorites.add(favorite);
    button.setAttribute("aria-pressed", favorites.has(favorite));
    button.textContent = favorites.has(favorite) ? "★" : "☆";
    if (view === "favorites") favoritesPage();
  } else if (remove) {
    cart.delete(remove);
    bagPage();
    refreshCheckout();
    if (bagDrawer?.open) {
      const next = bagDrawer.querySelector("[data-remove]") ?? bagDrawer.querySelector(".bag-drawer-close");
      next.focus();
    }
  } else {
    freshPage(Number(filter));
    document.querySelector(`[data-filter="${filter}"]`)?.focus();
    return;
  }
  save();
  if (add && hasDrawer) openBag();
});

document.addEventListener("change", (event) => {
  const select = event.target.closest("select[data-quantity]");
  if (!select) return;
  const item = bySlug.get(select.dataset.quantity);
  const quantity = Number(select.value);
  if (!item || !Number.isInteger(quantity) || quantity < 1 || quantity > item.stock) return;
  cart.set(item.slug, quantity);
  bagPage();
  refreshCheckout();
  save();
  (hasDrawer ? bagDrawer : shop).querySelector(`[data-quantity="${item.slug}"]`)?.focus();
});
