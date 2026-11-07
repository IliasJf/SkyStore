import { describe as group, expect, it } from "vitest";
import { conditionsOf, describe, momentAt, outfitFor, type Weather } from "./sky";

const sky = (overrides: Partial<Weather>): Weather => ({
  temperature: 16,
  wind: 10,
  rain: false,
  isDay: true,
  code: 0,
  ...overrides,
});
const slots = (w: Weather) => outfitFor(w).map((p) => p.product.slot);

group("conditionsOf: turning the forecast into conditions", () => {
  it("splits temperature into hot, mild and cold at 22 °C and 12 °C", () => {
    expect(conditionsOf(sky({ temperature: 22 }))).toContain("hot");
    expect(conditionsOf(sky({ temperature: 21.9 }))).toContain("mild");
    expect(conditionsOf(sky({ temperature: 12 }))).toContain("mild");
    expect(conditionsOf(sky({ temperature: 11.9 }))).toContain("cold");
  });

  it("adds rain, wind from 25 km/h, and dark after sunset", () => {
    expect(conditionsOf(sky({ rain: true, wind: 25, isDay: false }))).toEqual(["mild", "rain", "wind", "dark"]);
    expect(conditionsOf(sky({ wind: 24 }))).not.toContain("wind");
  });
});

group("outfitFor: the pieces we suggest", () => {
  it("on a hot, bright day suggests a top, shorts, shoes and a cap, but no jacket", () => {
    const picks = slots(sky({ temperature: 28 }));
    expect(picks).toEqual(["base", "legs", "feet", "head"]);
  });

  it("adds a jacket second when it is cold, raining, windy or dark", () => {
    for (const w of [sky({ temperature: 5 }), sky({ rain: true }), sky({ wind: 40 }), sky({ isDay: false })]) {
      expect(slots(w)[1]).toBe("outer");
    }
  });

  it("never suggests a cap at night, even when it is hot", () => {
    expect(slots(sky({ temperature: 26, isDay: false }))).not.toContain("head");
  });

  it("gives every pick a reason that matches today's conditions", () => {
    const reasons: Record<string, string> = {
      hot: "keeps you cool",
      mild: "right for the temperature",
      cold: "adds warmth",
      rain: "sheds the rain",
      wind: "blocks the wind",
      dark: "keeps you seen",
    };
    for (const w of [sky({ temperature: 30 }), sky({ temperature: 3, rain: true, wind: 35, isDay: false })]) {
      const today = conditionsOf(w).map((c) => reasons[c]);
      for (const pick of outfitFor(w)) {
        expect(today).toContain(pick.why);
        expect(pick.product.conditions.some((c) => conditionsOf(w).includes(c))).toBe(true);
      }
    }
  });

  it("picks one piece per slot", () => {
    const picks = slots(sky({ temperature: 3, rain: true, wind: 35, isDay: false }));
    expect(new Set(picks).size).toBe(picks.length);
  });
});

group("describe: Open-Meteo weather codes in words", () => {
  it.each([
    [0, "clear"],
    [2, "partly cloudy"],
    [45, "foggy"],
    [61, "rainy"],
    [81, "rainy"],
    [71, "snowy"],
    [86, "snowy"],
    [95, "stormy"],
  ])("code %i is %s", (code, words) => {
    expect(describe(code)).toBe(words);
  });
});

group("momentAt: which sky the hero shows", () => {
  it.each([
    [4, "night"],
    [5, "dawn"],
    [10, "noon"],
    [15, "wind"],
    [18, "dusk"],
    [21, "night"],
    [0, "night"],
  ])("%i:00 is %s", (hour, moment) => {
    expect(momentAt(hour)).toBe(moment);
  });
});
