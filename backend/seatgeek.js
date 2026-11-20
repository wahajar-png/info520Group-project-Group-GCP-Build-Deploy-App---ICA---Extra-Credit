// SeatGeek Platform API
// Docs: https://platform.seatgeek.com/
const { toLocalIso } = require("./merge");

const CLIENT_ID = () => process.env.SEATGEEK_CLIENT_ID;

module.exports = {
  name: "SeatGeek",
  isConfigured: () => Boolean(CLIENT_ID()),

  async getEvents(city) {
    const params = new URLSearchParams({
      client_id: CLIENT_ID(),
      "venue.city": city,
      per_page: "50",
      sort: "datetime_local.asc",
    });
    const res = await fetch(`https://api.seatgeek.com/2/events?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return (data.events || []).map((e) => ({
      title: e.title,
      date: toLocalIso(e.datetime_local),
      venue: (e.venue && e.venue.name) || "",
      city: (e.venue && e.venue.city) || city,
      url: e.url || "",
    }));
  },
};
