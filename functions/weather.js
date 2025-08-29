import { getWeather as originalGetWeather } from "../weather.js";

export default {
  async fetch(request) {
    try {
      const data = await originalGetWeather();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
