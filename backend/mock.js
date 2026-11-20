// Sample data so the frontend can be tested before API keys are set up.
// Used when USE_MOCK=true or when no API keys are configured.
// Includes a duplicate on purpose to show that de-duplication works.
module.exports = {
  name: "Mock",
  getEvents(city) {
    return [
      { title: "Holiday Lights Festival", date: "2026-12-20T18:00:00", venue: `${city} Botanical Garden`, city, url: "https://example.com/lights" },
      { title: "Example Concert", date: "2026-12-15T19:00:00", venue: `${city} Convention Center`, city, url: "https://example.com/event" },
      { title: "Winter Comedy Night", date: "2026-12-05T20:00:00", venue: `${city} Theater`, city, url: "https://example.com/comedy" },
      { title: "EXAMPLE CONCERT", date: "2026-12-15T19:00:00", venue: `${city} Convention Center`, city, url: "https://example.com/duplicate" },
      { title: "New Year's Eve Countdown", date: "2026-12-31T21:00:00", venue: "Downtown Plaza", city, url: "https://example.com/nye" },
    ];
  },
};
