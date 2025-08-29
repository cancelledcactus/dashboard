// functions/worker.js
import { getWeather } from "../weather.js";
import { getBus } from "../bus.js";

// Listen for all fetch events
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // API routes
  if (pathname === "/api/weather") {
    try {
      const data = await getWeather();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (pathname === "/api/bus") {
    try {
      const data = await getBus();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Static files & index.html served by Worker Sites automatically
  return fetch(request);
}
