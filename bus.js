const BUS_KEY = "864e2d2a-dddc-441a-89b8-6435d86b81e4";
const STOP_ID = "502174";
const BUS_URL = "https://bustime.mta.info/api/siri/stop-monitoring.json";

const SHOW_START = 6;   // 6 AM UTC
const SHOW_END = 17;    // 5 PM UTC

// --- Format helper: show any Date in Eastern Time ---
function formatET(date, withSeconds = false) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    second: withSeconds ? "2-digit" : undefined
  }).format(date);
}

// Only controls visibility window (UTC hours)
function shouldShowBus() {
  const h = new Date().getHours(); // UTC inside Workers
  if (SHOW_START < SHOW_END) {
    return h >= SHOW_START && h < SHOW_END;
  } else {
    return h >= SHOW_START || h < SHOW_END;
  }
}

// Format the "scheduled for" time (UTC → ET)
function scheduledTimeStr() {
  const now = new Date();
  const utcDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    SHOW_START, 0, 0
  ));
  return formatET(utcDate);
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
    const now = new Date(); // keep UTC here for math

    visits.forEach(visit => {
      const journey = visit.MonitoredVehicleJourney || {};
      const line = journey.PublishedLineName || "Unknown";
      let dest = journey.DestinationName || "Unknown";
      const call = journey.MonitoredCall || {};

      const expected = call.ExpectedArrivalTime;
      let minutes = null;
      if (expected) {
        const expDt = new Date(expected); // already ET from MTA
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

    // Updated timestamp (always ET)
    const updated = formatET(new Date(), true);

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
