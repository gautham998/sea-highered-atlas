import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  LineChart,
  Network,
  Search,
  Target,
} from "lucide-react";
import singaporePolicy from "./data/singaporePolicy";

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#020812] text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_24%_15%,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.16),transparent_26%),linear-gradient(rgba(14,165,233,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.04)_1px,transparent_1px)] bg-[size:100%_100%,100%_100%,48px_48px,48px_48px]" />
      <div className="relative mx-auto max-w-7xl px-5 py-7">{children}</div>
    </div>
  );
}

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-cyan-300/20 bg-[#031425]/88 shadow-[0_0_36px_rgba(14,165,233,0.08)] backdrop-blur ${className}`}
    >
      {children}
    </section>
  );
}

function SourcePill({ source }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      title={source.title}
      className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan-400/20"
    >
      <ExternalLink size={13} />
      {source.label}
    </a>
  );
}

function SectionTitle({ eyebrow, title, subtitle, icon: Icon }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-200/90">
        {Icon ? <Icon size={16} /> : null}
        {eyebrow}
      </div>
      <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
      {subtitle ? (
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function ResearchQuestions() {
  return (
    <Panel className="p-6">
      <SectionTitle
        eyebrow="Research questions"
        title="What this page is trying to understand"
        subtitle="These questions turn the page from a timeline into a research agenda for Singapore higher education."
        icon={HelpCircle}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {singaporePolicy.researchQuestions.map((item, index) => (
          <div
            key={item.question}
            className="rounded-xl border border-cyan-300/15 bg-[#061a30] p-5"
          >
            <div className="mb-3 grid h-8 w-8 place-items-center rounded-full border border-cyan-300/25 bg-cyan-400/10 text-sm font-bold text-cyan-100">
              {index + 1}
            </div>
            <h3 className="text-base font-bold leading-6 text-white">
              {item.question}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {item.focus}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function NarrativeCards() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {singaporePolicy.narratives.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-cyan-300/20 bg-[#061a30] p-5"
        >
          <h3 className="text-lg font-bold text-cyan-100">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

function InteractiveTimeline() {
  const categories = [
    "All",
    "Origins",
    "National consolidation",
    "Differentiation",
    "Access and pathways",
    "Broad-based education",
    "Lifelong learning",
    "4IR and innovation",
    "Restructuring",
  ];

  const [category, setCategory] = useState("All");
  const filteredItems = useMemo(() => {
    if (category === "All") return singaporePolicy.timeline;
    return singaporePolicy.timeline.filter((item) => item.category === category);
  }, [category]);

  const [activeIndex, setActiveIndex] = useState(0);
  const active = filteredItems[Math.min(activeIndex, filteredItems.length - 1)];

  return (
    <Panel className="p-6">
      <SectionTitle
        eyebrow="Interactive timeline"
        title="Universities, colleges, state priorities, and institutional purposes"
        subtitle="Click each milestone to see how Singapore’s higher education system expanded, differentiated, and became tied to changing state narratives."
        icon={GraduationCap}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => {
              setCategory(item);
              setActiveIndex(0);
            }}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              category === item
                ? "border-cyan-100 bg-cyan-300/25 text-white shadow-[0_0_14px_rgba(34,211,238,0.35)]"
                : "border-cyan-300/20 bg-[#031425] text-cyan-100 hover:bg-cyan-400/10"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto pb-3">
        <div className="relative flex w-max min-w-full items-start gap-4 px-8">
          <div className="absolute left-8 right-8 top-8 h-px bg-cyan-300/30" />

          {filteredItems.map((item, index) => (
            <button
              key={item.year + item.title}
              onClick={() => setActiveIndex(index)}
              className="relative z-10 flex min-w-[145px] flex-col items-center gap-2 text-center"
            >
              <div
                className={`grid h-16 w-16 place-items-center rounded-full border text-sm font-bold transition ${
                  activeIndex === index
                    ? "border-cyan-100 bg-cyan-300/25 text-white shadow-[0_0_22px_rgba(34,211,238,0.45)]"
                    : "border-cyan-300/30 bg-[#031425] text-cyan-200 hover:bg-cyan-400/10"
                }`}
              >
                {item.year}
              </div>
              <div className="max-w-[135px] text-xs leading-4 text-slate-300">
                {item.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {active ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-cyan-300/20 bg-[#061a30] p-5">
            <div className="text-3xl font-bold text-cyan-200">{active.year}</div>
            <h3 className="mt-3 text-2xl font-bold text-white">
              {active.title}
            </h3>
            <div className="mt-2 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
              {active.type}
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {active.text}
            </p>
          </div>

          <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-amber-100">
              Critical question
            </div>
            <p className="mt-3 text-lg font-semibold leading-7 text-amber-50">
              {active.question}
            </p>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

function AccessExpansionChart() {
  const data = singaporePolicy.accessData;
  const max = Math.max(...data.map((d) => d.total));

  return (
    <Panel className="p-6">
      <SectionTitle
        eyebrow="Data visualisation"
        title="Expansion of university and polytechnic access, 1965-2004"
        subtitle="The chart shows the entry ratio as a percentage of the Primary One cohort. It makes expansion visible, but it should not be read as proof that inequality has disappeared."
        icon={LineChart}
      />

      <div className="overflow-x-auto rounded-xl border border-cyan-300/15 bg-[#061a30] p-5">
        <div className="flex h-72 min-w-[820px] items-end gap-4">
          {data.map((d) => (
            <div key={d.year} className="flex min-w-[72px] flex-col items-center">
              <div className="flex h-48 items-end gap-1">
                <div
                  className="w-5 rounded-t bg-cyan-300/80"
                  style={{ height: `${(d.university / max) * 100}%` }}
                  title={`University: ${d.university}%`}
                />
                <div
                  className="w-5 rounded-t bg-emerald-300/70"
                  style={{ height: `${(d.polytechnic / max) * 100}%` }}
                  title={`Polytechnic: ${d.polytechnic}%`}
                />
              </div>
              <div className="mt-2 text-xs font-semibold text-slate-300">
                {d.year}
              </div>
              <div className="text-[11px] text-slate-500">Total {d.total}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-cyan-100">
          University entry ratio
        </span>
        <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-emerald-100">
          Polytechnic entry ratio
        </span>
      </div>

      <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
        <strong>Interpretive note:</strong> The expansion of access changes the
        equity question. It is no longer enough to ask who enters higher
        education. We also need to ask who gains access to belonging, networks,
        institutional knowledge, prestigious pathways, internships, postgraduate
        options, and labour-market conversion.
      </div>
    </Panel>
  );
}

function AttainmentChart() {
  return (
    <Panel className="p-6">
      <SectionTitle
        eyebrow="Credential society"
        title="Rising educational attainment and the shifting meaning of access"
        subtitle="Gleason reports sharp increases in post-secondary attainment and university graduation between 2006 and 2016. This strengthens the need to study inequality after access."
        icon={LineChart}
      />

      <div className="space-y-5">
        {singaporePolicy.attainmentData.map((item) => {
          const max = 60;
          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="font-semibold text-white">{item.label}</div>
                <div className="text-sm text-cyan-100">
                  {item.fromValue ? `${item.fromValue}%` : ""}{" "}
                  {item.fromValue ? "→" : ""} {item.toValue}%
                </div>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-[#061a30]">
                <div
                  className="h-full rounded-full bg-cyan-300/80 shadow-[0_0_14px_rgba(34,211,238,0.55)]"
                  style={{ width: `${Math.min(100, (item.toValue / max) * 100)}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {item.fromYear === item.toYear
                  ? item.toYear
                  : `${item.fromYear} to ${item.toYear}`}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function InstitutionMatrix() {
  return (
    <Panel className="p-6">
      <SectionTitle
        eyebrow="Institutional purpose matrix"
        title="What different institutions are built to do"
        subtitle="This matrix shows why Singapore’s higher education system should be read as differentiated. The equity issue is how different pathways carry different forms of prestige, resources, and mobility."
        icon={Network}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-separate border-spacing-y-2 text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-cyan-200">
            <tr>
              <th className="px-4 py-2">Institution</th>
              <th className="px-4 py-2">Historical purpose</th>
              <th className="px-4 py-2">State narrative</th>
              <th className="px-4 py-2">Equity question</th>
            </tr>
          </thead>
          <tbody>
            {singaporePolicy.institutionMatrix.map((row) => (
              <tr key={row.institution} className="bg-[#061a30]">
                <td className="rounded-l-xl border-y border-l border-cyan-300/15 px-4 py-4 font-bold text-white">
                  {row.institution}
                </td>
                <td className="border-y border-cyan-300/15 px-4 py-4 text-slate-300">
                  {row.purpose}
                </td>
                <td className="border-y border-cyan-300/15 px-4 py-4 text-slate-300">
                  {row.narrative}
                </td>
                <td className="rounded-r-xl border-y border-r border-cyan-300/15 px-4 py-4 text-amber-100">
                  {row.equityQuestion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function ThemesAndGaps() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <Panel className="p-6">
        <SectionTitle
          eyebrow="Emerging themes"
          title="What the Singapore literature keeps returning to"
          subtitle="These themes summarise what the current source base helps us see."
          icon={Search}
        />
        <div className="space-y-3">
          {singaporePolicy.themes.map((theme) => (
            <div
              key={theme.title}
              className="rounded-xl border border-cyan-300/15 bg-[#061a30] p-4"
            >
              <h3 className="font-bold text-cyan-100">{theme.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {theme.text}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="p-6">
        <SectionTitle
          eyebrow="Gap map"
          title="What remains to be researched"
          subtitle="This section makes the case for why your research is needed."
          icon={Target}
        />
        <div className="grid gap-3 md:grid-cols-2">
          {singaporePolicy.gapMap.map((block) => (
            <div
              key={block.title}
              className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-4"
            >
              <h3 className="font-bold text-amber-100">{block.title}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-amber-50/90">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-cyan-300/15 bg-[#061a30] p-5">
          <div className="text-xs font-bold uppercase tracking-wide text-cyan-100">
            Research contribution
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            {singaporePolicy.contribution}
          </p>
        </div>
      </Panel>
    </div>
  );
}

function References() {
  return (
    <Panel className="p-6">
      <SectionTitle
        eyebrow="APA references and source links"
        title="Sources used to build this page"
        subtitle="These are the current anchor sources. More policy documents, datasets, and student experience studies can be added as the Atlas grows."
        icon={BookOpen}
      />

      <div className="space-y-3">
        {singaporePolicy.sourceLinks.map((source) => (
          <div
            key={source.label}
            className="rounded-xl border border-cyan-300/15 bg-[#061a30] p-4"
          >
            <p className="text-sm leading-6 text-slate-200">{source.apa}</p>
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-cyan-200 hover:text-white"
            >
              <ExternalLink size={13} />
              Open source
            </a>
          </div>
        ))}
      </div>
    </Panel>
  );
}
function RecommendedReadings() {
  return (
    <div className="rounded-2xl border border-cyan-300/15 bg-[#061a30] p-5">
      <div className="text-sm font-bold uppercase tracking-wide text-cyan-100">
        Recommended readings
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        Start here for the scholarly and statistical foundations of this page.
The readings foreground university restructuring, quality assurance,
meritocracy, class, manpower planning, lifelong learning, and academic
mobility. The data sources support future visualisations on attainment,
participation, enrolment, and institutional pathways.
      </p>

      <div className="mt-5 max-h-[420px] space-y-3 overflow-y-auto pr-2">
        {singaporePolicy.recommendedReadings.map((source) => (
          <a
            key={source.title}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl border border-cyan-300/15 bg-[#031425] p-4 transition hover:border-cyan-200/50 hover:bg-cyan-400/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-cyan-200">
                  {source.label}
                </div>
                <h3 className="mt-1 text-sm font-bold leading-5 text-white">
                  {source.title}
                </h3>
                <div className="mt-1 text-xs text-slate-400">
                  {source.author}, {source.year}
                </div>
              </div>
              <ExternalLink size={15} className="mt-1 shrink-0 text-cyan-200" />
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-300">
              {source.note}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
function MiniBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="mt-4 space-y-3">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-300">{item.label}</span>
            <span className="font-semibold text-cyan-100">
              {item.value}
              {item.value > 2 ? "%" : ""}
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-[#020812]">
            <div
              className="h-full rounded-full bg-cyan-300/80 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
              style={{ width: `${Math.max(8, (item.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DataVisualisationDashboard() {
  return (
    <Panel className="p-6">
      <SectionTitle
        eyebrow="Data visualisation"
        title="What the data can show, and what it cannot"
        subtitle="This section connects available higher education indicators to the deeper research questions on access, mobility, belonging, resources, and institutional knowledge."
        icon={LineChart}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {singaporePolicy.dataVisuals.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-cyan-300/15 bg-[#061a30] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                  {item.title}
                </div>
                <h3 className="mt-2 text-xl font-bold text-white">
                  {item.headline}
                </h3>
              </div>

              <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                {item.visualType}
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              {item.description}
            </p>

            <MiniBarChart data={item.data} />

            <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-amber-100">
                Critical question
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-amber-50">
                {item.question}
              </p>
            </div>

            <div className="mt-3 text-xs leading-5 text-slate-500">
              Source direction: {item.source}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5">
        <div className="text-sm font-bold uppercase tracking-wide text-amber-100">
          What these indicators cannot capture
        </div>

        <p className="mt-3 max-w-4xl text-sm leading-6 text-amber-50/90">
          The available data can show expansion, attainment, enrolment, and
          employment outcomes. It cannot fully show how students experience
          university, how they learn the hidden rules of the institution, or how
          they convert access into belonging, confidence, networks, and mobility.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {singaporePolicy.invisibleIndicators.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-amber-300/20 bg-[#031425] p-4"
            >
              <h3 className="font-bold text-amber-100">{item.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
export default function SingaporePolicyPage({ onBack }) {
  return (
    <Shell>
      <button
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 rounded-lg border border-cyan-300/25 bg-[#061a30] px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
      >
        <ArrowLeft size={16} />
        Back to Atlas
      </button>

      <Panel className="overflow-hidden p-8">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">
              Singapore policy page
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              {singaporePolicy.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              {singaporePolicy.subtitle}
            </p>

            <div className="mt-7 rounded-xl border border-cyan-300/15 bg-[#061a30] p-5">
              <div className="text-sm font-bold uppercase tracking-wide text-cyan-100">
                Working thesis
              </div>
              <p className="mt-3 leading-7 text-slate-200">
                {singaporePolicy.thesis}
              </p>
            </div>
          </div>

          <RecommendedReadings />
        </div>
      </Panel>

      <div className="mt-5 space-y-5">
        <ResearchQuestions />
        <NarrativeCards />
        <InteractiveTimeline />
        <DataVisualisationDashboard />
        <InstitutionMatrix />
        <ThemesAndGaps />
        <References />
      </div>
    </Shell>
  );
}