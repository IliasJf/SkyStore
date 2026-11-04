"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { describe, outfitFor, type Weather } from "@/lib/sky";
import { Picture } from "../Picture";
import { Price } from "../Price";

interface Place {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

/** Skies to pick by hand when there's no connection, or just to see what changes. */
const PRESETS: { label: string; w: Weather }[] = [
  { label: "Hot and bright", w: { temperature: 28, wind: 8, rain: false, isDay: true, code: 0 } },
  { label: "Mild", w: { temperature: 16, wind: 10, rain: false, isDay: true, code: 2 } },
  { label: "Cold", w: { temperature: 5, wind: 12, rain: false, isDay: true, code: 3 } },
  { label: "Raining", w: { temperature: 11, wind: 15, rain: true, isDay: true, code: 61 } },
  { label: "Windy", w: { temperature: 13, wind: 38, rain: false, isDay: true, code: 3 } },
  { label: "After dark", w: { temperature: 9, wind: 10, rain: false, isDay: false, code: 0 } },
];

async function findPlace(name: string): Promise<Place | null> {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`);
  const data = await res.json();
  const r = data.results?.[0];
  return r ? { name: r.name, country: r.country ?? "", latitude: r.latitude, longitude: r.longitude } : null;
}

async function weatherAt(p: Place): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.latitude}&longitude=${p.longitude}&current=temperature_2m,precipitation,weather_code,wind_speed_10m,is_day&timezone=auto`;
  const c = (await (await fetch(url)).json()).current;
  return { temperature: Math.round(c.temperature_2m), wind: Math.round(c.wind_speed_10m), rain: c.precipitation > 0 || (c.weather_code >= 51 && c.weather_code <= 82), isDay: c.is_day === 1, code: c.weather_code };
}

export function Today() {
  const [place, setPlace] = useState<Place | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [preset, setPreset] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "failed" | "not-found">("loading");

  async function load(name: string, quiet = false) {
    if (!quiet) setStatus("loading");
    try {
      const p = await findPlace(name);
      if (!p) return setStatus("not-found");
      setPlace(p);
      setWeather(await weatherAt(p));
      setPreset(null);
      setStatus("ready");
    } catch {
      setStatus("failed");
    }
  }

  // Start from the visitor's own city, read from their time zone: no location prompt.
  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "Europe/London";
    const city = zone.split("/").pop()?.replace(/_/g, " ") || "London";
    // Already "loading" on first render; state changes only once the answer arrives.
    const start = async () => {
      await Promise.resolve();
      await load(city, true);
    };
    void start();
  }, []);

  const shown = preset ? PRESETS.find((p) => p.label === preset)!.w : weather;
  const picks = shown ? outfitFor(shown) : [];

  return (
    <section id="today" aria-labelledby="today-title" className="scroll-mt-[var(--header-h)] bg-night text-night-ink">
      <div className="wrap grid gap-12 py-[var(--gap-section)] lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div data-reveal>
          <h2 id="today-title" className="head">
            Dress for today&rsquo;s sky
          </h2>
          <p className="mt-6 max-w-[30ch] text-lead leading-snug font-semibold" aria-live="polite">
            {preset
              ? `Kit for when it's ${preset.toLowerCase()}.`
              : status === "ready" && place && weather
                ? `Right now in ${place.name}: ${weather.temperature}°C, ${describe(weather.code)}, wind ${weather.wind} km/h${weather.isDay ? "" : ", and dark"}.`
                : status === "loading"
                  ? "Reading the sky where you are…"
                  : status === "not-found"
                    ? `We couldn't find “${query}”. Try a nearby city.`
                    : "The forecast didn't load. Pick a sky below instead."}
          </p>

          <form
            className="mt-8 flex max-w-md gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) void load(query.trim());
            }}
          >
            <label htmlFor="city" className="sr-only">
              Your city
            </label>
            <input id="city" className="input !border-[#5d6b7c] !bg-[#0c1a2e] !text-night-ink placeholder:text-[#8b98a8]" placeholder="Another city" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="address-level2" />
            <button className="btn shrink-0" type="submit">
              Check
            </button>
          </form>

          <fieldset className="mt-8">
            <legend className="font-semibold">Or pick a sky</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  aria-pressed={preset === p.label}
                  onClick={() => setPreset(preset === p.label ? null : p.label)}
                  className="min-h-11 bg-[#16263d] px-4 font-semibold transition-[background-color,transform] duration-150 hover:bg-[#22385a] active:scale-95 aria-pressed:bg-night-ink aria-pressed:text-night"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div>
          <h3 className="sr-only">Today&rsquo;s picks</h3>
          <ul className="grid gap-px" key={picks.map((p) => p.product.slug).join()}>
            {picks.map(({ product, why }, i) => (
              <li key={product.slug} className="animate-[rise_480ms_var(--ease-out)_both]" style={{ animationDelay: `${i * 70}ms` }}>
                <Link href={`/product/${product.slug}/`} className="group grid grid-cols-[88px_1fr_auto] items-center gap-5 bg-[#0c1a2e] p-3 pe-5 transition-colors duration-200 hover:bg-[#16263d] sm:grid-cols-[112px_1fr_auto]">
                  <Picture name={product.colours[0].image} alt={product.name} sizes="112px" className="aspect-[4/5] w-full object-cover" width={112} height={140} />
                  <span>
                    <span className="block text-lead font-extrabold tracking-[-0.03em]">{product.name}</span>
                    <span className="block text-[#b9c3cf]">{why.charAt(0).toUpperCase() + why.slice(1)}</span>
                  </span>
                  <span className="text-right">
                    <Price usd={product.price} className="block font-semibold" />
                    <span className="mt-1 block text-small font-semibold text-[#9cc2ff] transition-transform duration-200 group-hover:translate-x-1">Choose size →</span>
                  </span>
                </Link>
              </li>
            ))}
            {!picks.length &&
              [0, 1, 2, 3].map((i) => <li key={i} className="h-[136px] bg-[#0c1a2e] sm:h-[164px]" aria-hidden="true" />)}
          </ul>
        </div>
      </div>
    </section>
  );
}
