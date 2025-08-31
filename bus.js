const BUS_KEY = "864e2d2a-dddc-441a-89b8-6435d86b81e4";
const STOP_ID = "502174";
const BUS_URL = "https://bustime.mta.info/api/siri/stop-monitoring.json";

const SHOW_START = 6;   // 6 AM ET
const SHOW_END = 17;    // 5 PM ET

// --- Helper: get Date in ET ---
function nowET() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
}

function shouldShowBus() {
  const h = nowET().getHours();

  if (SHOW_START < SHOW_END) {
    // Normal same-day range
    return h >= SHOW_START && h < SHOW_END;
  } else {
    // Overnight range (e.g., 19 to 1)
    return h >= SHOW_START || h < SHOW_END;
  }
}

function scheduledTimeStr() {
  const d = nowET();
  d.setHours(SHOW_START, 0, 0, 0);
  return d.toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit"
  });
}

export async function getBus() {
  if (!shouldShowBus()) {
    return {
      buses: { "Q44-SBS": [], "Q20": [] },
      updated: null,
      hidden: true,
      scheduled_for: scheduledTimeStr()
    };
  }

  try {
    const url = new URL(BUS_URL);
    url.searchParams.set("key", BUS_KEY);
    url.searchParams.set("MonitoringRef", STOP_ID);
    url.searchParams.set("MaximumStopVisits", "8");

    const res = await fetch(url.toString(), { cf: { cacheTtl: 0 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const visits = data.Siri.ServiceDelivery.StopMonitoringDelivery[0]?.MonitoredStopVisit || [];
    const grouped = { "Q44-SBS": [], "Q20": [] };
    const now = nowET();

    visits.forEach(visit => {
      const journey = visit.MonitoredVehicleJourney || {};
      const line = journey.PublishedLineName || "Unknown";
      let dest = journey.DestinationName || "Unknown";
      const call = journey.MonitoredCall || {};

      const expected = call.ExpectedArrivalTime;
      let minutes = null;
      if (expected) {
        const expDt = new Date(expected);
        // difference still works since JS Date handles ISO UTC → ms
        minutes = Math.round((expDt - now) / 60000);
      }

      if (grouped[line]) {
        let extra = "";
        if (line === "Q44-SBS") {
          if (dest.toUpperCase().includes("BRONX ZOO")) extra = " Bronx Zoo";
          else if (dest.toUpperCase().includes("PARSONS")) extra = " Parsons Bvld";
          else if (dest.toUpperCase().includes("FLUSHING")) extra = " Flushing Main";
          dest = "";
        }

        grouped[line].push({
          line,
          minutes: minutes !== null ? minutes : "?",
          dest,
          extra
        });
      }
    });

    // Limit to 3 arrivals per line
    for (const key in grouped) {
      grouped[key] = grouped[key].slice(0, 3);
    }

    const updated = now.toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    });

    return { buses: grouped, updated, hidden: false, scheduled_for: null };

  } catch (e) {
    console.error("bus.getBus error:", e.message);
    return {
      buses: { "Q44-SBS": [], "Q20": [] },
      updated: null,
      error: e.message,
      hidden: false,
      scheduled_for: null
    };
  }
}
