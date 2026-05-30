import React, { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { getPapersForView } from "./data/papers";
import {
  Home,
  Globe2,
  LayoutGrid,
  Database,
  ClipboardList,
  Network,
  Sparkles,
  Search,
  Bookmark,
  UserCircle,
  SlidersHorizontal,
  MapPin,
  ChevronDown,
  RotateCcw,
  DoorOpen,
  Move,
  Users,
  Scale,
  FileText,
  ExternalLink,
  Send,
  Trash2,
  Minus,
  Plus,
  Crosshair,
  Hand,
  MessageSquareText,
  RefreshCw,
  Layers3,
  BookOpen,
  X,
} from "lucide-react";

const interactiveCountries = new Set(["Singapore", "Thailand", "Philippines"]);

const interactiveMarkers = [
  { name: "Singapore", coordinates: [103.8198, 1.3521] },
  { name: "Thailand", coordinates: [100.5018, 13.7563] },
  { name: "Philippines", coordinates: [121.774, 12.8797] },
];

const labelMarkers = [
  { name: "Myanmar", coordinates: [96.0, 21.5] },
  { name: "Laos", coordinates: [102.6, 18.0] },
  { name: "Vietnam", coordinates: [108.3, 15.9] },
  { name: "Thailand", coordinates: [100.5, 15.8] },
  { name: "Cambodia", coordinates: [104.9, 12.6] },
  { name: "Malaysia", coordinates: [102.0, 4.2] },
  { name: "Singapore", coordinates: [103.8198, 1.3521] },
  { name: "Brunei", coordinates: [114.7, 4.6] },
  { name: "Indonesia", coordinates: [117.5, -2.5] },
  { name: "Philippines", coordinates: [121.0, 13.0] },
  { name: "Timor-Leste", coordinates: [125.8, -8.8] },
];
const seaCountries = new Set([
  "Brunei",
  "Cambodia",
  "Indonesia",
  "Laos",
  "Malaysia",
  "Myanmar",
  "Philippines",
  "Singapore",
  "Thailand",
  "Timor-Leste",
  "Vietnam",
]);

const nameAliases = {
  "Lao PDR": "Laos",
  "Lao People's Democratic Republic": "Laos",
  "Viet Nam": "Vietnam",
  "Vietnam": "Vietnam",
  "Brunei Darussalam": "Brunei",
  "Brunei": "Brunei",
  "Timor-Leste": "Timor-Leste",
  "East Timor": "Timor-Leste",
  "Myanmar": "Myanmar",
  "Burma": "Myanmar",
};

const countryProfiles = {
  "Southeast Asia": {
    caption: "Regional comparative literature, cross-country policy mapping, and thematic syntheses across Southeast Asian higher education.",
    corpus: "Comparative corpus",
  },
  Singapore: {
    caption: "Access, meritocracy, financial aid, and polytechnic-to-university pathways.",
    corpus: "3 sample studies",
  },
  Thailand: {
    caption: "Regional disparities, rural access, reform, and inclusion debates.",
    corpus: "3 sample studies",
  },
  Philippines: {
    caption: "Public-private divides, regional inequality, mobility, and student community.",
    corpus: "3 sample studies",
  },
};

const themeCards = [
  { title: "Access", subtitle: "Participation & enrolment", icon: DoorOpen },
  { title: "Mobility", subtitle: "Transitions & opportunity", icon: Move },
  { title: "Belonging", subtitle: "Identity & representation", icon: Users },
  { title: "Equity", subtitle: "Fairness & justice", icon: Scale },
  { title: "Inclusion", subtitle: "Diversity & participation", icon: Users },
];

const countryStudies = {
  "Southeast Asia": [
    {
      title: "Comparative Higher Education Equity in Southeast Asia",
      authors: "Atlas comparative corpus",
      meta: "Regional synthesis · Under construction",
      tags: ["Comparative", "Policy", "Equity"],
      summary: "This regional entry will hold papers and reports comparing higher education systems, policies, and equity narratives across Southeast Asia.",
    },
    {
      title: "Access, Mobility, and Belonging Across SEA Higher Education Systems",
      authors: "DPhil framework note",
      meta: "Conceptual synthesis · Under construction",
      tags: ["Access", "Mobility", "Belonging"],
      summary: "This card can organise cross-national arguments for your AMB framework and later literature review.",
    },
    {
      title: "Regional Policy Timeline: State Narratives of Opportunity",
      authors: "Policy mapping entry",
      meta: "Policy timeline · Under construction",
      tags: ["Policy", "Merit", "Inclusion"],
      summary: "This card links comparative policy documents, national strategies, and regional reports for public-facing synthesis.",
    },
  ],
  Singapore: [
    {
      title: "Financial Aid and Student Success in Singapore's Universities",
      authors: "Tan, L. · Wong, M. · Lee, S.",
      meta: "2024 · Journal of Higher Education Policy",
      tags: ["Access", "Meritocracy", "Financial aid"],
      summary: "Sample card: later, this will summarise evidence on financial aid, access, and student progression in Singapore.",
    },
    {
      title: "Polytechnic-to-University Pathways and Institutional Belonging",
      authors: "Atlas working note",
      meta: "Draft corpus entry · Under construction",
      tags: ["Mobility", "Belonging", "Pathways"],
      summary: "Sample card: this can later hold your own work on polytechnic transitions and hidden curriculum.",
    },
    {
      title: "Meritocracy, Aid, and the Politics of Opportunity",
      authors: "Comparative note",
      meta: "Theory-linked source · Under construction",
      tags: ["Meritocracy", "Policy", "Equity"],
      summary: "Sample card: use this for literature connecting merit, mobility, and institutional narratives.",
    },
  ],
  Thailand: [
    {
      title: "Regional Disparities in Thailand's Higher Education Access",
      authors: "Jantarat, F. · Prasert, A.",
      meta: "2023 · Asian Education Studies",
      tags: ["Rurality", "Access", "Regional inequality"],
      summary: "Sample card: later, this will summarise evidence on regional inequality, rural students, and university access.",
    },
    {
      title: "Rural Students and the Geography of Thai Higher Education",
      authors: "Atlas working note",
      meta: "Draft corpus entry · Under construction",
      tags: ["Rurality", "Mobility", "Belonging"],
      summary: "Sample card: future fieldwork and literature notes can sit here.",
    },
    {
      title: "Higher Education Reform and Inclusion in Thailand",
      authors: "Policy mapping entry",
      meta: "Policy timeline · Under construction",
      tags: ["Policy", "Inclusion", "Access"],
      summary: "Sample card: this can connect state reform language to equity outcomes.",
    },
  ],
  Philippines: [
    {
      title: "Public-Private Divides and Higher Education Mobility in the Philippines",
      authors: "Atlas working note",
      meta: "Draft corpus entry · Under construction",
      tags: ["Private HE", "Mobility", "Equity"],
      summary: "Sample card: this will later map how institutional type shapes student opportunity.",
    },
    {
      title: "Regional Inequality and Student Pathways in Philippine Universities",
      authors: "Comparative source note",
      meta: "Draft corpus entry · Under construction",
      tags: ["Regional inequality", "Access", "Class"],
      summary: "Sample card: future evidence on regional access and student migration can be organised here.",
    },
    {
      title: "Student Activism, Community, and Belonging",
      authors: "Atlas theme note",
      meta: "Theme-linked source · Under construction",
      tags: ["Belonging", "Community", "Student experience"],
      summary: "Sample card: this can later hold student narrative and community-based literature.",
    },
  ],
};

function getStudies(country) {
  return countryStudies[country] || countryStudies["Southeast Asia"];
}

function getPaperUrl(paper) {
  if (paper?.doi) {
    return paper.doi.startsWith("http") ? paper.doi : `https://doi.org/${paper.doi}`;
  }
  return paper?.source || "#";
}

const policyItems = [
  { flag: "🌏", year: "2026", title: "Comparative SEA Higher Education Policy Corpus" },
  { flag: "🇸🇬", year: "2015", title: "SkillsFuture Education Subsidies Reform" },
  { flag: "🇹🇭", year: "2022", title: "Thailand Education 4.0 Policy Initiative" },
  { flag: "🇵🇭", year: "2024", title: "Philippines Access and Mobility Policy Mapping" },
];

function getThemeCounts(records) {
  const counts = new Map();
  records.forEach((paper) => {
    (paper.tags || paper.themes || []).forEach((tag) => {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    });
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([theme, count]) => ({ theme, count }));
}

function Panel({ children, className = "" }) {
  return <div className={`rounded-xl border border-cyan-300/20 bg-[#031425]/80 shadow-[0_0_30px_rgba(14,165,233,0.08)] backdrop-blur-xl ${className}`}>{children}</div>;
}

function FilterItem({ icon: Icon, title, subtitle, toggle }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-cyan-300/20 bg-[#061a30] px-3 py-3 shadow-[inset_0_0_18px_rgba(14,165,233,0.05)]">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-400/10 text-cyan-200">
          <Icon size={16} />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-100">{title}</div>
          <div className="text-xs text-slate-400">{subtitle}</div>
        </div>
      </div>
      {toggle ? (
        <div className="flex h-5 w-10 items-center justify-end rounded-full bg-cyan-400 px-1 shadow-[0_0_14px_rgba(34,211,238,0.55)]">
          <div className="h-4 w-4 rounded-full bg-white" />
        </div>
      ) : (
        <ChevronDown size={16} className="text-cyan-100" />
      )}
    </div>
  );
}

function getNormalisedName(featureItem) {
  const raw = featureItem?.properties?.name || featureItem?.properties?.NAME || featureItem?.properties?.name_long || "";
  return nameAliases[raw] || raw;
}

function HolographicGeoMap({ selected, setSelected, setShowCorpusDrawer }) {
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const width = 1000;
  const height = 540;

  useEffect(() => {
    let active = true;
    async function loadMap() {
      try {
        setIsLoading(true);
        const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json");
        if (!response.ok) throw new Error("Map source did not load");
        const topology = await response.json();
        const allCountries = feature(topology, topology.objects.countries).features;
        const filtered = allCountries
          .map((item) => ({ ...item, atlasName: getNormalisedName(item) }))
          .filter((item) => seaCountries.has(item.atlasName));
        if (active) {
          setFeatures(filtered);
          setError(null);
        }
      } catch (err) {
        if (active) setError(err.message || "Map loading failed");
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadMap();
    return () => {
      active = false;
    };
  }, []);

  const projection = useMemo(() => {
    if (!features.length) return null;
    const projectionInstance = geoMercator();
    const target = selected !== "Southeast Asia" ? features.find((item) => item.atlasName === selected) : null;

    if (selected === "Singapore") {
      projectionInstance.center([103.8198, 1.3521]).scale(36000).translate([width / 2, height / 2]);
      return projectionInstance;
    }

    const shape = target || { type: "FeatureCollection", features };
    projectionInstance.fitExtent([[40, 32], [960, 505]], shape);
    return projectionInstance;
  }, [features, selected]);

  const path = useMemo(() => (projection ? geoPath(projection) : null), [projection]);
  const profile = countryProfiles[selected] || countryProfiles["Southeast Asia"];
  const isRegional = selected === "Southeast Asia";

  const labelPositions = useMemo(() => {
    if (!projection) return [];
    return labelMarkers
      .map((marker) => {
        const projected = projection(marker.coordinates);
        return projected ? { ...marker, x: projected[0], y: projected[1] } : null;
      })
      .filter(Boolean);
  }, [projection]);

  const markerPositions = useMemo(() => {
    if (!projection) return [];
    return interactiveMarkers
      .map((marker) => {
        const projected = projection(marker.coordinates);
        return projected ? { ...marker, x: projected[0], y: projected[1] } : null;
      })
      .filter(Boolean);
  }, [projection]);

  useEffect(() => {
    setZoom(1);
  }, [selected]);

  const zoomBy = (delta) => {
    setZoom((current) => Math.min(2.4, Math.max(0.78, current + delta)));
  };

  const resetMap = () => {
    setSelected("Southeast Asia");
    setZoom(1);
  };

  return (
    <div className="relative h-full select-none overflow-hidden rounded-xl bg-[#04101e]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.08)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_50%,rgba(14,165,233,0.30),transparent_34%),radial-gradient(circle_at_70%_25%,rgba(56,189,248,0.16),transparent_24%)]" />

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 h-full w-full select-none"
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center",
          transition: "transform 180ms ease-out",
        }}
      >
        <defs>
          <filter id="seaGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="seaDots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(103,232,249,0.35)" />
          </pattern>
        </defs>

        <g stroke="#38bdf8" strokeOpacity="0.16" fill="none">
          <circle cx="500" cy="270" r="155" />
          <circle cx="500" cy="270" r="260" />
          <path d="M60,400 C250,300 460,330 940,120" />
          <path d="M110,110 C350,20 660,40 900,180" />
          <path d="M100,470 C320,410 640,440 920,350" />
        </g>

        {path && features.map((item) => {
          const name = item.atlasName;
          const isInteractive = interactiveCountries.has(name);
          const isActive = selected === name;
          return (
            <path
              key={name}
              d={path(item)}
              onClick={() => isInteractive && setSelected(name)}
              className={isInteractive ? "cursor-pointer transition-all duration-500" : "cursor-not-allowed transition-all duration-500"}
              fill={isActive ? "rgba(103,232,249,0.44)" : isInteractive ? "url(#seaDots)" : "rgba(15,23,42,0.50)"}
              stroke={isActive ? "#e0faff" : isInteractive ? "#67e8f9" : "rgba(148,163,184,0.30)"}
              strokeWidth={isActive ? 2.8 : isInteractive ? 1.8 : 0.9}
              filter={isInteractive || isActive ? "url(#seaGlow)" : undefined}
              opacity={isInteractive || isRegional || isActive ? 1 : 0.42}
            />
          );
        })}

        {labelPositions.map((marker) => {
          const interactive = interactiveCountries.has(marker.name);
          if (interactive) return null;
          return (
            <g key={`${marker.name}-label`} transform={`translate(${marker.x}, ${marker.y})`} opacity={isRegional ? 0.68 : 0.22}>
              <circle r="5" fill="rgba(148,163,184,0.16)" stroke="rgba(148,163,184,0.40)" />
              <text x="9" y="4" fontSize="12" fontWeight="650" fill="#94a3b8" stroke="rgba(2,8,18,0.92)" strokeWidth="3" paintOrder="stroke">
                {marker.name}
              </text>
            </g>
          );
        })}

        {markerPositions.map((marker) => {
          const active = selected === marker.name;
          return (
            <g key={`${marker.name}-marker`} transform={`translate(${marker.x}, ${marker.y})`} onClick={() => setSelected(marker.name)} className="cursor-pointer">
              <circle r={active ? 22 : 15} fill="none" stroke="#67e8f9" strokeWidth="2" opacity="0.55" filter="url(#seaGlow)" />
              <circle r={active ? 11 : 8} fill={active ? "#e0faff" : "#67e8f9"} opacity="0.9" />
              <text x="15" y="5" fontSize="15" fontWeight="800" fill="#ecfeff" stroke="rgba(2,8,18,0.92)" strokeWidth="3.5" paintOrder="stroke">
                {marker.name}
              </text>
            </g>
          );
        })}
      </svg>

      {isLoading && (
        <div className="absolute inset-0 grid place-items-center bg-[#04101e]/70 text-sm text-cyan-100">Loading Southeast Asia map...</div>
      )}
      {error && (
        <div className="absolute inset-0 grid place-items-center bg-[#04101e]/80 p-8 text-center text-sm leading-6 text-amber-100">
          Map layer could not load. Check internet access, then refresh.
        </div>
      )}

      <div className="absolute bottom-6 left-6 flex items-start gap-3 rounded-lg border border-cyan-300/20 bg-[#031425]/90 p-3 text-xs leading-5 text-slate-300">
        <Hand size={18} className="mt-1 text-cyan-200" />
        <div>Stable mode.<br />Use buttons to zoom.<br />Click glowing countries.</div>
      </div>

      <div className="absolute left-6 top-16 z-30 flex flex-wrap gap-2">
        {["Southeast Asia", "Singapore", "Thailand", "Philippines"].map((view) => (
          <button
            key={view}
            onClick={() => {
                          setSelected(view);
                          if (view === "Southeast Asia") setShowCorpusDrawer(true);
                        }}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${selected === view ? "border-cyan-100 bg-cyan-300/25 text-white shadow-[0_0_14px_rgba(34,211,238,0.35)]" : "border-cyan-300/20 bg-[#031425]/75 text-cyan-100 hover:bg-cyan-400/10"}`}
          >
            {view === "Southeast Asia" ? "SEA" : view}
          </button>
        ))}
      </div>

      <div className="absolute right-5 top-5 z-30 max-h-[285px] w-[330px] overflow-y-auto rounded-xl border border-cyan-300/20 bg-[#031425]/92 p-4 text-sm shadow-[0_0_24px_rgba(14,165,233,0.18)] backdrop-blur">
        <div className="mb-1 text-xs uppercase tracking-[0.2em] text-cyan-200/80">{isRegional ? "Regional gateway" : "Country drilldown"}</div>
        <div className="text-xl font-bold text-white">{selected}</div>
        <div className="mt-2 text-xs leading-5 text-slate-300">{profile.caption}</div>
        <button
          onClick={() => setShowCorpusDrawer(true)}
          className="mt-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100 hover:bg-cyan-400/20"
        >
          {profile.corpus}
        </button>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {["Southeast Asia", "Singapore", "Thailand", "Philippines"].map((view) => (
            <button
              key={view}
              onClick={() => setSelected(view)}
              className={`rounded-md border px-3 py-2 text-xs transition ${selected === view ? "border-cyan-200 bg-cyan-300/20 text-white" : "border-cyan-300/20 text-cyan-100 hover:bg-cyan-400/10"}`}
            >
              {view === "Southeast Asia" ? "SEA view" : view}
            </button>
          ))}
        </div>
        <button
          onClick={resetMap}
          className="mt-3 flex items-center gap-2 rounded-md border border-cyan-300/25 px-3 py-1.5 text-xs text-cyan-100 hover:bg-cyan-400/10"
        >
          <RefreshCw size={12} /> Reset view
        </button>
      </div>

      <div className="absolute bottom-6 right-5 flex overflow-hidden rounded-lg border border-cyan-300/25 bg-[#031425]/90 text-cyan-100">
        <button onClick={() => zoomBy(-0.2)} className="grid h-10 w-12 place-items-center border-r border-cyan-300/15 hover:bg-cyan-400/10" title="Zoom out"><Minus size={18} /></button>
        <button onClick={() => zoomBy(0.2)} className="grid h-10 w-12 place-items-center border-r border-cyan-300/15 hover:bg-cyan-400/10" title="Zoom in"><Plus size={18} /></button>
        <button onClick={resetMap} className="grid h-10 w-12 place-items-center hover:bg-cyan-400/10" title="Reset view"><Crosshair size={18} /></button>
      </div>
    </div>
  );
}

function SingaporeInsetMap() {
  const pins = [
    { label: "NUS", x: 23, y: 56 },
    { label: "NTU", x: 13, y: 48 },
    { label: "SMU", x: 52, y: 45 },
    { label: "SIT", x: 67, y: 39 },
    { label: "SUSS", x: 35, y: 44 },
    { label: "SUTD", x: 78, y: 55 },
  ];

  return (
    <div className="rounded-xl border border-cyan-300/15 bg-[#061a30]/75 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold uppercase tracking-wide text-cyan-100">Singapore inset</div>
          <div className="mt-1 text-xs text-slate-400">Detailed island view for local evidence pins.</div>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">detail</span>
      </div>
      <div className="relative h-48 overflow-hidden rounded-lg border border-cyan-300/15 bg-[#031425]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.08)_1px,transparent_1px)] bg-[size:22px_22px]" />
        <svg viewBox="0 0 300 180" className="absolute inset-0 h-full w-full">
          <defs>
            <filter id="sgGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <path
            d="M42,88 C60,55 99,43 137,48 C172,53 211,50 245,74 C268,90 257,119 225,129 C188,141 148,133 113,136 C80,138 45,122 42,88 Z"
            fill="rgba(103,232,249,0.30)"
            stroke="#67e8f9"
            strokeWidth="3"
            filter="url(#sgGlow)"
          />
          <path d="M230,125 C245,116 266,119 276,132 C263,143 239,143 230,125 Z" fill="rgba(103,232,249,0.22)" stroke="#67e8f9" strokeWidth="2" />
          <path d="M60,130 C72,125 88,128 96,140 C83,148 66,143 60,130 Z" fill="rgba(103,232,249,0.18)" stroke="#67e8f9" strokeWidth="1.5" />
        </svg>
        {pins.map((pin) => (
          <div key={pin.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
            <div className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(103,232,249,1)]" />
            <div className="mt-1 rounded bg-[#031425]/90 px-1.5 py-0.5 text-[10px] font-bold text-cyan-100">{pin.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatPanel({ selected, comparativeStudies, selectedStudies }) {
  const isRegional = selected === "Southeast Asia";
  const visibleCorpus = isRegional ? comparativeStudies : selectedStudies;
  const topSources = visibleCorpus.slice(0, 3);
  const sourceCount = visibleCorpus.length;

  const question = isRegional
    ? "What can the current Atlas corpus tell us about higher education equity in Southeast Asia?"
    : `What does the current Atlas corpus suggest about ${selected}'s higher education landscape?`;

  const answerIntro = isRegional
    ? "The current corpus suggests that higher education equity in Southeast Asia cannot be understood through access alone. Across the sources currently loaded into the Atlas, the central questions are how states organise opportunity, how institutions differentiate students, and how mobility is shaped by policy, family resources, and regional context."
    : `The current ${selected} corpus suggests that higher education equity is shaped through the relationship between policy narratives, institutional pathways, and students' lived capacity to navigate opportunity. This view is a working synthesis, with each source record linked for verification.`;

  return (
    <Panel className="flex h-full flex-col p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cyan-100">Ask the Atlas <span className="rounded bg-blue-500/30 px-2 py-0.5 text-[10px]">BETA</span></div>
          <div className="mt-1 text-xs text-slate-400">Source-aware research assistant prototype.</div>
        </div>
        <button className="flex items-center gap-1 text-xs text-slate-400"><Trash2 size={13} /> Clear chat</button>
      </div>

      <div className="mt-4 ml-14 rounded-lg border border-cyan-300/30 bg-blue-500/15 p-4 text-sm leading-6 text-slate-100">
        {question}
        <div className="mt-1 text-right text-[10px] text-slate-400">Prototype response ✓</div>
      </div>

      <div className="relative mt-4 rounded-lg border border-cyan-300/20 bg-[#071b32] p-4 text-sm leading-6 text-slate-200">
        <div className="absolute -left-8 top-5 grid h-8 w-8 place-items-center rounded-full border border-cyan-300/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_18px_rgba(56,189,248,0.7)]"><Sparkles size={16} /></div>
        <p>{answerIntro}</p>

        <ul className="mt-3 list-disc space-y-2 pl-5">
          {topSources.map((paper, index) => (
            <li key={paper.title}>
              <a href={getPaperUrl(paper)} target="_blank" rel="noreferrer" className="text-cyan-200 hover:text-white">
                {paper.title}
              </a>{" "}
              is currently indexed under {(paper.tags || []).slice(0, 3).join(", ") || "higher education equity"} and can be used to build a more careful country or regional synthesis <a className="text-cyan-300">[{index + 1}]</a>.
            </li>
          ))}
        </ul>

        <p className="mt-3">
          This is a prototype response. In the live version, Ask the Atlas will retrieve from the selected corpus, write a short synthesis, and attach each claim to DOI/source records. Current visible corpus size: <span className="font-semibold text-cyan-100">{sourceCount} source{sourceCount === 1 ? "" : "s"}</span>.
        </p>

        <div className="mt-3 text-xs text-slate-300">Sources</div>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-cyan-300">
          {topSources.map((paper, index) => (
            <a key={paper.title} href={getPaperUrl(paper)} target="_blank" rel="noreferrer">[{index + 1}]</a>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {topSources[0] ? (
          <a href={getPaperUrl(topSources[0])} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-md border border-cyan-300/20 bg-[#061a30] px-3 py-2 text-xs text-slate-200 hover:bg-cyan-400/10">
            <ExternalLink size={12} /> Open first source
          </a>
        ) : null}
        <button className="flex items-center gap-1 rounded-md border border-cyan-300/20 bg-[#061a30] px-3 py-2 text-xs text-slate-200 hover:bg-cyan-400/10"><ExternalLink size={12} /> DOI</button>
        <button className="flex items-center gap-1 rounded-md border border-cyan-300/20 bg-[#061a30] px-3 py-2 text-xs text-slate-200 hover:bg-cyan-400/10"><ExternalLink size={12} /> Source</button>
        <button className="flex items-center gap-1 rounded-md border border-cyan-300/20 bg-[#061a30] px-3 py-2 text-xs text-slate-200 hover:bg-cyan-400/10"><ExternalLink size={12} /> Save</button>
      </div>

      <div className="mt-auto pt-4">
        <div className="flex items-center rounded-lg border border-cyan-300/25 bg-[#061a30] px-3 py-2">
          <input className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500" placeholder="Ask a question about SEA higher education..." />
          <Send size={20} className="text-cyan-200" />
        </div>
        <div className="mt-2 text-xs text-slate-500">AI responses can make mistakes. Verify important information.</div>
      </div>
    </Panel>
  );
}

export default function App() {
  const [selected, setSelected] = useState("Southeast Asia");
  const [showCorpusDrawer, setShowCorpusDrawer] = useState(false);
  const [selectedTag, setSelectedTag] = useState("All");
  const selectedStudies = useMemo(() => {
    const zoteroPapers = getPapersForView(selected);

    if (zoteroPapers.length > 0) {
      return zoteroPapers.map((paper) => ({
        title: paper.title,
        authors: paper.authors,
        meta: `${paper.year || "Year unknown"} · ${paper.sourceType || "Source"}`,
        tags: paper.themes || [],
        summary: paper.summary || "Summary under development.",
        doi: paper.doi,
        source: paper.source,
      }));
    }

    return getStudies(selected);
  }, [selected]);

  const comparativeStudies = useMemo(() => {
    const zoteroPapers = getPapersForView("Southeast Asia");
    if (zoteroPapers.length > 0) {
      return zoteroPapers.map((paper) => ({
        title: paper.title,
        authors: paper.authors,
        meta: `${paper.year || "Year unknown"} · ${paper.sourceType || "Source"}`,
        tags: paper.themes || [],
        summary: paper.summary || "Summary under development.",
        doi: paper.doi,
        source: paper.source,
      }));
    }
    return getStudies("Southeast Asia");
  }, []);

  const selectedThemes = useMemo(() => getThemeCounts(selectedStudies), [selectedStudies]);
  const selectedLabel = selected === "Southeast Asia" ? "Regional comparative view" : selected;

  const availableTags = useMemo(() => {
    const tagSet = new Set();
    selectedStudies.forEach((paper) => (paper.tags || []).forEach((tag) => tagSet.add(tag)));
    return ["All", ...Array.from(tagSet).sort()];
  }, [selectedStudies]);

  const filteredSelectedStudies = useMemo(() => {
    if (selectedTag === "All") return selectedStudies;
    return selectedStudies.filter((paper) => (paper.tags || []).includes(selectedTag));
  }, [selectedStudies, selectedTag]);

  useEffect(() => {
    setSelectedTag("All");
  }, [selected]);

  return (
    <div className="min-h-screen bg-[#020812] text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_24%_15%,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.16),transparent_26%),linear-gradient(rgba(14,165,233,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.04)_1px,transparent_1px)] bg-[size:100%_100%,100%_100%,48px_48px,48px_48px]" />

      <div className="relative mx-auto max-w-[1760px] p-3">
        <header className="mb-3 flex h-[92px] items-center justify-between rounded-xl border border-cyan-300/15 bg-[#020b17]/90 px-6 shadow-[0_0_36px_rgba(14,165,233,0.08)]">
          <div className="flex items-center gap-4">
            <div className="relative grid h-14 w-14 place-items-center rounded-full border border-cyan-300/30 text-cyan-200 shadow-[0_0_22px_rgba(56,189,248,0.35)]">
              <div className="absolute inset-2 rounded-full border border-cyan-300/20" />
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight text-white">SEA Higher Education<br />Equity Atlas</h1>
              <p className="mt-1 text-xs text-cyan-100/70">Evidence. Equity. Empowerment.</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
            {[
              [Home, "Home", true],
              [Globe2, "Southeast Asia", true],
              [LayoutGrid, "Themes"],
              [Database, "Database"],
              [ClipboardList, "Policy"],
              [Network, "Methods"],
              [Sparkles, "Ask the Atlas", true],
            ].map(([Icon, label, active]) => (
              <button key={label} onClick={() => label === "Southeast Asia" && setSelected("Southeast Asia")} className={`relative flex items-center gap-2 px-2 py-4 ${active ? "text-white" : "hover:text-white"}`}>
                <Icon size={19} className={active ? "text-cyan-200" : "text-slate-300"} />
                {label}
                {active && <span className="absolute bottom-0 left-0 h-px w-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,1)]" />}
              </button>
            ))}
          </nav>

          <div className="flex items-center overflow-hidden rounded-lg border border-cyan-300/20 bg-[#061a30] text-slate-200">
            <button className="grid h-12 w-12 place-items-center border-r border-cyan-300/10"><Search size={20} /></button>
            <button className="grid h-12 w-12 place-items-center border-r border-cyan-300/10"><Bookmark size={20} /></button>
            <button className="grid h-12 w-12 place-items-center"><UserCircle size={24} className="text-cyan-200" /></button>
          </div>
        </header>

        <main className="grid h-[calc(100vh-128px)] min-h-[780px] gap-3 lg:grid-cols-[240px_1fr_545px]">
          <aside className="space-y-3">
            <Panel className="h-full p-4">
              <div className="mb-5 flex items-center justify-between">
                <div className="text-sm font-bold uppercase tracking-wide text-cyan-100">Atlas Menu</div>
                <SlidersHorizontal size={16} className="text-cyan-200" />
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSelected("Southeast Asia");
                    setShowCorpusDrawer(true);
                  }}
                  className="w-full rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-3 py-3 text-left text-sm text-cyan-100 shadow-[0_0_18px_rgba(14,165,233,0.08)] transition hover:bg-cyan-400/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-400/10 text-cyan-200">
                      <Database size={17} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100">SEA Corpus Bank</div>
                      <div className="text-xs text-slate-400">Comparative sources and theory records</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelected("Singapore")}
                  className="w-full rounded-lg border border-cyan-300/15 bg-[#061a30] px-3 py-3 text-left text-sm text-cyan-100 hover:bg-cyan-400/10"
                >
                  Singapore
                </button>

                <button
                  onClick={() => setSelected("Thailand")}
                  className="w-full rounded-lg border border-cyan-300/15 bg-[#061a30] px-3 py-3 text-left text-sm text-cyan-100 hover:bg-cyan-400/10"
                >
                  Thailand
                </button>

                <button
                  onClick={() => setSelected("Philippines")}
                  className="w-full rounded-lg border border-cyan-300/15 bg-[#061a30] px-3 py-3 text-left text-sm text-cyan-100 hover:bg-cyan-400/10"
                >
                  Philippines
                </button>
              </div>

              <button onClick={() => {
                setSelected("Southeast Asia");
                setShowCorpusDrawer(false);
              }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-300/25 bg-[#061a30] px-3 py-3 text-sm text-cyan-100 hover:bg-cyan-400/10">
                <RotateCcw size={15} /> Reset View
              </button>

              <div className="mt-4 rounded-lg border border-amber-300/25 bg-amber-300/10 p-3 text-xs leading-5 text-amber-100">
                <div className="font-semibold">Prototype under construction</div>
                <div className="mt-1 text-amber-100/80">
                  This model is a working prototype. Source records, summaries, and corpus tags are being progressively checked against Zotero records, DOI links, and original publications.
                </div>
              </div>
            </Panel>
          </aside>

          <section className="grid gap-3">
            <Panel className="relative overflow-hidden p-3"><div className="absolute right-8 top-7 z-20 text-right">
                <div className="text-2xl font-bold tracking-wide text-cyan-100">SOUTHEAST ASIA</div>
                <div className="mt-1 text-lg text-white">Higher Education Systems</div>
                <div className="mt-2 text-sm text-slate-300">Explore. Compare. Understand.</div>
              </div>
              <HolographicGeoMap selected={selected} setSelected={setSelected} setShowCorpusDrawer={setShowCorpusDrawer} />
              <div className="absolute left-5 top-5 z-20 rounded-lg border border-cyan-300/20 bg-[#031425]/80 px-3 py-2 text-xs text-slate-300">
                Selected: <span className="font-semibold text-cyan-100">{selectedLabel}</span>
              </div></Panel>
          </section>

          <section className="grid gap-3">
            <ChatPanel selected={selected} comparativeStudies={comparativeStudies} selectedStudies={filteredSelectedStudies} />
          </section>
        </main>

        {(selected !== "Southeast Asia" || showCorpusDrawer) && (
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-3xl border-r border-cyan-300/25 bg-[#031425]/96 shadow-[0_0_65px_rgba(14,165,233,0.26)] backdrop-blur-xl">
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-5 border-b border-cyan-300/15 bg-[#061a30] px-6 py-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-cyan-200/80">
                    <BookOpen size={16} /> Country research corpus
                  </div>
                  <h2 className="mt-2 text-3xl font-bold text-white">{selected === "Southeast Asia" ? "Comparative Corpus" : selected}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    {selected === "Southeast Asia" ? "Regional papers, policy sources, and theory records currently loaded into the Atlas." : countryProfiles[selected]?.caption || "This country corpus is under construction."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCorpusDrawer(false);
                    setSelected("Southeast Asia");
                  }}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cyan-300/25 text-cyan-100 hover:bg-cyan-400/10"
                  aria-label="Close country research corpus"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-6 md:grid-cols-[0.62fr_1.38fr]">
                <div className="rounded-xl border border-cyan-300/15 bg-[#061a30]/75 p-5">
                  <div className="text-sm font-bold uppercase tracking-wide text-cyan-100">Selected view</div>
                  <div className="mt-4 rounded-xl border border-cyan-300/15 bg-[#031425] p-4">
                    <div className="text-2xl font-bold text-white">{selected === "Southeast Asia" ? "Southeast Asia" : selected}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-300">
                      This side drawer is the future country page: overview, policy timeline, source-linked papers, and Ask the Atlas prompts.
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2">
                    {["Southeast Asia", "Singapore", "Thailand", "Philippines"].map((view) => (
                      <button
                        key={view}
                        onClick={() => setSelected(view)}
                        className={`rounded-lg border px-4 py-3 text-left text-sm transition ${selected === view ? "border-cyan-200 bg-cyan-300/20 text-white" : "border-cyan-300/15 text-cyan-100 hover:bg-cyan-400/10"}`}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Corpus bank</h3>
                      <p className="mt-1 text-xs text-slate-400">Filter the selected source corpus by tag. Paper titles are linked to DOI/source pages.</p>
                    </div>
                    <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                      {filteredSelectedStudies.length} of {selectedStudies.length} records
                    </div>
                  </div>

                  <div className="rounded-xl border border-cyan-300/15 bg-[#061a30]/75 p-3">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wide text-cyan-100">Filter by tag</div>
                    <div className="flex max-h-24 flex-wrap gap-2 overflow-y-auto pr-1">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className={`rounded-full border px-3 py-1 text-xs transition ${selectedTag === tag ? "border-cyan-100 bg-cyan-300/25 text-white" : "border-cyan-300/15 bg-[#031425] text-cyan-100 hover:bg-cyan-400/10"}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredSelectedStudies.map((paper) => (
                    <div key={paper.title} className="rounded-xl border border-cyan-300/15 bg-[#061a30] p-5 hover:border-cyan-300/35">
                      <a
                        href={getPaperUrl(paper)}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-start gap-2 text-lg font-bold leading-6 text-white hover:text-cyan-200"
                      >
                        <span>{paper.title}</span>
                        <ExternalLink size={16} className="mt-1 opacity-70 group-hover:opacity-100" />
                      </a>
                      <div className="mt-2 text-sm text-slate-400">{paper.authors}</div>
                      <div className="mt-1 text-xs text-slate-500">{paper.meta}</div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{paper.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {paper.tags?.map((tag) => (
                          <span key={tag} className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">{tag}</span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {paper.doi ? (
                          <a
                            href={getPaperUrl(paper)}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md border border-cyan-300/25 px-3 py-2 text-xs text-cyan-100 hover:bg-cyan-400/10"
                          >
                            DOI
                          </a>
                        ) : null}
                        {paper.source ? (
                          <a
                            href={paper.source}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md border border-cyan-300/25 px-3 py-2 text-xs text-cyan-100 hover:bg-cyan-400/10"
                          >
                            Source
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
