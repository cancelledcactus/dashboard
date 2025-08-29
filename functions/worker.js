// functions/worker.js
import * as weatherWrapper from "./weather.js";
import * as busWrapper from "./bus.js";

// Serve your static files from templates/static
async function serveStatic(path) {
  try {
    // Adjusted path to go up one level from functions/ to templates/
    const res = await fetch(new URL(path, import.meta.url));
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

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // API routes
  if (pathname === "/api/weather") {
    return fetch2(request);
  }
  if (pathname === "/api/bus") {
    return fetch3(request);
  }

  // Serve static files (fixed paths)
  if (pathname.startsWith("/static/")) {
    return serveStatic(`../templates${pathname}`);
  }

  // Default: serve index.html
  return serveStatic("../templates/index.html");
}

