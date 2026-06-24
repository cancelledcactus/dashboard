const BUS_KEY = "864e2d2a-dddc-441a-89b8-6435d86b81e4";
const STOP_ID = "502174";
const BUS_URL = "https://bustime.mta.info/api/siri/stop-monitoring.json";

const SHOW_START = 6;   // 6 AM
const SHOW_END = 23;    // 11 PM (adjust if needed)
const LOCAL_TZ = "America/New_York";

// Current hour (0-23) in New York. Workers run in UTC, so new Date().getHours()
// would return the UTC hour — read the hour through the local timezone instead.
function nyHour() {
  const s = new Intl.DateTimeFormat("en-US", {
    timeZone: LOCAL_TZ, hour: "2-digit", hour12: false
  }).format(new Date());
  const h = parseInt(s, 10);
  return h === 24 ? 0 : h;   // some runtimes report midnight as "24"
}

function shouldShowBus() {
  const h = nyHour();

  if (SHOW_START < SHOW_END) {
    // Normal same-day range
    return h >= SHOW_START && h < SHOW_END;
  } else {
    // Overnight range (e.g., 19 to 1)
    return h >= SHOW_START || h < SHOW_END;
  }
}

function scheduledTimeStr() {
  // SHOW_START is a local hour-of-day; format it directly (no timezone math needed)
  const h12 = SHOW_START % 12 === 0 ? 12 : SHOW_START % 12;
  const ap = SHOW_START < 12 ? "AM" : "PM";
  return `${h12}:00 ${ap}`;
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
    // build query string
    const params = new URLSearchParams({
      key: BUS_KEY,
      MonitoringRef: STOP_ID,
      MaximumStopVisits: "8"
    });

    // fetch with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const resp = await fetch(`${BUS_URL}?${params.toString()}`, {
      method: "GET",
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    const visits = data.Siri.ServiceDelivery.StopMonitoringDelivery[0]?.MonitoredStopVisit || [];
    const grouped = { "Q44-SBS": [], "Q20": [] };
    const nowUtc = new Date();

    visits.forEach(visit => {
      const journey = visit.MonitoredVehicleJourney || {};
      const line = journey.PublishedLineName || "Unknown";
      let dest = journey.DestinationName || "Unknown";
      const call = journey.MonitoredCall || {};

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

    for (const key in grouped) {
      grouped[key] = grouped[key].slice(0, 3);
    }

    const updated = new Date().toLocaleTimeString("en-US", {
      timeZone: LOCAL_TZ,
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
