// SerpApi - Google Events results
// Docs: https://serpapi.com/google-events-api
// Google gives dates like "Nov 20" (no year) and times like "Thu, Nov 20, 7 – 10 PM",
// so this file turns them into "YYYY-MM-DDTHH:MM:SS".

const KEY = () => process.env.SERPAPI_KEY;
const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const pad = (n) => String(n).padStart(2, "0");

function parseGoogleDate(startDate, when, now = new Date()) {
  const m = String(startDate || "").match(/([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2})/);
  if (!m || !MONTHS[m[1].toLowerCase()]) return null;
  const month = MONTHS[m[1].toLowerCase()];
  const day = Number(m[2]);
  // No year given: if the month is well in the past, it's next year
  let year = now.getFullYear();
  if (month < now.getMonth() + 1 - 1) year += 1;

  let hour = 0, minute = 0;
  const text = String(when || "");
  // Skip past the date part ("Thu, Nov 20,") before looking for a time
  const afterDate = text.replace(/^[^,]*,\s*[A-Za-z]{3}[a-z]*\.?\s+\d{1,2},?/, "");
  const t = afterDate.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
  if (t) {
    hour = Number(t[1]);
    minute = Number(t[2] || 0);
    const meridiem = (t[3] || (afterDate.match(/\b(AM|PM)\b/i) || [])[1] || "").toUpperCase();
    if (meridiem === "PM" && hour < 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;
    if (hour > 23 || minute > 59) { hour = 0; minute = 0; }
  }
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`;
}

module.exports = {
  name: "SerpApi Google Events",
  isConfigured: () => Boolean(KEY()),
  parseGoogleDate,

  async getEvents(city) {
    const params = new URLSearchParams({
      engine: "google_events",
      q: `Events in ${city}`,
      htichips: "date:month",
      hl: "en",
      gl: "us",
      api_key: KEY(),
    });
    const res = await fetch(`https://serpapi.com/search.json?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    return (data.events_results || []).map((e) => {
      const date = e.date || {};
      const venue = (e.venue && e.venue.name) || (Array.isArray(e.address) ? e.address[0] : "") || "";
      return {
        title: e.title,
        date: parseGoogleDate(date.start_date, date.when),
        venue,
        city,
        url: e.link
          || ((e.ticket_info || []).find((t) => t && t.link) || {}).link
          || (e.event_location_map && e.event_location_map.link)
          || "",
      };
    });
  },
};
