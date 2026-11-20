const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const ticketmaster = require("./providers/ticketmaster");
const seatgeek = require("./providers/seatgeek");
const predicthq = require("./providers/predicthq");
const mock = require("./providers/mock");
const { combineEvents } = require("./lib/merge");

const app = express();
const PORT = process.env.PORT || 8080; // Cloud Run sets PORT
const providers = [ticketmaster, seatgeek, predicthq];

app.use(cors());

// Health check for Cloud Run / the load balancer
app.get("/healthz", (req, res) => res.json({ status: "ok" }));

// Main route the frontend calls: /api/events?city=Richmond
app.get("/api/events", async (req, res) => {
  const city = (req.query.city || "").trim();
  if (!city) {
    return res.status(400).json({ events: [], error: "Please provide a city, e.g. /api/events?city=Richmond" });
  }

  const configured = providers.filter((p) => p.isConfigured());
  const useMock = process.env.USE_MOCK === "true" || configured.length === 0;

  if (useMock) {
    return res.json({ events: combineEvents([mock.getEvents(city)]) });
  }

  // Call all APIs at the same time; one failing API doesn't break the search
  const results = await Promise.allSettled(configured.map((p) => p.getEvents(city)));
  const lists = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") lists.push(r.value);
    else console.error(`[${configured[i].name}] failed:`, r.reason && r.reason.message);
  });

  res.json({ events: combineEvents(lists) });
});

// Optional: serve the frontend from the same container so /api/events
// works as a relative URL. Set STATIC_DIR to the frontend folder.
const staticDir = process.env.STATIC_DIR && path.resolve(process.env.STATIC_DIR);
if (staticDir && fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
  console.log(`Serving frontend from ${staticDir}`);
}

if (require.main === module) {
  app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
}

module.exports = app;
