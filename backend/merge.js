// Combines event lists from every API, removes duplicates, and sorts by date.
// Every event has the shape the frontend expects:
// { title, date, venue, city, url }

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}

// Two events are duplicates if they have the same title, day, and venue
function dedupeKey(event) {
  const day = String(event.date || "").slice(0, 10); // YYYY-MM-DD
  return `${normalize(event.title)}|${day}|${normalize(event.venue)}`;
}

function isValid(event) {
  return event && event.title && event.date && !Number.isNaN(Date.parse(event.date));
}

function combineEvents(lists) {
  const seen = new Map();

  for (const list of lists) {
    for (const event of list || []) {
      if (!isValid(event)) continue;
      const key = dedupeKey(event);
      const existing = seen.get(key);
      // Keep the first copy, but fill in a URL if the first one was missing it
      if (!existing) seen.set(key, { ...event });
      else if (!existing.url && event.url) existing.url = event.url;
    }
  }

  return [...seen.values()].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
}

// Turns any date string into "YYYY-MM-DDTHH:MM:SS" (no timezone),
// matching the format the frontend was built for.
function toLocalIso(value) {
  if (!value) return null;
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2})(?::(\d{2}))?)?/);
  if (!match) return null;
  return `${match[1]}T${match[2] || "00:00"}:${match[3] || "00"}`;
}

module.exports = { combineEvents, dedupeKey, toLocalIso };
