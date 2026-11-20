const test = require("node:test");
const assert = require("node:assert");
const { combineEvents, toLocalIso } = require("./merge");

test("removes duplicates across APIs", () => {
  const a = [{ title: "Example Concert", date: "2026-12-15T19:00:00", venue: "Richmond Convention Center", city: "Richmond", url: "https://a" }];
  const b = [{ title: "EXAMPLE CONCERT!", date: "2026-12-15T20:00:00", venue: "Richmond Convention Center", city: "Richmond", url: "https://b" }];
  assert.strictEqual(combineEvents([a, b]).length, 1);
});

test("sorts by date ascending", () => {
  const events = combineEvents([[
    { title: "B", date: "2026-12-20T10:00:00", venue: "X" },
    { title: "A", date: "2026-12-01T10:00:00", venue: "X" },
  ]]);
  assert.deepStrictEqual(events.map((e) => e.title), ["A", "B"]);
});

test("drops events with no title or bad date", () => {
  const events = combineEvents([[{ title: "", date: "2026-12-01" }, { title: "Ok", date: "not a date" }]]);
  assert.strictEqual(events.length, 0);
});

test("formats dates the way the frontend expects", () => {
  assert.strictEqual(toLocalIso("2026-12-15"), "2026-12-15T00:00:00");
  assert.strictEqual(toLocalIso("2026-12-15T19:00:00Z"), "2026-12-15T19:00:00");
  assert.strictEqual(toLocalIso("2026-12-15T19:00"), "2026-12-15T19:00:00");
});

const { parseGoogleDate } = require("./serpapi");
test("parses Google Events dates", () => {
  const now = new Date("2026-11-19T12:00:00");
  assert.strictEqual(parseGoogleDate("Nov 20", "Thu, Nov 20, 7 \u2013 10 PM", now), "2026-11-20T19:00:00");
  assert.strictEqual(parseGoogleDate("Dec 5", "Fri, Dec 5, 8:30 PM \u2013 Sat, Dec 6, 1 AM", now), "2026-12-05T20:30:00");
  assert.strictEqual(parseGoogleDate("Jan 3", "Sat, Jan 3, 11 AM \u2013 2 PM", now), "2027-01-03T11:00:00");
  assert.strictEqual(parseGoogleDate("Nov 22", "Sat, Nov 22", now), "2026-11-22T00:00:00");
});
