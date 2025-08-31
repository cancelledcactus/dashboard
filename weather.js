
// weather.js
// Node >=18 or modern browsers for fetch support

// Imports (Node <18 may need: npm install node-fetch)


// config
const LAT = 40.7675, LON = -73.8331;
const WEATHER_KEY = "9fzOlKwfgtt3GRWgNLWEJw0S36skrL8X";
const WEATHER_URL = "https://api.tomorrow.io/v4/weather/forecast";
const LOCAL_TZ = "America/New_York";

// exact commit path you gave (V2 small PNG icons)
const ICON_BASE = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/51b9588fa598d7a8fcf26798854e0d74708abcc4/V2_icons/large/png/";

// Prioritized suffixes
const ICON_MAP = {
  "10000": "10000_clear_large@2x.png",
  "10001": "10001_clear_large@2x.png",
  "10010": "10010_cloudy_large@2x.png",
  "11000": "11000_mostly_clear_large@2x.png",
  "11001": "11001_mostly_clear_large@2x.png",
  "11010": "11010_partly_cloudy_large@2x.png",
  "11011": "11011_partly_cloudy_large@2x.png",
  "11020": "11020_mostly_cloudy_large@2x.png",
  "11021": "11021_mostly_cloudy_large@2x.png",
  "11030": "11030_mostly_clear_large@2x.png",
  "11031": "11031_mostly_clear_large@2x.png",
  "20000": "20000_fog_large@2x.png",
  "21000": "21000_fog_light_large@2x.png",
  "21010": "21010_fog_light_mostly_clear_large@2x.png",
  "21011": "21011_fog_light_mostly_clear_large@2x.png",
  "21020": "21020_fog_light_partly_cloudy_large@2x.png",
  "21021": "21021_fog_light_partly_cloudy_large@2x.png",
  "21030": "21030_fog_light_mostly_cloudy_large@2x.png",
  "21031": "21031_fog_light_mostly_cloudy_large@2x.png",
  "21060": "21060_fog_mostly_clear_large@2x.png",
  "21061": "21061_fog_mostly_clear_large@2x.png",
  "21070": "21070_fog_partly_cloudy_large@2x.png",
  "21071": "21071_fog_partly_cloudy_large@2x.png",
  "21080": "21080_fog_mostly_cloudy_large@2x.png",
  "21081": "21081_fog_mostly_cloudy_large@2x.png",
  "40000": "40000_drizzle_large@2x.png",
  "40010": "40010_rain_large@2x.png",
  "42000": "42000_rain_light_large@2x.png",
  "42010": "42010_rain_heavy_large@2x.png",
  "42020": "42020_rain_heavy_partly_cloudy_large@2x.png",
  "42021": "42021_rain_heavy_partly_cloudy_large@2x.png",
  "42030": "42030_drizzle_mostly_clear_large@2x.png",
  "42031": "42031_drizzle_mostly_clear_large@2x.png",
  "42040": "42040_drizzle_partly_cloudy_large@2x.png",
  "42041": "42041_drizzle_partly_cloudy_large@2x.png",
  "42050": "42050_drizzle_mostly_cloudy_large@2x.png",
  "42051": "42051_drizzle_mostly_cloudy_large@2x.png",
  "42080": "42080_rain_partly_cloudy_large@2x.png",
  "42081": "42081_rain_partly_cloudy_large@2x.png",
  "42090": "42090_rain_mostly_clear_large@2x.png",
  "42091": "42091_rain_mostly_clear_large@2x.png",
  "42100": "42100_rain_mostly_cloudy_large@2x.png",
  "42101": "42101_rain_mostly_cloudy_large@2x.png",
  "42110": "42110_rain_heavy_mostly_clear_large@2x.png",
  "42111": "42111_rain_heavy_mostly_clear_large@2x.png",
  "42120": "42120_rain_heavy_mostly_cloudy_large@2x.png",
  "42121": "42121_rain_heavy_mostly_cloudy_large@2x.png",
  "42130": "42130_rain_light_mostly_clear_large@2x.png",
  "42131": "42131_rain_light_mostly_clear_large@2x.png",
  "42140": "42140_rain_light_partly_cloudy_large@2x.png",
  "42141": "42141_rain_light_partly_cloudy_large@2x.png",
  "42150": "42150_rain_light_mostly_cloudy_large@2x.png",
  "42151": "42151_rain_light_mostly_cloudy_large@2x.png",
  "50000": "50000_snow_large@2x.png",
  "50010": "50010_flurries_large@2x.png",
  "51000": "51000_snow_light_large@2x.png",
  "51010": "51010_snow_heavy_large@2x.png",
  "51020": "51020_snow_light_mostly_clear_large@2x.png",
  "51021": "51021_snow_light_mostly_clear_large@2x.png",
  "51030": "51030_snow_light_partly_cloudy_large@2x.png",
  "51031": "51031_snow_light_partly_cloudy_large@2x.png",
  "51040": "51040_snow_light_mostly_cloudy_large@2x.png",
  "51041": "51041_snow_light_mostly_cloudy_large@2x.png",
  "51050": "51050_snow_mostly_clear_large@2x.png",
  "51051": "51051_snow_mostly_clear_large@2x.png",
  "51060": "51060_snow_partly_cloudy_large@2x.png",
  "51061": "51061_snow_partly_cloudy_large@2x.png",
  "51070": "51070_snow_mostly_cloudy_large@2x.png",
  "51071": "51071_snow_mostly_cloudy_large@2x.png",
  "51080": "51080_wintry_mix_large@2x.png",
  "51100": "51100_wintry_mix_large@2x.png",
  "51120": "51120_wintry_mix_large@2x.png",
  "51140": "51140_wintry_mix_large@2x.png",
  "51150": "51150_flurries_mostly_clear_large@2x.png",
  "51151": "51151_flurries_mostly_clear_large@2x.png",
  "51160": "51160_flurries_partly_cloudy_large@2x.png",
  "51161": "51161_flurries_partly_cloudy_large@2x.png",
  "51170": "51170_flurries_mostly_cloudy_large@2x.png",
  "51171": "51171_flurries_mostly_cloudy_large@2x.png",
  "51190": "51190_snow_heavy_mostly_clear_large@2x.png",
  "51191": "51191_snow_heavy_mostly_clear_large@2x.png",
  "51200": "51200_snow_heavy_partly_cloudy_large@2x.png",
  "51201": "51201_snow_heavy_partly_cloudy_large@2x.png",
  "51210": "51210_snow_heavy_mostly_cloudy_large@2x.png",
  "51211": "51211_snow_heavy_mostly_cloudy_large@2x.png",
  "51220": "51220_wintry_mix_large@2x.png",
  "60000": "60000_freezing_rain_drizzle_large@2x.png",
  "60010": "60010_freezing_rain_large@2x.png",
  "60020": "60020_freezing_rain_drizzle_partly_cloudy_large@2x.png",
  "60021": "60021_freezing_rain_drizzle_partly_cloudy_large@2x.png",
  "60030": "60030_freezing_rain_drizzle_mostly_clear_large@2x.png",
  "60031": "60031_freezing_rain_drizzle_mostly_clear_large@2x.png",
  "60040": "60040_freezing_rain_drizzle_mostly_cloudy_large@2x.png",
  "60041": "60041_freezing_rain_drizzle_mostly_cloudy_large@2x.png",
  "62000": "62000_freezing_rain_light_large@2x.png",
  "62010": "62010_freezing_rain_heavy_large@2x.png",
  "62020": "62020_freezing_rain_heavy_partly_cloudy_large@2x.png",
  "62021": "62021_freezing_rain_heavy_partly_cloudy_large@2x.png",
  "62030": "62030_freezing_rain_light_partly_cloudy_large@2x.png",
  "62031": "62031_freezing_rain_light_partly_cloudy_large@2x.png",
  "62040": "62040_wintry_mix_large@2x.png",
  "62050": "62050_freezing_rain_light_mostly_clear_large@2x.png",
  "62051": "62051_freezing_rain_light_mostly_clear_large@2x.png",
  "62060": "62060_wintry_mix_large@2x.png",
  "62070": "62070_freezing_rain_heavy_mostly_clear_large@2x.png",
  "62071": "62071_freezing_rain_heavy_mostly_clear_large@2x.png",
  "62080": "62080_freezing_rain_heavy_mostly_cloudy_large@2x.png",
  "62081": "62081_freezing_rain_heavy_mostly_cloudy_large@2x.png",
  "62090": "62090_freezing_rain_light_mostly_cloudy_large@2x.png",
  "62091": "62091_freezing_rain_light_mostly_cloudy_large@2x.png",
  "62120": "62120_wintry_mix_large@2x.png",
  "62130": "62130_freezing_rain_mostly_clear_large@2x.png",
  "62131": "62131_freezing_rain_mostly_clear_large@2x.png",
  "62140": "62140_freezing_rain_partly_cloudy_large@2x.png",
  "62141": "62141_freezing_rain_partly_cloudy_large@2x.png",
  "62150": "62150_freezing_rain_mostly_cloudy_large@2x.png",
  "62151": "62151_freezing_rain_mostly_cloudy_large@2x.png",
  "62200": "62200_wintry_mix_large@2x.png",
  "62220": "62220_wintry_mix_large@2x.png",
  "70000": "70000_ice_pellets_large@2x.png",
  "71010": "71010_ice_pellets_heavy_large@2x.png",
  "71020": "71020_ice_pellets_light_large@2x.png",
  "71030": "71030_wintry_mix_large@2x.png",
  "71050": "71050_wintry_mix_large@2x.png",
  "71060": "71060_wintry_mix_large@2x.png",
  "71070": "71070_ice_pellets_partly_cloudy_large@2x.png",
  "71071": "71071_ice_pellets_partly_cloudy_large@2x.png",
  "71080": "71080_ice_pellets_mostly_clear_large@2x.png",
  "71081": "71081_ice_pellets_mostly_clear_large@2x.png",
  "71090": "71090_ice_pellets_mostly_cloudy_large@2x.png",
  "71091": "71091_ice_pellets_mostly_cloudy_large@2x.png",
  "71100": "71100_ice_pellets_light_mostly_clear_large@2x.png",
  "71101": "71101_ice_pellets_light_mostly_clear_large@2x.png",
  "71110": "71110_ice_pellets_light_partly_cloudy_large@2x.png",
  "71111": "71111_ice_pellets_light_partly_cloudy_large@2x.png",
  "71120": "71120_ice_pellets_light_mostly_cloudy_large@2x.png",
  "71121": "71121_ice_pellets_light_mostly_cloudy_large@2x.png",
  "71130": "71130_ice_pellets_heavy_mostly_clear_large@2x.png",
  "71131": "71131_ice_pellets_heavy_mostly_clear_large@2x.png",
  "71140": "71140_ice_pellets_heavy_partly_cloudy_large@2x.png",
  "71141": "71141_ice_pellets_heavy_partly_cloudy_large@2x.png",
  "71150": "71150_wintry_mix_large@2x.png",
  "71160": "71160_ice_pellets_heavy_mostly_cloudy_large@2x.png",
  "71161": "71161_ice_pellets_heavy_mostly_cloudy_large@2x.png",
  "71170": "71170_wintry_mix_large@2x.png",
  "80000": "80000_tstorm_large@2x.png",
  "80010": "80010_tstorm_mostly_clear_large@2x.png",
  "80011": "80011_tstorm_mostly_clear_large@2x.png",
  "80020": "80020_tstorm_mostly_cloudy_large@2x.png",
  "80021": "80021_tstorm_mostly_cloudy_large@2x.png",
  "80030": "80030_tstorm_partly_cloudy_large@2x.png",
  "80031": "80031_tstorm_partly_cloudy_large@2x.png"
};


// cache to avoid repeated checks
const _icon_cache = new Map();

// convert code to label

// convert code to label
function codeToLabel(code) {
  if (code === null || code === undefined) return "Unknown";
  let fname;
  if (_icon_cache.has(`${code}_true`)) {
    fname = _icon_cache.get(`${code}_true`).split("/").pop();
  } else if (_icon_cache.has(`${code}_false`)) {
    fname = _icon_cache.get(`${code}_false`).split("/").pop();
  } else if (_icon_cache.has(code)) {
    fname = _icon_cache.get(code).split("/").pop();
  } else {
    return `Code ${code}`;
  }
  let suffix = fname.split("_").slice(1).join("_");
  return suffix.replace("_large@2x.png", "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// get icon url for weather code
async function getIconUrlForCode(code, isNight = false, isDay = false) {
  if (code === null || code === undefined) return ICON_BASE + "71090_ice_pellets_mostly_cloudy_large@2x.png";

  const cacheKey = `${code}_${isNight}`;
  if (_icon_cache.has(cacheKey)) return _icon_cache.get(cacheKey);

  let codeStr = String(code);
  if (codeStr.length === 4) {
    // build day/night variant
    const dayCode = `${codeStr}0`;
    const nightCode = `${codeStr}1`;

    // choose preferred
    let candidate = isNight ? nightCode : dayCode;

    // fallback to day if chosen doesn’t exist in dict
    if (!ICON_MAP[candidate]) {
      candidate = dayCode;
    }

    if (ICON_MAP[candidate]) {
      const url = ICON_BASE + ICON_MAP[candidate];
      _icon_cache.set(cacheKey, url);
      return url;
    }
  } else {
    // already full code, just check dict
    if (ICON_MAP[codeStr]) {
      const url = ICON_BASE + ICON_MAP[codeStr];
      _icon_cache.set(cacheKey, url);
      return url;
    }
  }

  // fallback default
  const fallback = ICON_BASE + "71090_ice_pellets_mostly_cloudy_large@2x.png";
  _icon_cache.set(cacheKey, fallback);
  return fallback;
}

// convert ISO to local datetime
function isoToLocal(dtIso) {
  if (!dtIso) return null;
  try {
    const dt = new Date(dtIso);
    return dt.toLocaleString("en-US", { timeZone: LOCAL_TZ });
  } catch {
    return null;
  }
}

// main getWeather function
export async function getWeather() {
  try {
    const params = new URLSearchParams({
      apikey: WEATHER_KEY,
      location: `${LAT},${LON}`,
      units: "imperial"
    });

    const r = await fetch(`${WEATHER_URL}?${params.toString()}`, { timeout: 12000 });
    const data = await r.json();

    const timelines = data.timelines || {};
    const hourlyRaw = (timelines.hourly || []).slice(0, 14);
    const dailyRaw = timelines.daily || [];

    let iconSunrise = null, iconSunset = null;
    if (dailyRaw.length) {
      const todayVals = dailyRaw[0].values || {};
      iconSunrise = isoToLocal(todayVals.sunriseTime);
      iconSunset = isoToLocal(todayVals.sunsetTime);
    }

    const hourly = [];
    for (const h of hourlyRaw) {
      const tkey = h.startTime || h.time;
      const vals = h.values || {};
      const code = vals.weatherCode;
      const temp = vals.temperature;
      const feels = vals.temperatureApparent;
      const rain = vals.precipitationProbability || 0;

      // Parse local time for this hourly entry
      const localTime = isoToLocal(tkey);
      const localDate = localTime ? new Date(localTime) : null;
      const timeStr = localDate ? localDate.toLocaleString("en-US", { hour: 'numeric', hour12: true }) : "";

      let isNight = false;
      let isDay = false;

      if (localDate) {
        // find which daily forecast matches this hour
        const matchingDay = dailyRaw.find(d => {
          const dDate = new Date(isoToLocal(d.time));
          return (
            dDate.getDate() === localDate.getDate() &&
            dDate.getMonth() === localDate.getMonth() &&
            dDate.getFullYear() === localDate.getFullYear()
          );
        });

        if (matchingDay) {
          const dayVals = matchingDay.values || {};
          const sunrise = new Date(isoToLocal(dayVals.sunriseTime));
          const sunset = new Date(isoToLocal(dayVals.sunsetTime));

          if (localDate >= sunset || localDate < sunrise) {
            isNight = true;
          } else {
            isDay = true;
          }
        }
      }

      
      const iconUrl = await getIconUrlForCode(code, isNight, isDay);

      hourly.push({ time: timeStr, temp, feels_like: feels, rain, code, icon: iconUrl });
    }

    let dailyAvg = null;
    if (dailyRaw.length) {
      const todayVals = dailyRaw[0].values || {};
      if (todayVals.temperatureAvg != null) dailyAvg = todayVals.temperatureAvg;
      else if (todayVals.temperatureMin != null && todayVals.temperatureMax != null) dailyAvg = (todayVals.temperatureMin + todayVals.temperatureMax) / 2;
    }

    // Sunrise/sunset via sunrise-sunset.org
    let labelSunrise = null, labelSunset = null;
    try {
      const sunResp = await fetch(`https://api.sunrise-sunset.org/json?lat=${LAT}&lng=${LON}&formatted=0`).then(r => r.json());
      labelSunrise = isoToLocal(sunResp.results.sunrise);
      labelSunset = isoToLocal(sunResp.results.sunset);
    } catch {}

    const now = new Date();
    let sunLabel = "Sun", sunTime = "N/A";
    if (labelSunrise && labelSunset) {
      const nowMs = now.getTime();
      if (new Date(labelSunrise).getTime() <= nowMs && nowMs <= new Date(labelSunset).getTime()) {
        sunLabel = "Sunset";
        sunTime = new Date(labelSunset).toLocaleString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true });
      } else {
        sunLabel = "Sunrise";
        sunTime = new Date(labelSunrise).toLocaleString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true });
      }
    }

    let current;
    if (hourly.length) {
      const cur = hourly[0];
      current = {
        temp: cur.temp,
        feels_like: cur.feels_like,
        rain: cur.rain,
        icon: cur.icon,
        code: cur.code,
        label: codeToLabel(cur.code)
      };
    } else {
      const defaultIcon = await getIconUrlForCode(1000, false);
      current = { temp: null, feels_like: null, rain: 0, icon: defaultIcon, code: 1000, label: codeToLabel(1000) };
    }

    return { current, hourly, daily_avg: dailyAvg != null ? Math.round(dailyAvg * 10) / 10 : null, sun: { label: sunLabel, time: sunTime } };

  } catch (exc) {
    console.error("weather.getWeather error:", exc);
    const fallbackIcon = await getIconUrlForCode(1000, false);
    return { current: { temp: null, feels_like: null, rain: 0, icon: fallbackIcon, code: 1000 }, hourly: [], daily_avg: null, sun: { label: "Sun", time: "N/A" } };
  }
}
