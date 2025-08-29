import weatherWrapper from "./weather.js";
import busWrapper from "./bus.js";

// Serve static files from templates/
async function serveStatic(filePath) {
  try {
    const url = new URL(`../templates/${filePath}`, import.meta.url);
    const res = await fetch(url);
    if (!res.ok) return new Response("Not Found", { status: 404 });

    const contentType = filePath.endsWith(".css")
      ? "text/css"
      : filePath.endsWith(".js")
      ? "application/javascript"
      : "text/html";

    return new Response(await res.text(), {
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    return new Response("Error fetching file", { status: 500 });
  }
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // API routes
  if (pathname === "/api/weather") return weatherWrapper.default.fetch(request);
  if (pathname === "/api/bus") return busWrapper.default.fetch(request);

  // Serve static files
  if (pathname.startsWith("/static/")) {
    const staticPath = pathname.replace("/static/", "static/");
    return serveStatic(staticPath);
  }

  // Default: serve index.html
  return serveStatic("index.html");
}
