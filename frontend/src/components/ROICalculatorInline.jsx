import { useState } from 'react'

export default function ROICalculatorInline({ fundingGoal = 500000 }) {
  const [check, setCheck] = useState('')
  const [valuation, setValuation] = useState(fundingGoal * 4 || '')
  const [years, setYears] = useState(5)
  const [dilution, setDilution] = useState(20)

  const c = parseFloat(check) || 0
  const v = parseFloat(valuation) || 1
  const ownership = v > 0 ? (c / v) * 100 : 0
  const postDilution = ownership * (1 - dilution / 100)

  const scenarios = [3, 5, 10, 20].map(mult => {
    const exitVal = v * mult
    const myReturn = (postDilution / 100) * exitVal
    const moic = c > 0 ? myReturn / c : 0
    const irr = moic > 0 ? ((Math.pow(moic, 1 / years) - 1) * 100).toFixed(1) : 0
    return { mult, exitVal, myReturn, moic: moic.toFixed(2), irr }
  })

  const fmt = n => n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${Math.round(n).toLocaleString()}`

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label text-xs">Your Check Size ($)</label>
          <input type="number" className="input text-sm py-1.5" placeholder="e.g. 50000"
            value={check} onChange={e => setCheck(e.target.value)} />
        </div>
        <div>
          <label className="label text-xs">Company Valuation ($)</label>
          <input type="number" className="input text-sm py-1.5"
            value={valuation} onChange={e => setValuation(e.target.value)} />
        </div>
        <div>
          <label className="label text-xs">Years to Exit: <span className="text-blue-600 font-bold">{years}</span></label>
          <input type="range" min="3" max="10" value={years} onChange={e => setYears(e.target.value)}
            className="w-full accent-blue-600" />
        </div>
        <div>
          <label className="label text-xs">Dilution %: <span className="text-blue-600 font-bold">{dilution}%</span></label>
          <input type="range" min="0" max="50" value={dilution} onChange={e => setDilution(e.target.value)}
            className="w-full accent-blue-600" />
        </div>
      </div>

      {c > 0 && (
        <>
          <div className="flex gap-3 text-xs">
            <div className="bg-blue-50 rounded-lg px-3 py-2 flex-1 text-center">
              <div className="text-gray-400">Ownership</div>
              <div className="font-black text-blue-700">{ownership.toFixed(2)}%</div>
            </div>
            <div className="bg-blue-50 rounded-lg px-3 py-2 flex-1 text-center">
              <div className="text-gray-400">Post-Dilution</div>
              <div className="font-black text-blue-700">{postDilution.toFixed(2)}%</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-3 py-2 font-semibold text-gray-500">Exit</th>
                  <th className="text-right px-3 py-2 font-semibold text-gray-500">Your Return</th>
                  <th className="text-right px-3 py-2 font-semibold text-gray-500">MOIC</th>
                  <th className="text-right px-3 py-2 font-semibold text-gray-500">IRR</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map(s => (
                  <tr key={s.mult} className="border-t border-gray-100">
                    <td className="px-3 py-2 font-bold text-gray-700">{s.mult}x</td>
                    <td className="px-3 py-2 text-right font-bold text-green-600">{fmt(s.myReturn)}</td>
                    <td className="px-3 py-2 text-right text-blue-600 font-semibold">{s.moic}x</td>
                    <td className="px-3 py-2 text-right text-purple-600 font-semibold">{s.irr}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
