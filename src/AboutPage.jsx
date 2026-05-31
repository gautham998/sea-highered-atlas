import {
  ArrowLeft,
  BookOpen,
  Compass,
  Database,
  Eye,
  GraduationCap,
  Map,
  ShieldCheck,
  Target,
} from "lucide-react";

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#020812] text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(14,165,233,0.16),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(37,99,235,0.13),transparent_28%),linear-gradient(rgba(14,165,233,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.035)_1px,transparent_1px)] bg-[size:100%_100%,100%_100%,48px_48px,48px_48px]" />
      <div className="relative mx-auto max-w-6xl px-5 py-7">{children}</div>
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

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-xl border border-cyan-300/15 bg-[#061a30] p-5">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-100">
        <Icon size={19} />
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}

export default function AboutPage({ onBack }) {
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
              About this Atlas
            </div>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              Southeast Asia Higher Education Atlas
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              A working map of sources, policies, institutions, and research
              questions on higher education in Southeast Asia.
            </p>

            <div className="mt-7 rounded-xl border border-cyan-300/15 bg-[#061a30] p-5">
              <div className="text-sm font-bold uppercase tracking-wide text-cyan-100">
                Why I created this
              </div>

              <p className="mt-3 leading-7 text-slate-200">
                I created this Atlas because I needed a clearer way to organise
                the scattered literature, policy histories, institutional
                timelines, and equity debates that shape higher education in
                Singapore and Southeast Asia. Rather than keeping these
                materials only in private notes or Zotero folders, I wanted a
                visual space where I could begin to see patterns,
                contradictions, and gaps in the field.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-300/15 bg-[#061a30] p-5">
            <div className="text-sm font-bold uppercase tracking-wide text-cyan-100">
              Current status
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              This is an early prototype. It is not an official policy
              database, a comprehensive source archive, or a completed scholarly
              argument. Some pages are more developed than others, and source
              summaries, tags, and interpretations will continue to be revised
              as the corpus grows.
            </p>

            <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
              Historical claims should be checked against their cited sources.
              Interpretive claims are treated as working research questions
              unless directly supported by evidence.
            </div>
          </div>
        </div>
      </Panel>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <InfoCard
          icon={Map}
          title="What it does"
          text="The Atlas helps organise sources, policy timelines, institutional histories, and emerging themes across Southeast Asian higher education."
        />

        <InfoCard
          icon={Database}
          title="What the corpus does"
          text="The source bank gathers articles, reports, policy sources, and theoretical texts so they can be browsed by country, theme, and relevance."
        />

        <InfoCard
          icon={Compass}
          title="What it helps me see"
          text="It helps me notice patterns across access, mobility, belonging, policy change, institutional differentiation, and higher education reform."
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Panel className="p-6">
          <SectionTitle
            eyebrow="Scope"
            title="What this platform currently covers"
            subtitle="The Atlas is being developed in stages. Singapore is the first more detailed policy page."
            icon={Eye}
          />

          <div className="space-y-3 text-sm leading-7 text-slate-300">
            <p>
              The current version focuses mainly on Singapore’s higher
              education system, especially institutional timelines, policy
              narratives, meritocracy, access, resources, and lifelong learning.
            </p>

            <p>
              The wider Southeast Asia view is currently a literature and
              policy resource space. Other country pages will be added gradually
              as the source base becomes stronger.
            </p>

            <p>
              The platform is meant to support my own research process first. It
              may later become useful as a public-facing resource for students,
              researchers, and practitioners interested in higher education
              equity in the region.
            </p>
          </div>
        </Panel>

        <Panel className="p-6">
          <SectionTitle
            eyebrow="Limits"
            title="What this platform does not claim"
            subtitle="The Atlas is intentionally cautious because the project is still developing."
            icon={ShieldCheck}
          />

          <div className="space-y-3">
            {[
              "It is not a complete database of all higher education research in Southeast Asia.",
              "It is not a systematic review, although it may help prepare one.",
              "It is not an official account of government policy or institutional history.",
              "It does not yet provide full-text analysis of every source.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-cyan-300/15 bg-[#061a30] px-4 py-3 text-sm leading-6 text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-5 p-6">
        <SectionTitle
          eyebrow="Research direction"
          title="The questions this Atlas is helping me develop"
          subtitle="The platform is a way to organise a research agenda, rather than a claim that the answers are already settled."
          icon={Target}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={GraduationCap}
            title="Access beyond admission"
            text="I am interested in what happens after students enter higher education: who gains confidence, networks, institutional knowledge, and access to high-value experiences."
          />

          <InfoCard
            icon={BookOpen}
            title="Mobility as process"
            text="Rather than treating mobility only as an outcome, I want to understand how mobility is built through pathways, resources, belonging, and institutional recognition."
          />

          <InfoCard
            icon={Compass}
            title="Belonging and possibility"
            text="The Atlas helps me ask how students make sense of university spaces, imagine their futures, and navigate systems that may be unfamiliar to them."
          />
        </div>

        <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-7 text-amber-50">
          The larger research question is how students experience higher
          education systems as lived pathways of access, mobility, belonging,
          and institutional knowledge.
        </div>
      </Panel>

      <Panel className="mt-5 p-6">
        <SectionTitle
          eyebrow="Source approach"
          title="How I am handling sources"
          subtitle="The source base will become stronger as each record is checked, summarised, tagged, and linked."
          icon={Database}
        />

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Bibliographic records",
              text:
                "Each source should eventually include title, author, year, country or region, source type, DOI or source link, and APA citation.",
            },
            {
              title: "Short summaries",
              text:
                "Summaries are working notes. They should be checked against the full source rather than inferred only from titles or abstracts.",
            },
            {
              title: "Tags and themes",
              text:
                "Tags are used to organise sources by country, topic, policy issue, method, and theoretical relevance.",
            },
            {
              title: "Interpretation",
              text:
                "Interpretive claims should be written carefully and treated as research questions unless they are directly supported by cited evidence.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-cyan-300/15 bg-[#061a30] p-5"
            >
              <h3 className="font-bold text-cyan-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </Shell>
  );
}