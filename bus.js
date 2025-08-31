const BUS_KEY = "864e2d2a-dddc-441a-89b8-6435d86b81e4";
const STOP_ID = "502174";
const BUS_URL = "https://bustime.mta.info/api/siri/stop-monitoring.json";

const SHOW_START = 6;   // 6 AM local NY time
const SHOW_END = 17;    // 5 PM local NY time

// --- Helper to get New York hour ---
function getNYHour(date = new Date()) {
  return parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      hour12: false
    }).format(date),
    10
  );
}

// --- Decide if buses should be shown ---
function shouldShowBus() {
  const h = getNYHour();
  if (SHOW_START < SHOW_END) {
    return h >= SHOW_START && h < SHOW_END;
  } else {
    return h >= SHOW_START || h < SHOW_END;
  }
}

// --- Get next scheduled display time ---
function scheduledTimeStr() {
  const date = new Date();
  date.setHours(SHOW_START, 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
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
    // --- Build query string ---
    const params = new URLSearchParams({
      key: BUS_KEY,
      MonitoringRef: STOP_ID,
      MaximumStopVisits: "8"
    });

    // --- Fetch MTA API ---
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const resp = await fetch(`${BUS_URL}?${params.toString()}`, {
      method: "GET",
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    // --- Parse bus visits ---
    const visits = data.Siri.ServiceDelivery.StopMonitoringDelivery[0]?.MonitoredStopVisit || [];
    const grouped = { "Q44-SBS": [], "Q20": [] };
    const nowUtc = new Date();

    visits.forEach(visit => {
      const journey = visit.MonitoredVehicleJourney || {};
      const line = journey.PublishedLineName || "Unknown";
      let dest = journey.DestinationName || "Unknown";
      const call = journey.MonitoredCall || {};

      // Arrival in minutes (works because API provides timezone offset)
      const expected = call.ExpectedArrivalTime;
      let minutes = null;
      if (expected) {
        const expDt = new Date(expected);
        minutes = Math.round((expDt - nowUtc) / 60000);
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

    // Keep only first 3 buses per line
    for (const key in grouped) {
      grouped[key] = grouped[key].slice(0, 3);
    }

    // Updated timestamp in NY time
    const updated = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date());

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
