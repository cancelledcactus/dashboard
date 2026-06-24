// functions/worker.js
import { getWeather } from "../weather.js";
import { getBus } from "../bus.js";

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
     const data = await getWeather(); // should always return an object
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
      },
    });
  }

  if (pathname === "/api/bus") {
  const data = await getBus(); // should always return an object
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store"
    },
  });
}

  // Server-accurate time for the dashboard clock (the Pi clock can drift)
  if (pathname === "/api/time") {
    const now = new Date();
    const tz = "America/New_York";
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "short", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true
    });
    const body = {
      epoch_ms: now.getTime(),     // UTC epoch milliseconds (client computes offset from this)
      iso: now.toISOString(),
      timezone: tz,
      formatted: fmt.format(now)   // human-readable, for debugging
    };
    return new Response(JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store"
      }
    });
  }

  // Serve static files
  if (pathname.startsWith("/static/")) {
    const staticPath = pathname.replace("/static/", "static/");
    return serveStatic(staticPath);
  }

  // Default: serve index.html
  return serveStatic("/templates/index.html");
}
