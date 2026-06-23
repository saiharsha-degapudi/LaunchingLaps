import { useState, useMemo } from 'react'

const MULTIPLES = [3, 5, 10, 20]

function calcIRR(moic, years) {
  if (years <= 0) return 0
  return (Math.pow(moic, 1 / years) - 1) * 100
}

function paybackClass(irr) {
  if (irr > 30) return { label: 'Strong', color: 'text-green-600 bg-green-50' }
  if (irr > 20) return { label: 'Good', color: 'text-blue-600 bg-blue-50' }
  if (irr > 10) return { label: 'Moderate', color: 'text-yellow-600 bg-yellow-50' }
  return { label: 'Low', color: 'text-red-600 bg-red-50' }
}

function fmt(n) {
  return Number(n.toFixed(2)).toLocaleString()
}

export default function ROICalculator() {
  const [checkSize, setCheckSize] = useState('')
  const [valuation, setValuation] = useState('')
  const [targetMultiple, setTargetMultiple] = useState(5)
  const [years, setYears] = useState(5)
  const [dilution, setDilution] = useState(20)

  const results = useMemo(() => {
    const check = parseFloat(checkSize) || 0
    const val = parseFloat(valuation) || 0
    if (check <= 0 || val <= 0) return null

    const ownership = (check / val) * 100
    const postDilutionOwnership = ownership * (1 - dilution / 100)

    const scenarios = MULTIPLES.map((m) => {
      const exitValue = val * m
      const yourReturn = (postDilutionOwnership / 100) * exitValue
      const moic = yourReturn / check
      const irr = calcIRR(moic, years)
      const pb = paybackClass(irr)
      return { multiple: m, exitValue, yourReturn, moic, irr, pb }
    })

    const selected = scenarios.find((s) => s.multiple === targetMultiple)

    return { ownership, postDilutionOwnership, scenarios, selected }
  }, [checkSize, valuation, targetMultiple, years, dilution])

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="section-title mb-2">ROI Calculator</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Model your investment returns across exit scenarios.
      </p>

      {/* Inputs */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Check Size */}
          <div>
            <label className="label">Check Size ($)</label>
            <input
              type="number"
              className="input"
              placeholder="e.g. 100000"
              value={checkSize}
              onChange={(e) => setCheckSize(e.target.value)}
              min={0}
            />
          </div>

          {/* Valuation */}
          <div>
            <label className="label">Valuation at Investment ($)</label>
            <input
              type="number"
              className="input"
              placeholder="e.g. 5000000"
              value={valuation}
              onChange={(e) => setValuation(e.target.value)}
              min={0}
            />
          </div>

          {/* Target Exit Multiple */}
          <div>
            <label className="label">Target Exit Multiple</label>
            <select
              className="input"
              value={targetMultiple}
              onChange={(e) => setTargetMultiple(Number(e.target.value))}
            >
              {MULTIPLES.map((m) => (
                <option key={m} value={m}>
                  {m}x
                </option>
              ))}
            </select>
          </div>

          {/* Years to Exit */}
          <div>
            <label className="label">Years to Exit: <span className="font-semibold text-brand-800">{years} yrs</span></label>
            <input
              type="range"
              min={3}
              max={10}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-blue-600 mt-1"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>3 yrs</span><span>10 yrs</span>
            </div>
          </div>

          {/* Dilution */}
          <div className="sm:col-span-2">
            <label className="label">Ownership Dilution %: <span className="font-semibold text-brand-800">{dilution}%</span></label>
            <input
              type="range"
              min={0}
              max={50}
              value={dilution}
              onChange={(e) => setDilution(Number(e.target.value))}
              className="w-full accent-blue-600 mt-1"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span><span>50%</span>
            </div>
          </div>
        </div>
      </div>

      {results ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <p className="text-xs text-gray-500 mb-1">Your Ownership</p>
              <p className="text-2xl font-bold text-brand-800">{fmt(results.ownership)}%</p>
            </div>
            <div className="card text-center">
              <p className="text-xs text-gray-500 mb-1">Post-Dilution Ownership</p>
              <p className="text-2xl font-bold text-brand-800">{fmt(results.postDilutionOwnership)}%</p>
            </div>
            <div className="card text-center">
              <p className="text-xs text-gray-500 mb-1">MOIC at {targetMultiple}x</p>
              <p className="text-2xl font-bold text-gold-600">{fmt(results.selected.moic)}x</p>
            </div>
            <div className="card text-center">
              <p className="text-xs text-gray-500 mb-1">IRR at {targetMultiple}x</p>
              <p className="text-2xl font-bold text-gold-600">{fmt(results.selected.irr)}%</p>
            </div>
          </div>

          {/* Selected Scenario Highlight */}
          <div className="card mb-8 border-l-4 border-blue-500">
            <div className="flex flex-wrap gap-6 items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Your Return at {targetMultiple}x</p>
                <p className="text-3xl font-bold text-brand-800">
                  ${Number(results.selected.yourReturn.toFixed(0)).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Exit Valuation</p>
                <p className="text-xl font-semibold text-gray-700">
                  ${Number(results.selected.exitValue.toFixed(0)).toLocaleString()}
                </p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${results.selected.pb.color}`}>
                  {results.selected.pb.label} Return
                </span>
              </div>
            </div>
          </div>

          {/* Scenario Comparison Table */}
          <div className="card overflow-x-auto">
            <h2 className="font-bold text-brand-800 mb-4 text-base">Scenario Comparison</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-2 text-gray-500 font-medium">Multiple</th>
                  <th className="pb-2 text-gray-500 font-medium">Exit Value</th>
                  <th className="pb-2 text-gray-500 font-medium">Your Return</th>
                  <th className="pb-2 text-gray-500 font-medium">MOIC</th>
                  <th className="pb-2 text-gray-500 font-medium">IRR</th>
                  <th className="pb-2 text-gray-500 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {results.scenarios.map((s) => (
                  <tr
                    key={s.multiple}
                    className={`border-b border-gray-100 last:border-0 ${
                      s.multiple === targetMultiple ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="py-2.5 font-semibold text-brand-800">{s.multiple}x</td>
                    <td className="py-2.5 text-gray-700">${Number(s.exitValue.toFixed(0)).toLocaleString()}</td>
                    <td className="py-2.5 font-semibold text-gray-900">${Number(s.yourReturn.toFixed(0)).toLocaleString()}</td>
                    <td className="py-2.5 text-gold-600 font-medium">{fmt(s.moic)}x</td>
                    <td className="py-2.5 text-gold-600 font-medium">{fmt(s.irr)}%</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.pb.color}`}>
                        {s.pb.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="card text-center text-gray-400 py-12">
          Enter your check size and valuation to see projections.
        </div>
      )}
    </div>
  )
}
