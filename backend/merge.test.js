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
