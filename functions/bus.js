// functions/bus.js
import { getBus as originalGetBus } from "../bus.js"; // your original code

export default {
  async fetch(request, env, ctx) {
    try {
      const data = await originalGetBus();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
