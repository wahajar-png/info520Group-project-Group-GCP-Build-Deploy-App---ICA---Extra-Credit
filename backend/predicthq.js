// PredictHQ Events API
// Docs: https://docs.predicthq.com/
// Step 1 looks up the city's place ID, step 2 searches events in that place.
const { toLocalIso } = require("./merge");

const TOKEN = () => process.env.PREDICTHQ_TOKEN;
const BASE = "https://api.predicthq.com/v1";

async function phq(path, params) {
  const res = await fetch(`${BASE}${path}?${new URLSearchParams(params)}`, {
    headers: { Authorization: `Bearer ${TOKEN()}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

module.exports = {
  name: "PredictHQ",
  isConfigured: () => Boolean(TOKEN()),

  async getEvents(city) {
    const places = await phq("/places/", { q: city, limit: "1" });
    const place = places.results && places.results[0];
    if (!place) return [];

    const today = new Date().toISOString().slice(0, 10);
    const data = await phq("/events/", {
      "place.scope": place.id,
      "active.gte": today,
      category: "concerts,performing-arts,sports,festivals,community,expos,conferences",
      sort: "start",
      limit: "50",
    });

    return (data.results || []).map((e) => {
      const venue = (e.entities || []).find((x) => x.type === "venue") || {};
      return {
        title: e.title,
        date: toLocalIso(e.start_local || e.start),
        venue: venue.name || "",
        city: place.name || city,
        url: "", // PredictHQ doesn't provide ticket links
      };
    });
  },
};
