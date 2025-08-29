// functions/worker.js
import * as weatherWrapper from "./weather.js";
import * as busWrapper from "./bus.js";

// Serve static files from templates/
async function serveStatic(path) {
  try {
    // Adjust path from functions/ to templates/
    const res = await fetch(new URL(`../${path}`, import.meta.url));
    if (!res.ok) return new Response("Not Found", { status: 404 });

    const contentType = path.endsWith(".css")
      ? "text/css"
      : path.endsWith(".js")
      ? "application/javascript"
      : "text/html";

    return new Response(await res.text(), {
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    return new Response("Error fetching file", { status: 500 });
  }
}

// Main request handler
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // API routes
  if (pathname === "/api/weather") return weatherWrapper.default.fetch(request);
  if (pathname === "/api/bus") return busWrapper.default.fetch(request);

  // Serve static files
  if (pathname.startsWith("/static/")) return serveStatic(`templates${pathname}`);

  // Default: serve index.html
  return serveStatic("templates/index.html");
}

// Register fetch event
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
