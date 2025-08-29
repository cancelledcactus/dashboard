// functions/worker.js
import { getWeather } from "./weather.js";
import { getBus } from "./bus.js";

// Serve static files from templates/
async function serveStatic(path) {
  try {
    const res = await fetch(new URL(`../templates/${path}`, import.meta.url));
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

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // API routes
  if (pathname === "/api/weather") {
    const data = await getWeather();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname === "/api/bus") {
    const data = await getBus();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Serve static files
  if (pathname.startsWith("/static/")) {
    const staticPath = pathname.replace("/static/", "static/");
    return serveStatic(staticPath);
  }

  // Default: serve index.html
  return serveStatic("index.html");
}
