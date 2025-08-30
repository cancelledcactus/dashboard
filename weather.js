// weather.js
// Node >=18 or modern browsers for fetch support

// Config
const LAT = 40.7675, LON = -73.8331;
const WEATHER_KEY = "9fzOlKwfgtt3GRWgNLWEJw0S36skrL8X";
const WEATHER_URL = "https://api.tomorrow.io/v4/weather/forecast";
const LOCAL_TZ = "America/New_York";
const ICON_BASE = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/51b9588fa598d7a8fcf26798854e0d74708abcc4/V2_icons/large/png/";

// Only @2x icons
const _SUFFIXES = [
  "10000_clear_large@2x.png",
  "10001_clear_large@2x.png",
  "10010_cloudy_large@2x.png",
  "11000_mostly_clear_large@2x.png",
  "11001_mostly_clear_large@2x.png",
  "11010_partly_cloudy_large@2x.png",
  "11011_partly_cloudy_large@2x.png",
  "11020_mostly_cloudy_large@2x.png",
  "11021_mostly_cloudy_large@2x.png",
  "11030_mostly_clear_large@2x.png",
  "11031_mostly_clear_large@2x.png",
  "20000_fog_large@2x.png",
  "21000_fog_light_large@2x.png",
  "21010_fog_light_mostly_clear_large@2x.png",
  "21011_fog_light_mostly_clear_large@2x.png",
  "21020_fog_light_partly_cloudy_large@2x.png",
  "21021_fog_light_partly_cloudy_large@2x.png",
  "21030_fog_light_mostly_cloudy_large@2x.png",
  "21031_fog_light_mostly_cloudy_large@2x.png",
  "21060_fog_mostly_clear_large@2x.png",
  "21061_fog_mostly_clear_large@2x.png",
  "21070_fog_partly_cloudy_large@2x.png",
  "21071_fog_partly_cloudy_large@2x.png",
  "21080_fog_mostly_cloudy_large@2x.png",
  "21081_fog_mostly_cloudy_large@2x.png",
  "40000_drizzle_large@2x.png",
  "40010_rain_large@2x.png",
  "42000_rain_light_large@2x.png",
  "42010_rain_heavy_large@2x.png",
  "42020_rain_heavy_partly_cloudy_large@2x.png",
  "42021_rain_heavy_partly_cloudy_large@2x.png",
  "42030_drizzle_mostly_clear_large@2x.png",
  "42031_drizzle_mostly_clear_large@2x.png",
  "42040_drizzle_partly_cloudy_large@2x.png",
  "42041_drizzle_partly_cloudy_large@2x.png",
  "42050_drizzle_mostly_cloudy_large@2x.png",
  "42051_drizzle_mostly_cloudy_large@2x.png",
  "42080_rain_partly_cloudy_large@2x.png",
  "42081_rain_partly_cloudy_large@2x.png",
  "42090_rain_mostly_clear_large@2x.png",
  "42091_rain_mostly_clear_large@2x.png",
  "42100_rain_mostly_cloudy_large@2x.png",
  "42101_rain_mostly_cloudy_large@2x.png",
  "42110_rain_heavy_mostly_clear_large@2x.png",
  "42111_rain_heavy_mostly_clear_large@2x.png",
  "42120_rain_heavy_mostly_cloudy_large@2x.png",
  "42121_rain_heavy_mostly_cloudy_large@2x.png",
  "42130_rain_light_mostly_clear_large@2x.png",
  "42131_rain_light_mostly_clear_large@2x.png",
  "42140_rain_light_partly_cloudy_large@2x.png",
  "42141_rain_light_partly_cloudy_large@2x.png",
  "42150_rain_light_mostly_cloudy_large@2x.png",
  "42151_rain_light_mostly_cloudy_large@2x.png",
  "50000_snow_large@2x.png",
  "50010_flurries_large@2x.png",
  "51000_snow_light_large@2x.png",
  "51010_snow_heavy_large@2x.png",
  "51020_snow_light_mostly_clear_large@2x.png",
  "51021_snow_light_mostly_clear_large@2x.png",
  "51030_snow_light_partly_cloudy_large@2x.png",
  "51031_snow_light_partly_cloudy_large@2x.png",
  "51040_snow_light_mostly_cloudy_large@2x.png",
  "51041_snow_light_mostly_cloudy_large@2x.png",
  "51050_snow_mostly_clear_large@2x.png",
  "51051_snow_mostly_clear_large@2x.png",
  "51060_snow_partly_cloudy_large@2x.png",
  "51061_snow_partly_cloudy_large@2x.png",
  "51070_snow_mostly_cloudy_large@2x.png",
  "51071_snow_mostly_cloudy_large@2x.png",
  "51080_wintry_mix_large@2x.png",
  "51100_wintry_mix_large@2x.png",
  "51120_wintry_mix_large@2x.png",
  "51140_wintry_mix_large@2x.png",
  "51150_flurries_mostly_clear_large@2x.png",
  "51151_flurries_mostly_clear_large@2x.png",
  "51160_flurries_partly_cloudy_large@2x.png",
  "51161_flurries_partly_cloudy_large@2x.png",
  "51170_flurries_mostly_cloudy_large@2x.png",
  "51171_flurries_mostly_cloudy_large@2x.png",
  "51190_snow_heavy_mostly_clear_large@2x.png",
  "51191_snow_heavy_mostly_clear_large@2x.png",
  "51200_snow_heavy_partly_cloudy_large@2x.png",
  "51201_snow_heavy_partly_cloudy_large@2x.png",
  "51210_snow_heavy_mostly_cloudy_large@2x.png",
  "51211_snow_heavy_mostly_cloudy_large@2x.png",
  "51220_wintry_mix_large@2x.png",
  "60000_freezing_rain_drizzle_large@2x.png",
  "60010_freezing_rain_large@2x.png",
  "60020_freezing_rain_drizzle_partly_cloudy_large@2x.png",
  "60021_freezing_rain_drizzle_partly_cloudy_large@2x.png",
  "60030_freezing_rain_drizzle_mostly_clear_large@2x.png",
  "60031_freezing_rain_drizzle_mostly_clear_large@2x.png",
  "60040_freezing_rain_drizzle_mostly_cloudy_large@2x.png",
  "60041_freezing_rain_drizzle_mostly_cloudy_large@2x.png",
  "62000_freezing_rain_light_large@2x.png",
  "62010_freezing_rain_heavy_large@2x.png",
  "62020_freezing_rain_heavy_partly_cloudy_large@2x.png",
  "62021_freezing_rain_heavy_partly_cloudy_large@2x.png",
  "62030_freezing_rain_light_partly_cloudy_large@2x.png",
  "62031_freezing_rain_light_partly_cloudy_large@2x.png",
  "62040_wintry_mix_large@2x.png",
  "62050_freezing_rain_light_mostly_clear_large@2x.png",
  "62051_freezing_rain_light_mostly_clear_large@2x.png",
  "62060_wintry_mix_large@2x.png",
  "62070_freezing_rain_heavy_mostly_clear_large@2x.png",
  "62071_freezing_rain_heavy_mostly_clear_large@2x.png",
  "62080_freezing_rain_heavy_mostly_cloudy_large@2x.png",
  "62081_freezing_rain_heavy_mostly_cloudy_large@2x.png",
  "62090_freezing_rain_light_mostly_cloudy_large@2x.png",
  "62091_freezing_rain_light_mostly_cloudy_large@2x.png",
  "62120_wintry_mix_large@2x.png",
  "62130_freezing_rain_mostly_clear_large@2x.png",
  "62131_freezing_rain_mostly_clear_large@2x.png",
  "62140_freezing_rain_partly_cloudy_large@2x.png",
  "62141_freezing_rain_partly_cloudy_large@2x.png",
  "62150_freezing_rain_mostly_cloudy_large@2x.png",
  "62151_freezing_rain_mostly_cloudy_large@2x.png",
  "62200_wintry_mix_large@2x.png",
  "62220_wintry_mix_large@2x.png",
  "70000_ice_pellets_large@2x.png",
  "71010_ice_pellets_heavy_large@2x.png",
  "71020_ice_pellets_light_large@2x.png",
  "71030_wintry_mix_large@2x.png",
  "71050_wintry_mix_large@2x.png",
  "71060_wintry_mix_large@2x.png",
  "71070_ice_pellets_partly_cloudy_large@2x.png",
  "71071_ice_pellets_partly_cloudy_large@2x.png",
  "71080_ice_pellets_mostly_clear_large@2x.png",
  "71081_ice_pellets_mostly_clear_large@2x.png",
  "71090_ice_pellets_mostly_cloudy_large@2x.png",
  "71091_ice_pellets_mostly_cloudy_large@2x.png",
  "71100_ice_pellets_light_mostly_clear_large@2x.png",
  "71101_ice_pellets_light_mostly_clear_large@2x.png",
  "71110_ice_pellets_light_partly_cloudy_large@2x.png",
  "71111_ice_pellets_light_partly_cloudy_large@2x.png",
  "71120_ice_pellets_light_mostly_cloudy_large@2x.png",
  "71121_ice_pellets_light_mostly_cloudy_large@2x.png",
  "71130_ice_pellets_heavy_mostly_clear_large@2x.png",
  "71131_ice_pellets_heavy_mostly_clear_large@2x.png",
  "71140_ice_pellets_heavy_partly_cloudy_large@2x.png",
  "71141_ice_pellets_heavy_partly_cloudy_large@2x.png",
  "71150_wintry_mix_large@2x.png",
  "71160_ice_pellets_heavy_mostly_cloudy_large@2x.png",
  "71161_ice_pellets_heavy_mostly_cloudy_large@2x.png",
  "71170_wintry_mix_large@2x.png",
  "80000_tstorm_large@2x.png",
  "80010_tstorm_mostly_clear_large@2x.png",
  "80011_tstorm_mostly_clear_large@2x.png",
  "80020_tstorm_mostly_cloudy_large@2x.png",
  "80021_tstorm_mostly_cloudy_large@2x.png",
  "80030_tstorm_partly_cloudy_large@2x.png",
  "80031_tstorm_partly_cloudy_large@2x.png"
];

// Keep your old day/night logic here
function isDay(currentTime) {
  // currentTime is expected as a JS Date object
  const hour = currentTime.getHours();
  return hour >= 6 && hour < 19; // 6AM-7PM = day
}

// Build full icon URL using your day/night logic
function getIconUrlForCode(code, currentTime = new Date()) {
  let codeStr = String(code);
  
  if (!isDay(currentTime)) {
    codeStr += "_night"; // apply night suffix if your logic needs it
  }

  const match = _SUFFIXES.find(suffix => suffix.startsWith(codeStr));
  return match ? ICON_BASE + match : ICON_BASE + "10000_clear_large@2x.png"; // fallback
}

// Fetch weather from Tomorrow.io
async function fetchWeather() {
  const url = `${WEATHER_URL}?location=${LAT},${LON}&timesteps=1d&units=imperial&apikey=${WEATHER_KEY}&fields=weatherCode`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    const code = data?.data?.timelines?.[0]?.intervals?.[0]?.values?.weatherCode;
    const icon = getIconUrlForCode(code);
    return { code, icon };
  } catch (err) {
    console.error("Weather fetch error:", err);
    return { code: null, icon: getIconUrlForCode(10000) };
  }
}

// Example usage
fetchWeather().then(w => console.log(w));
