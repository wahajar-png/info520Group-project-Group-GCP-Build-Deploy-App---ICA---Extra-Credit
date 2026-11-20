// Ticketmaster Discovery API
// Docs: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
const { toLocalIso } = require("./merge");

const KEY = () => process.env.TICKETMASTER_API_KEY;

module.exports = {
  name: "Ticketmaster",
  isConfigured: () => Boolean(KEY()),

  async getEvents(city) {
    const params = new URLSearchParams({ apikey: KEY(), city, size: "50", sort: "date,asc" });
    const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const events = (data._embedded && data._embedded.events) || [];

    return events.map((e) => {
      const venue = (e._embedded && e._embedded.venues && e._embedded.venues[0]) || {};
      const start = (e.dates && e.dates.start) || {};
      return {
        title: e.name,
        date: toLocalIso(start.localTime ? `${start.localDate}T${start.localTime}` : start.localDate),
        venue: venue.name || "",
        city: (venue.city && venue.city.name) || city,
        url: e.url || "",
      };
    });
  },
};
