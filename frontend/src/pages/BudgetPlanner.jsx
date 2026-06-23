import { useState, useCallback } from "react";

const DEFAULT_TEAM = [{ id: 1, role: "", salary: "" }];
const DEFAULT_OPS = { rent: "", utilities: "", software: "", hardware: "", misc: "" };
const DEFAULT_MARKETING = { ads: "", content: "", seo: "", events: "" };
const DEFAULT_TECH = { hosting: "", apis: "", devtools: "" };

function num(val) {
  const n = parseFloat(val);
  return isNaN(n) || n < 0 ? 0 : n;
}

function fmt(n) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

let nextId = 2;

export default function BudgetPlanner() {
  const [fundingGoal, setFundingGoal] = useState("");
  const [team, setTeam] = useState(DEFAULT_TEAM);
  const [ops, setOps] = useState(DEFAULT_OPS);
  const [marketing, setMarketing] = useState(DEFAULT_MARKETING);
  const [tech, setTech] = useState(DEFAULT_TECH);
  const [copied, setCopied] = useState(false);

  // ── Calculations ──────────────────────────────────────────────
  const teamTotal = team.reduce((s, r) => s + num(r.salary), 0);
  const opsTotal = Object.values(ops).reduce((s, v) => s + num(v), 0);
  const mktTotal = Object.values(marketing).reduce((s, v) => s + num(v), 0);
  const techTotal = Object.values(tech).reduce((s, v) => s + num(v), 0);
  const monthlyBurn = teamTotal + opsTotal + mktTotal + techTotal;
  const total12 = monthlyBurn * 12;
  const capital = num(fundingGoal);
  const runway = monthlyBurn > 0 && capital > 0 ? capital / monthlyBurn : 0;
  const recommendedRaise = monthlyBurn > 0 ? 1.5 * monthlyBurn * Math.max(runway, 1) : 0;

  const categories = [
    { label: "Team", value: teamTotal, color: "bg-brand-600" },
    { label: "Operations", value: opsTotal, color: "bg-blue-400" },
    { label: "Marketing", value: mktTotal, color: "bg-gold-500" },
    { label: "Tech / Product", value: techTotal, color: "bg-emerald-500" },
  ];

  // ── Team helpers ───────────────────────────────────────────────
  const addTeamRow = () => {
    setTeam((prev) => [...prev, { id: nextId++, role: "", salary: "" }]);
  };
  const removeTeamRow = (id) => {
    setTeam((prev) => prev.filter((r) => r.id !== id));
  };
  const updateTeam = (id, field, value) => {
    setTeam((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  // ── Copy summary ───────────────────────────────────────────────
  const copySummary = useCallback(() => {
    const lines = [
      "=== Budget Planner Summary ===",
      `Funding Goal:       $${fmt(capital)}`,
      "",
      "--- Monthly Burn by Category ---",
      `  Team:             $${fmt(teamTotal)}`,
      `  Operations:       $${fmt(opsTotal)}`,
      `  Marketing:        $${fmt(mktTotal)}`,
      `  Tech / Product:   $${fmt(techTotal)}`,
      `  Total Burn:       $${fmt(monthlyBurn)} / month`,
      "",
      "--- Key Metrics ---",
      `  Runway:           ${runway > 0 ? runway.toFixed(1) + " months" : "N/A"}`,
      `  12-Month Total:   $${fmt(total12)}`,
      `  Recommended Raise: $${fmt(recommendedRaise)}`,
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [capital, teamTotal, opsTotal, mktTotal, techTotal, monthlyBurn, runway, total12, recommendedRaise]);

  // ── Shared input component ─────────────────────────────────────
  const Field = ({ label, value, onChange, placeholder = "0" }) => (
    <div className="flex flex-col gap-1">
      <label className="label">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
        <input
          type="number"
          min="0"
          className="input pl-7 w-full"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="section-title">Budget Planner</h1>
          <p className="text-gray-500 text-sm mt-1">
            Model your monthly costs, runway, and fundraising target in real time.
          </p>
        </div>
        <button
          onClick={copySummary}
          className="btn-gold flex items-center gap-2 self-start sm:self-auto"
        >
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Summary
            </>
          )}
        </button>
      </div>

      {/* ── Funding Goal ────────────────────────────────────── */}
      <div className="card">
        <h2 className="text-brand-800 font-semibold text-base mb-4">Funding Goal / Capital Available</h2>
        <div className="max-w-xs">
          <Field
            label="Total Capital ($)"
            value={fundingGoal}
            onChange={setFundingGoal}
            placeholder="e.g. 500000"
          />
        </div>
      </div>

      {/* ── Summary Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Monthly Burn",
            value: `$${fmt(monthlyBurn)}`,
            sub: "per month",
            accent: "text-brand-800",
          },
          {
            title: "Runway",
            value: runway > 0 ? `${runway.toFixed(1)} mo` : "—",
            sub: capital > 0 && monthlyBurn === 0 ? "no burn" : capital === 0 ? "enter capital" : "at current burn",
            accent: runway > 0 && runway < 6 ? "text-red-600" : runway >= 6 && runway < 12 ? "text-amber-600" : "text-emerald-600",
          },
          {
            title: "12-Month Total",
            value: `$${fmt(total12)}`,
            sub: "projected spend",
            accent: "text-brand-800",
          },
          {
            title: "Recommended Raise",
            value: `$${fmt(recommendedRaise)}`,
            sub: "1.5× burn × runway",
            accent: "text-gold-600",
          },
        ].map((card) => (
          <div key={card.title} className="card flex flex-col gap-1">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{card.title}</p>
            <p className={`text-2xl font-bold ${card.accent}`}>{card.value}</p>
            <p className="text-gray-400 text-xs">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Category Breakdown Bars ──────────────────────────── */}
      {monthlyBurn > 0 && (
        <div className="card">
          <h2 className="text-brand-800 font-semibold text-base mb-4">Burn Breakdown</h2>
          <div className="space-y-3">
            {categories.map((cat) => {
              const pct = monthlyBurn > 0 ? (cat.value / monthlyBurn) * 100 : 0;
              return (
                <div key={cat.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700 font-medium">{cat.label}</span>
                    <span className="text-sm text-gray-500">
                      ${fmt(cat.value)}{" "}
                      <span className="text-gray-400">({pct.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${cat.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
            {categories.map((cat) => (
              <div key={cat.label} className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${cat.color}`} />
                <span className="text-xs text-gray-500">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Team ────────────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-brand-800 font-semibold text-base">Team</h2>
            <p className="text-gray-400 text-xs mt-0.5">Monthly salaries / contractor fees</p>
          </div>
          <span className="text-sm font-semibold text-brand-800">${fmt(teamTotal)} / mo</span>
        </div>

        <div className="space-y-3">
          {team.map((row) => (
            <div key={row.id} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="label">Role / Name</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g. Full-Stack Engineer"
                  value={row.role}
                  onChange={(e) => updateTeam(row.id, "role", e.target.value)}
                />
              </div>
              <div className="w-40">
                <label className="label">Monthly ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    className="input pl-7 w-full"
                    placeholder="0"
                    value={row.salary}
                    onChange={(e) => updateTeam(row.id, "salary", e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={() => removeTeamRow(row.id)}
                disabled={team.length === 1}
                className="mb-0.5 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Remove row"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button onClick={addTeamRow} className="btn-primary mt-4 flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Team Member
        </button>
      </div>

      {/* ── Operations ──────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-brand-800 font-semibold text-base">Operations</h2>
            <p className="text-gray-400 text-xs mt-0.5">Rent, utilities, software, and overhead</p>
          </div>
          <span className="text-sm font-semibold text-brand-800">${fmt(opsTotal)} / mo</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Office / Rent" value={ops.rent} onChange={(v) => setOps((p) => ({ ...p, rent: v }))} />
          <Field label="Utilities" value={ops.utilities} onChange={(v) => setOps((p) => ({ ...p, utilities: v }))} />
          <Field label="Software Subscriptions" value={ops.software} onChange={(v) => setOps((p) => ({ ...p, software: v }))} />
          <Field label="Hardware / Equipment" value={ops.hardware} onChange={(v) => setOps((p) => ({ ...p, hardware: v }))} />
          <Field label="Miscellaneous" value={ops.misc} onChange={(v) => setOps((p) => ({ ...p, misc: v }))} />
        </div>
      </div>

      {/* ── Marketing ───────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-brand-800 font-semibold text-base">Marketing</h2>
            <p className="text-gray-400 text-xs mt-0.5">Ads, content, and growth spend</p>
          </div>
          <span className="text-sm font-semibold text-brand-800">${fmt(mktTotal)} / mo</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Paid Ads" value={marketing.ads} onChange={(v) => setMarketing((p) => ({ ...p, ads: v }))} />
          <Field label="Content Creation" value={marketing.content} onChange={(v) => setMarketing((p) => ({ ...p, content: v }))} />
          <Field label="SEO / Tools" value={marketing.seo} onChange={(v) => setMarketing((p) => ({ ...p, seo: v }))} />
          <Field label="Events / Sponsorships" value={marketing.events} onChange={(v) => setMarketing((p) => ({ ...p, events: v }))} />
        </div>
      </div>

      {/* ── Tech / Product ──────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-brand-800 font-semibold text-base">Tech / Product</h2>
            <p className="text-gray-400 text-xs mt-0.5">Hosting, APIs, and development tooling</p>
          </div>
          <span className="text-sm font-semibold text-brand-800">${fmt(techTotal)} / mo</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Hosting / Infrastructure" value={tech.hosting} onChange={(v) => setTech((p) => ({ ...p, hosting: v }))} />
          <Field label="Third-Party APIs" value={tech.apis} onChange={(v) => setTech((p) => ({ ...p, apis: v }))} />
          <Field label="Dev Tools / Licenses" value={tech.devtools} onChange={(v) => setTech((p) => ({ ...p, devtools: v }))} />
        </div>
      </div>

      {/* ── Full Summary Footer ──────────────────────────────── */}
      <div className="card bg-brand-50 border-brand-200">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div>
            <h2 className="text-brand-800 font-bold text-lg mb-3">Full Summary</h2>
            <div className="space-y-1 text-sm">
              {[
                ["Funding Goal", `$${fmt(capital)}`],
                ["Monthly Burn Rate", `$${fmt(monthlyBurn)}`],
                ["Runway", runway > 0 ? `${runway.toFixed(1)} months` : "—"],
                ["12-Month Projected Spend", `$${fmt(total12)}`],
                ["Recommended Raise (1.5× buffer)", `$${fmt(recommendedRaise)}`],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-gray-500 w-52 shrink-0">{k}:</span>
                  <span className="text-brand-800 font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            {runway > 0 && runway < 12 && (
              <div className={`rounded-lg px-4 py-3 text-sm font-medium border ${
                runway < 6
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-amber-50 border-amber-200 text-amber-700"
              }`}>
                {runway < 6
                  ? `Warning: Only ${runway.toFixed(1)} months of runway.`
                  : `Heads up: ${runway.toFixed(1)} months of runway — plan your raise.`}
              </div>
            )}
            {runway >= 12 && (
              <div className="rounded-lg px-4 py-3 text-sm font-medium border bg-emerald-50 border-emerald-200 text-emerald-700">
                {runway.toFixed(1)} months of runway — solid position.
              </div>
            )}
            <button onClick={copySummary} className="btn-gold flex items-center gap-2">
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied to clipboard
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Summary for Investors
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
