import { useState, useCallback } from "react";

// ── Dimension definitions ──────────────────────────────────────────────────────

const SLIDER_DIMS = [
  {
    key: "problemClarity",
    label: "Problem Clarity",
    question: "How clearly can you define the problem you're solving?",
    tip: "Write a one-sentence problem statement that a 10-year-old can understand. If you struggle, your clarity score is low.",
  },
  {
    key: "solutionUniqueness",
    label: "Solution Uniqueness",
    question: "How unique is your solution vs existing alternatives?",
    tip: "Document your top 3 competitors and articulate exactly why your approach is differentiated and hard to replicate.",
  },
  {
    key: "revenueModel",
    label: "Revenue Model",
    question: "How clear is your revenue model?",
    tip: "Define your primary monetization mechanism, pricing tier, and a realistic path to your first $10k MRR.",
  },
  {
    key: "competitiveAdvantage",
    label: "Competitive Advantage",
    question: "Do you have a defensible moat?",
    tip: "Identify one structural advantage — network effects, proprietary data, switching costs, or unique IP — and build your strategy around it.",
  },
  {
    key: "executionPlan",
    label: "Execution Plan",
    question: "How detailed is your 12-month plan?",
    tip: "Break your roadmap into quarterly milestones with owners and success metrics. Investors want to see you can execute, not just dream.",
  },
  {
    key: "scalability",
    label: "Scalability",
    question: "Can this scale without linear cost increase?",
    tip: "Model your unit economics at 10x your current scale. If costs grow proportionally to revenue, address your architecture or business model first.",
  },
];

const DROPDOWN_DIMS = [
  {
    key: "marketSize",
    label: "Market Size",
    question: "What is your estimated Total Addressable Market?",
    options: [
      { label: "Less than $1M", value: 2 },
      { label: "$1M – $10M", value: 4 },
      { label: "$10M – $100M", value: 6 },
      { label: "$100M – $1B", value: 8 },
      { label: "Greater than $1B", value: 10 },
    ],
    tip: "Use a bottom-up TAM calculation: (target customers) × (average contract value). Top-down estimates rarely convince sophisticated investors.",
  },
  {
    key: "teamStrength",
    label: "Team Strength",
    question: "Does your team have domain expertise?",
    options: [
      { label: "No team yet", value: 2 },
      { label: "Solo founder", value: 4 },
      { label: "2 co-founders", value: 6 },
      { label: "Full team, no domain experience", value: 7 },
      { label: "Full team with domain expertise", value: 10 },
    ],
    tip: "Build toward a founding team that covers product, tech, and go-to-market. Advisors with relevant exits can meaningfully boost investor confidence.",
  },
  {
    key: "traction",
    label: "Traction",
    question: "Do you have any traction or validation?",
    options: [
      { label: "No traction", value: 2 },
      { label: "Concept only", value: 3 },
      { label: "MVP built", value: 5 },
      { label: "Beta users", value: 7 },
      { label: "Paying customers", value: 10 },
    ],
    tip: "Even 10 paying customers transforms your pitch. Prioritize getting revenue over perfecting the product — paying users are your strongest signal.",
  },
  {
    key: "fundingReadiness",
    label: "Funding Readiness",
    question: "Are your financials and documents ready for investors?",
    options: [
      { label: "Not started", value: 2 },
      { label: "Draft budget only", value: 4 },
      { label: "Full financial model", value: 7 },
      { label: "Audited financials & data room", value: 10 },
    ],
    tip: "Prepare a cap table, 3-year financial model, and one-pager before your first investor meeting. Disorganized documents kill momentum.",
  },
];

// Merge into one ordered list for display
const ALL_DIMS = [
  SLIDER_DIMS[0],                 // Problem Clarity
  DROPDOWN_DIMS[0],               // Market Size
  SLIDER_DIMS[1],                 // Solution Uniqueness
  DROPDOWN_DIMS[1],               // Team Strength
  SLIDER_DIMS[2],                 // Revenue Model
  DROPDOWN_DIMS[2],               // Traction
  SLIDER_DIMS[3],                 // Competitive Advantage
  SLIDER_DIMS[4],                 // Execution Plan
  DROPDOWN_DIMS[3],               // Funding Readiness
  SLIDER_DIMS[5],                 // Scalability
];

// ── Scoring helpers ────────────────────────────────────────────────────────────

const TIER_CONFIG = [
  {
    max: 40,
    label: "Not Ready",
    sub: "Need significant work before approaching investors",
    color: "text-red-600",
    ring: "ring-red-400",
    bg: "bg-red-50",
    bar: "bg-red-400",
  },
  {
    max: 60,
    label: "Early Stage",
    sub: "Good foundation, key gaps to address",
    color: "text-orange-600",
    ring: "ring-orange-400",
    bg: "bg-orange-50",
    bar: "bg-orange-400",
  },
  {
    max: 75,
    label: "Promising",
    sub: "Strong idea, polish execution plan",
    color: "text-yellow-600",
    ring: "ring-yellow-400",
    bg: "bg-yellow-50",
    bar: "bg-yellow-400",
  },
  {
    max: 89,
    label: "Investment Ready",
    sub: "High quality pitch, approach investors",
    color: "text-green-600",
    ring: "ring-green-500",
    bg: "bg-green-50",
    bar: "bg-green-500",
  },
  {
    max: 100,
    label: "Exceptional",
    sub: "Top-tier pitch, prioritize immediately",
    color: "text-purple-600",
    ring: "ring-purple-500",
    bg: "bg-purple-50",
    bar: "bg-purple-500",
  },
];

function getTier(total) {
  return TIER_CONFIG.find((t) => total <= t.max) || TIER_CONFIG[TIER_CONFIG.length - 1];
}

// ── Default state ──────────────────────────────────────────────────────────────

function buildDefaultScores() {
  const scores = {};
  SLIDER_DIMS.forEach((d) => (scores[d.key] = 5));
  DROPDOWN_DIMS.forEach((d) => (scores[d.key] = null));
  return scores;
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function IdeaAudit() {
  const [scores, setScores] = useState(buildDefaultScores);
  const [startupName, setStartupName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateScore = (key, val) => setScores((prev) => ({ ...prev, [key]: val }));

  // Calculate totals
  const dropdownsFilled = DROPDOWN_DIMS.every((d) => scores[d.key] !== null);
  const sliderTotal = SLIDER_DIMS.reduce((s, d) => s + (scores[d.key] || 0), 0);
  const dropdownTotal = DROPDOWN_DIMS.reduce((s, d) => s + (scores[d.key] || 0), 0);
  const total = sliderTotal + dropdownTotal;
  const tier = getTier(total);

  // Lowest 3 scores for feedback tips
  const scoredDims = ALL_DIMS.map((d) => ({ ...d, score: scores[d.key] || 0 }));
  const lowest3 = [...scoredDims].sort((a, b) => a.score - b.score).slice(0, 3);

  // Share text generation
  const generateSummary = useCallback(() => {
    const name = startupName.trim() || "My Startup";
    const lines = [
      `=== LaunchingLaps Idea Audit — ${name} ===`,
      `Overall Score: ${total}/100 — ${tier.label}`,
      `${tier.sub}`,
      "",
      "--- Dimension Scores ---",
      ...scoredDims.map((d) => `  ${d.label.padEnd(24)} ${d.score}/10`),
      "",
      "--- Areas to Improve ---",
      ...lowest3.map((d) => `  ${d.label}: ${d.tip}`),
      "",
      total >= 76 ? "LaunchingLaps Verified — Investment Ready" : "",
      "",
      "Generated on LaunchingLaps.com",
    ].filter((l) => l !== undefined);
    return lines.join("\n");
  }, [total, tier, scoredDims, lowest3, startupName]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generateSummary()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [generateSummary]);

  const canSubmit = dropdownsFilled;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div>
        <h1 className="section-title">Idea Audit Score</h1>
        <p className="text-gray-500 text-sm mt-1">
          Score your startup across 10 investor-grade dimensions and get a personalized action plan.
        </p>
      </div>

      {/* ── Startup Name ────────────────────────────────────────── */}
      <div className="card">
        <label className="label">Startup / Idea Name (optional)</label>
        <input
          type="text"
          className="input w-full max-w-sm"
          placeholder="e.g. Acme AI"
          value={startupName}
          onChange={(e) => setStartupName(e.target.value)}
        />
      </div>

      {/* ── Questions ───────────────────────────────────────────── */}
      <div className="space-y-5">
        {ALL_DIMS.map((dim, idx) => {
          const isSlider = SLIDER_DIMS.some((d) => d.key === dim.key);
          const val = scores[dim.key];

          return (
            <div key={dim.key} className="card">
              <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-brand-800 font-semibold text-sm">{dim.label}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{dim.question}</p>
                </div>
                <span className="flex-shrink-0 text-lg font-bold text-brand-800 min-w-[3rem] text-right">
                  {val !== null ? `${val}/10` : "—"}
                </span>
              </div>

              {isSlider ? (
                <div className="space-y-2">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={val || 5}
                    onChange={(e) => updateScore(dim.key, Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 select-none">
                    <span>1 — Not at all</span>
                    <span>10 — Crystal clear</span>
                  </div>
                </div>
              ) : (
                <select
                  className="input w-full"
                  value={val !== null ? val : ""}
                  onChange={(e) =>
                    updateScore(dim.key, e.target.value === "" ? null : Number(e.target.value))
                  }
                >
                  <option value="">Select an option...</option>
                  {dim.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Submit Button ────────────────────────────────────────── */}
      {!submitted && (
        <div className="flex flex-col items-center gap-3">
          {!canSubmit && (
            <p className="text-sm text-amber-600">
              Please select an option for all dropdown questions to calculate your score.
            </p>
          )}
          <button
            className="btn-primary px-10 py-3 text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!canSubmit}
            onClick={() => setSubmitted(true)}
          >
            Calculate My Score
          </button>
        </div>
      )}

      {/* ── Results ─────────────────────────────────────────────── */}
      {submitted && (
        <div className="space-y-8">

          {/* Score Circle + Tier */}
          <div className={`card flex flex-col sm:flex-row items-center gap-8 ${tier.bg}`}>
            <div
              className={`flex-shrink-0 w-36 h-36 rounded-full ring-8 ${tier.ring} flex flex-col items-center justify-center shadow-inner`}
              style={{ background: "white" }}
            >
              <span className={`text-5xl font-extrabold ${tier.color}`}>{total}</span>
              <span className="text-gray-400 text-sm font-medium">out of 100</span>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">
                Your Score
              </p>
              <h2 className={`text-3xl font-bold ${tier.color}`}>{tier.label}</h2>
              <p className="text-gray-600 text-sm mt-1">{tier.sub}</p>

              {/* LaunchingLaps Verified Badge */}
              {total >= 76 && (
                <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-gold-100 border border-gold-400 text-gold-700 font-semibold text-sm shadow-sm">
                  <svg className="w-4 h-4 text-gold-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  LaunchingLaps Verified — Investment Ready
                </div>
              )}
            </div>
          </div>

          {/* Dimension Progress Bars */}
          <div className="card">
            <h2 className="text-brand-800 font-semibold text-base mb-5">Score Breakdown</h2>
            <div className="space-y-4">
              {scoredDims.map((d) => {
                const pct = (d.score / 10) * 100;
                const barColor =
                  d.score <= 3
                    ? "bg-red-400"
                    : d.score <= 5
                    ? "bg-orange-400"
                    : d.score <= 7
                    ? "bg-yellow-400"
                    : d.score <= 9
                    ? "bg-green-500"
                    : "bg-purple-500";

                return (
                  <div key={d.key}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm text-gray-700 font-medium">{d.label}</span>
                      <span className="text-sm font-semibold text-brand-800">{d.score}/10</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-700 ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personalized Tips for Bottom 3 */}
          <div className="card">
            <h2 className="text-brand-800 font-semibold text-base mb-1">
              Your Top 3 Areas to Improve
            </h2>
            <p className="text-gray-500 text-xs mb-5">
              Focused on your lowest-scoring dimensions for maximum impact.
            </p>
            <div className="space-y-4">
              {lowest3.map((d, i) => (
                <div
                  key={d.key}
                  className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-800 text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-brand-800 font-semibold text-sm">{d.label}</p>
                      <span className="text-xs text-gray-400 font-medium">{d.score}/10</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{d.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share with Investors */}
          <div className="card bg-brand-50 border-brand-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-brand-800 font-bold text-base">Share with Investors</h2>
                <p className="text-gray-500 text-xs mt-0.5">
                  Copy a plain-text summary you can paste into emails or pitch docs.
                </p>
              </div>
              <button onClick={handleCopy} className="btn-gold flex items-center gap-2 self-start sm:self-auto">
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy Summary
                  </>
                )}
              </button>
            </div>

            {/* Preview */}
            <pre className="bg-white border border-gray-200 rounded-xl p-4 text-xs text-gray-700 font-mono whitespace-pre-wrap leading-relaxed overflow-auto max-h-64">
              {generateSummary()}
            </pre>
          </div>

          {/* Re-audit Button */}
          <div className="flex justify-center">
            <button
              className="btn-primary"
              onClick={() => {
                setScores(buildDefaultScores());
                setStartupName("");
                setSubmitted(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Start a New Audit
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
