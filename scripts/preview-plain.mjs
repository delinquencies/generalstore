import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { adminPasscode, handleCatalogRoute, publishedProducts } from "./catalog-admin.mjs";

const files = new Map([
  ["/", ["index.html", "text/html"]],
  ["/index.html", ["index.html", "text/html"]],
  ["/styles.css", ["styles.css", "text/css"]],
  ["/products.js", ["products.js", "text/javascript"]],
  ["/shop.js", ["shop.js", "text/javascript"]],
]);

export const previewServer = createServer(async (request, response) => {
  if (!["127.0.0.1:4173", "localhost:4173"].includes(request.headers.host)) {
    response.writeHead(403).end("Use the local preview address.");
    return;
  }
  try {
    const path = request.url.split("?")[0];
    if (await handleCatalogRoute(request, response, path)) return;
    const [filename, type] = files.get(path) ?? [];
    if (!filename || request.method !== "GET") {
      response.writeHead(404).end("Page unavailable");
      return;
    }
    const contents = await readFile(new URL("../public/plain/" + filename, import.meta.url));
    const body = filename === "products.js"
      ? contents.toString("utf8") + "\nwindow.generalEditCatalog.unshift(..." + JSON.stringify(await publishedProducts()) + ");\n"
      : contents;
    response.writeHead(200, { "Content-Type": type + "; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }).end(body);
  } catch {
    response.writeHead(500).end("Preview file unavailable");
  }
});

if (import.meta.main) {
  previewServer.listen(4173, "127.0.0.1", () => {
    console.log("Oddly Enough is at http://127.0.0.1:4173/");
    console.log("Owner portal: http://127.0.0.1:4173/admin");
    console.log("Username: owner");
    if (adminPasscode) console.log("Password: " + adminPasscode);
  });
}
