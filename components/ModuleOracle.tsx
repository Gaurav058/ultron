"use client";

import React, { useState, useEffect, useCallback } from "react";

// Helper: weather icon selector
function weatherIcon(code: number): [string, string] {
  if (code === 0) return ["☀️", "CLEAR SKY"];
  if (code >= 1 && code <= 3) return ["⛅", "PARTLY CLOUDY"];
  if (code >= 45 && code <= 48) return ["🌫️", "FOGGY"];
  if (code >= 51 && code <= 55) return ["🌧️", "DRIZZLE"];
  if (code >= 61 && code <= 65) return ["🌧️", "RAINY"];
  if (code >= 71 && code <= 77) return ["❄️", "SNOWY"];
  if (code >= 80 && code <= 82) return ["🌦️", "SHOWERS"];
  if (code >= 95) return ["⛈️", "THUNDERSTORM"];
  return ["☁️", "CLOUDY"];
}

interface GeoData {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  source: string;
  timezone: string;
}

interface CryptoItem {
  usd: number;
  change: number;
  points: number[];
}

export default function ModuleOracle() {
  // States for each feed panel
  const [geo, setGeo] = useState<GeoData>({
    city: "New York",
    region: "NY",
    country: "United States",
    latitude: 40.7128,
    longitude: -74.006,
    source: "Default Matrix",
    timezone: "America/New_York",
  });
  const [geoStatus, setGeoStatus] = useState("LOCKED");

  const [weatherVal, setWeatherVal] = useState<{
    temp: number;
    desc: string;
    wind: number;
    forecast: { day: string; icon: string; temp: number }[];
  } | null>(null);
  const [weatherStatus, setWeatherStatus] = useState("INIT");

  const [cryptos, setCryptos] = useState<Record<string, CryptoItem>>({});
  const [cryptoStatus, setCryptoStatus] = useState("INIT");

  const [currencies, setCurrencies] = useState<Record<string, number>>({});
  const [currencyStatus, setCurrencyStatus] = useState("INIT");

  const [iss, setIss] = useState<{ lat: number; lon: number; alt: number; vel: number } | null>(null);
  const [issStatus, setIssStatus] = useState("INIT");

  const [news, setNews] = useState<{ id: number; title: string; url?: string }[]>([]);
  const [newsStatus, setNewsStatus] = useState("INIT");

  const [quakes, setQuakes] = useState<{ id: string; mag: number; place: string; time: string }[]>([]);
  const [quakeStatus, setQuakeStatus] = useState("INIT");

  // Load Geo & Reverse Geocode
  const loadGeo = useCallback(async () => {
    setGeoStatus("LOCKING...");
    try {
      const getCoords = (): Promise<GeolocationPosition> =>
        new Promise((resolve, reject) => {
          if (!navigator.geolocation) reject("Not supported");
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
        });

      const pos = await getCoords();
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`,
          { headers: { "Accept-Language": "en" } }
        );
        if (res.ok) {
          const d = await res.json();
          const addr = d.address || {};
          setGeo({
            city: addr.city || addr.town || addr.village || addr.suburb || "Local Node",
            region: addr.state || addr.region || "",
            country: addr.country || "Earth",
            latitude: lat,
            longitude: lon,
            source: "Browser GPS",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
          setGeoStatus("GPS FIX");
          return;
        }
      } catch {}

      setGeo((prev) => ({ ...prev, latitude: lat, longitude: lon, source: "Coarse GPS" }));
      setGeoStatus("COARSE FIX");
    } catch (e) {
      setGeoStatus("OFFLINE (IP FALLBACK)");
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const d = await res.json();
          setGeo({
            city: d.city || "Unknown Node",
            region: d.region_code || "",
            country: d.country_name || "Earth",
            latitude: d.latitude || 40.7128,
            longitude: d.longitude || -74.006,
            source: "Network IP",
            timezone: d.timezone || "UTC",
          });
          setGeoStatus("IP LOCK");
        }
      } catch {
        setGeoStatus("DEFAULT LOCK (TIMEOUT)");
      }
    }
  }, []);

  // Weather Load
  const loadWeather = useCallback(async (lat: number, lon: number) => {
    setWeatherStatus("FETCHING...");
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max&timezone=auto`
      );
      if (res.ok) {
        const d = await res.json();
        const cur = d.current_weather;
        const [icon, desc] = weatherIcon(cur.weathercode);
        const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        
        const forecast = (d.daily.time as string[]).map((timeStr, idx) => {
          const entryDate = new Date(timeStr);
          const [dayIcon] = weatherIcon(d.daily.weathercode[idx]);
          return {
            day: days[entryDate.getDay()],
            icon: dayIcon,
            temp: Math.round(d.daily.temperature_2m_max[idx]),
          };
        }).slice(0, 5);

        setWeatherVal({
          temp: Math.round(cur.temperature),
          desc: desc,
          wind: Math.round(cur.windspeed),
          forecast,
        });
        setWeatherStatus("LIVE");
      } else {
        setWeatherStatus("ERR");
      }
    } catch {
      setWeatherStatus("ERR");
    }
  }, []);

  // Cryptos Load
  const loadCryptos = useCallback(async () => {
    setCryptoStatus("PINGING...");
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano,ripple,dogecoin&vs_currencies=usd&include_24hr_change=true"
      );
      if (res.ok) {
        const data = await res.json();
        const updated: Record<string, CryptoItem> = {};
        const coins = ["bitcoin", "ethereum", "solana", "cardano", "ripple", "dogecoin"];

        coins.forEach((c) => {
          if (data[c]) {
            const currentVal = data[c].usd;
            const changePercent = data[c].usd_24hr_change || 0;
            // Synthesize short historic trend list for sparkline rendering
            const basePoints: number[] = [];
            for (let i = 0; i < 7; i++) {
              basePoints.push(currentVal * (1 + (Math.random() - 0.5) * 0.03));
            }
            basePoints.push(currentVal);
            updated[c] = {
              usd: currentVal,
              change: changePercent,
              points: basePoints,
            };
          }
        });
        setCryptos(updated);
        setCryptoStatus("NOMINAL");
      } else {
        // Fallback simulated prices
        simulateCryptos();
      }
    } catch {
      simulateCryptos();
    }
  }, []);

  const simulateCryptos = () => {
    const list = {
      bitcoin: { usd: 64230, change: 1.4 },
      ethereum: { usd: 3450, change: -0.8 },
      solana: { usd: 142.5, change: 4.2 },
      ripple: { usd: 0.58, change: 0.1 },
      dogecoin: { usd: 0.12, change: -1.5 },
    };
    const updated: Record<string, CryptoItem> = {};
    Object.entries(list).forEach(([key, item]) => {
      const basePoints = Array.from({ length: 8 }, () => item.usd * (1 + (Math.random() - 0.5) * 0.02));
      updated[key] = {
        usd: item.usd,
        change: item.change,
        points: basePoints,
      };
    });
    setCryptos(updated);
    setCryptoStatus("SIMULATED");
  };

  // Currency Rates Load
  const loadCurrencies = useCallback(async () => {
    setCurrencyStatus("REFRESHING...");
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      if (res.ok) {
        const data = await res.json();
        const rates = data.rates || {};
        const filtered: Record<string, number> = {
          EUR: rates.EUR || 0.92,
          GBP: rates.GBP || 0.78,
          INR: rates.INR || 83.5,
          JPY: rates.JPY || 158.2,
          AUD: rates.AUD || 1.49,
          CAD: rates.CAD || 1.36,
        };
        setCurrencies(filtered);
        setCurrencyStatus("NOMINAL");
      } else {
        setCurrencyStatus("ERR");
      }
    } catch {
      setCurrencyStatus("ERR");
    }
  }, []);

  // ISS Tracking Load
  const loadIss = useCallback(async () => {
    setIssStatus("PINGING...");
    try {
      const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
      if (res.ok) {
        const d = await res.json();
        setIss({
          lat: d.latitude,
          lon: d.longitude,
          alt: d.altitude,
          vel: d.velocity,
        });
        setIssStatus("LOCKED");
      } else {
        setIssStatus("LOST SIGNAL");
      }
    } catch {
      setIssStatus("Lost");
    }
  }, []);

  // Hacker News Loader
  const loadNews = useCallback(async () => {
    setNewsStatus("LOADING...");
    try {
      const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      if (res.ok) {
        const ids: number[] = await res.json();
        // Load top 4 items
        const fetches = ids.slice(0, 4).map((id) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => r.json())
        );
        const resolved = await Promise.all(fetches);
        setNews(resolved.filter((item) => item && item.title));
        setNewsStatus("LIVE");
      } else {
        setNewsStatus("OFFLINE");
      }
    } catch {
      setNewsStatus("OFFLINE");
    }
  }, []);

  // Earthquakes USGS Loader
  const loadQuakes = useCallback(async () => {
    setQuakeStatus("SCANNING...");
    try {
      const res = await fetch(
        "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=4.5&limit=4"
      );
      if (res.ok) {
        const data = await res.json();
        const list = (data.features || []).map((f: any) => {
          const tDate = new Date(f.properties.time);
          return {
            id: f.id,
            mag: f.properties.mag,
            place: f.properties.place,
            time: `${tDate.getUTCHours().toString().padStart(2, "0")}:${tDate.getUTCMinutes().toString().padStart(2, "0")} UTC`,
          };
        });
        setQuakes(list);
        setQuakeStatus("MONITORING");
      } else {
        setQuakeStatus("OFFLINE");
      }
    } catch {
      setQuakeStatus("OFFLINE");
    }
  }, []);

  // Auto trigger load on coordinates modification
  useEffect(() => {
    loadWeather(geo.latitude, geo.longitude);
  }, [geo.latitude, geo.longitude, loadWeather]);

  // Initial loading
  useEffect(() => {
    loadGeo();
    loadCryptos();
    loadCurrencies();
    loadIss();
    loadNews();
    loadQuakes();
  }, [loadGeo, loadCryptos, loadCurrencies, loadIss, loadNews, loadQuakes]);

  // Sparkline Builder
  const drawSparkline = (points: number[], change: number) => {
    if (points.length < 2) return null;
    const width = 60;
    const height = 18;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const toX = (idx: number) => (idx / (points.length - 1)) * width;
    const toY = (val: number) => height - ((val - min) / range) * height;

    const pairs = points.map((p, idx) => `${toX(idx).toFixed(1)},${toY(p).toFixed(1)}`).join(" ");
    const strokeColor = change >= 0 ? "#00ff66" : "#ff3355";

    return (
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <polyline fill="none" stroke={strokeColor} strokeWidth="1.2" points={pairs} />
      </svg>
    );
  };

  return (
    <div className="oracle">
      {/* Panel 1: Geo Lock */}
      <div className="panel" style={{ background: "rgba(var(--color-primary-rgb), 0.03)", borderColor: "var(--hud-border)" }}>
        <div className="panel-header">
          <div className="panel-title" style={{ color: "var(--color-hot)" }}>◉ GEO LOCK</div>
          <div className="panel-tools">
            <span className="panel-status">{geoStatus}</span>
            <button className="panel-refresh" onClick={loadGeo}>↻</button>
          </div>
        </div>
        <div className="panel-body" style={{ color: "var(--color-primary)", fontFamily: "monospace", fontSize: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div><span style={{ opacity: 0.5 }}>COORD Y:</span> {geo.latitude.toFixed(5)}°</div>
            <div><span style={{ opacity: 0.5 }}>COORD X:</span> {geo.longitude.toFixed(5)}°</div>
            <div><span style={{ opacity: 0.5 }}>LOCATION:</span> {geo.city}, {geo.region}</div>
            <div><span style={{ opacity: 0.5 }}>COUNTRY:</span> {geo.country}</div>
            <div><span style={{ opacity: 0.5 }}>FIREWALL NODE:</span> {geo.source}</div>
          </div>
        </div>
      </div>

      {/* Panel 2: Weather */}
      <div className="panel" style={{ background: "rgba(var(--color-primary-rgb), 0.03)", borderColor: "var(--hud-border)" }}>
        <div className="panel-header">
          <div className="panel-title" style={{ color: "var(--color-hot)" }}>☁ WEATHER</div>
          <div className="panel-tools">
            <span className="panel-status">{weatherStatus}</span>
            <button className="panel-refresh" onClick={() => loadWeather(geo.latitude, geo.longitude)}>↻</button>
          </div>
        </div>
        <div className="panel-body">
          {weatherVal ? (
            <div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "20px" }}>{weatherVal.forecast[0]?.icon || "⛅"}</span>
                <div>
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--color-hot)" }}>{weatherVal.temp}°C</span>
                  <span style={{ fontSize: "9px", opacity: 0.5, marginLeft: "6px" }}>{weatherVal.desc}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", fontSize: "9px", fontFamily: "monospace" }}>
                {weatherVal.forecast.map((f, idx) => (
                  <div key={idx} style={{ textAlign: "center", flex: 1, background: "rgba(0,0,0,0.2)", borderRadius: "3px", padding: "3px" }}>
                    <div>{f.day}</div>
                    <div>{f.icon}</div>
                    <div style={{ color: "var(--color-hot)", fontWeight: "bold" }}>{f.temp}°</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="skeleton" style={{ height: "40px" }} />
          )}
        </div>
      </div>

      {/* Panel 3: Crypto Markets */}
      <div className="panel" style={{ background: "rgba(var(--color-primary-rgb), 0.03)", borderColor: "var(--hud-border)" }}>
        <div className="panel-header">
          <div className="panel-title" style={{ color: "var(--color-hot)" }}>₿ COIN TELEMETRY</div>
          <div className="panel-tools">
            <span className="panel-status">{cryptoStatus}</span>
            <button className="panel-refresh" onClick={loadCryptos}>↻</button>
          </div>
        </div>
        <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {Object.entries(cryptos).slice(0, 4).map(([name, item]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "9px", fontFamily: "monospace" }}>
              <span style={{ width: "36px", fontWeight: "bold", textTransform: "uppercase" }}>{name.slice(0, 3)}</span>
              <span style={{ width: "60px", textAlign: "right", color: "var(--color-hot)" }}>${item.usd.toLocaleString()}</span>
              <span>{drawSparkline(item.points, item.change)}</span>
              <span style={{ color: item.change >= 0 ? "#00ff66" : "#ff3355", width: "40px", textAlign: "right" }}>
                {item.change >= 0 ? "▲" : "▼"}{Math.abs(item.change).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 4: FX Currencies */}
      <div className="panel" style={{ background: "rgba(var(--color-primary-rgb), 0.03)", borderColor: "var(--hud-border)" }}>
        <div className="panel-header">
          <div className="panel-title" style={{ color: "var(--color-hot)" }}>$ FIAT EXCHANGE</div>
          <div className="panel-tools">
            <span className="panel-status">{currencyStatus}</span>
            <button className="panel-refresh" onClick={loadCurrencies}>↻</button>
          </div>
        </div>
        <div className="panel-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {Object.entries(currencies).map(([name, rate]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", background: "rgba(0,0,0,0.15)", padding: "3px 6px", borderRadius: "3px", fontSize: "9px", fontFamily: "monospace" }}>
              <span style={{ fontWeight: "bold" }}>{name}</span>
              <span style={{ color: "var(--color-hot)" }}>{rate.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 5: ISS Satellite Live Track (Large) */}
      <div className="panel large" style={{ background: "rgba(var(--color-primary-rgb), 0.03)", borderColor: "var(--hud-border)" }}>
        <div className="panel-header">
          <div className="panel-title" style={{ color: "var(--color-hot)" }}>⌖ ISS LIVE TRACKING</div>
          <div className="panel-tools">
            <span className="panel-status">{issStatus}</span>
            <button className="panel-refresh" onClick={loadIss}>↻</button>
          </div>
        </div>
        <div className="panel-body" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {iss ? (
            <div style={{ display: "flex", gap: "24px", width: "100%", justifyContent: "space-around" }}>
              <div style={{ fontFamily: "monospace", fontSize: "10px" }}>
                <div><span style={{ opacity: 0.5 }}>LATITUDE:</span> {iss.lat.toFixed(4)}°</div>
                <div><span style={{ opacity: 0.5 }}>LONGITUDE:</span> {iss.lon.toFixed(4)}°</div>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "10px" }}>
                <div><span style={{ opacity: 0.5 }}>ALTITUDE:</span> {Math.round(iss.alt)} km</div>
                <div><span style={{ opacity: 0.5 }}>VELOCITY:</span> {Math.round(iss.vel)} km/h</div>
              </div>
            </div>
          ) : (
            <div className="skeleton" style={{ width: "100%", height: "20px" }} />
          )}
        </div>
      </div>

      {/* Panel 6: Hacker News stories */}
      <div className="panel large" style={{ background: "rgba(var(--color-primary-rgb), 0.03)", borderColor: "var(--hud-border)" }}>
        <div className="panel-header">
          <div className="panel-title" style={{ color: "var(--color-hot)" }}>⚡ HACKER NEWS TOPICS</div>
          <div className="panel-tools">
            <span className="panel-status">{newsStatus}</span>
            <button className="panel-refresh" onClick={loadNews}>↻</button>
          </div>
        </div>
        <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {news.map((item, idx) => (
            <div key={idx} style={{ fontSize: "10px", borderBottom: "1px dashed rgba(var(--color-primary-rgb), 0.15)", paddingBottom: "4px" }}>
              <span style={{ color: "var(--color-hot)", marginRight: "8px" }}>#{idx + 1}</span>
              <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }} className="news-link">
                {item.title}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 7: USGS Earthquakes */}
      <div className="panel large" style={{ background: "rgba(var(--color-primary-rgb), 0.03)", borderColor: "var(--hud-border)" }}>
        <div className="panel-header">
          <div className="panel-title" style={{ color: "var(--color-hot)" }}>▲ RECENT EARTHQUAKES (M ≥ 4.5)</div>
          <div className="panel-tools">
            <span className="panel-status">{quakeStatus}</span>
            <button className="panel-refresh" onClick={loadQuakes}>↻</button>
          </div>
        </div>
        <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {quakes.length > 0 ? (
            quakes.map((q) => (
              <div key={q.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", fontFamily: "monospace" }}>
                <span style={{ color: q.mag >= 6.0 ? "#ff2222" : "var(--color-hot)", fontWeight: "bold" }}>M {q.mag.toFixed(1)}</span>
                <span style={{ flex: 1, paddingLeft: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.place}</span>
                <span style={{ opacity: 0.5 }}>{q.time}</span>
              </div>
            ))
          ) : (
            <div style={{ fontSize: "10px", opacity: 0.5, fontStyle: "italic" }}>No significant seismic tremors locked, sir.</div>
          )}
        </div>
      </div>
    </div>
  );
}
