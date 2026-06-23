import { useState } from 'react'

const CATEGORIES = ['Team', 'Operations', 'Marketing', 'Tech']
const CAT_COLORS = { Team: 'bg-blue-500', Operations: 'bg-orange-400', Marketing: 'bg-pink-500', Tech: 'bg-purple-500' }

function emptyRow() { return { name: '', amount: '' } }

export default function BudgetPlannerInline() {
  const [funding, setFunding] = useState('')
  const [rows, setRows] = useState({ Team: [emptyRow()], Operations: [emptyRow()], Marketing: [emptyRow()], Tech: [emptyRow()] })

  function addRow(cat) {
    setRows(r => ({ ...r, [cat]: [...r[cat], emptyRow()] }))
  }

  function updateRow(cat, i, field, val) {
    setRows(r => {
      const updated = [...r[cat]]
      updated[i] = { ...updated[i], [field]: val }
      return { ...r, [cat]: updated }
    })
  }

  function removeRow(cat, i) {
    setRows(r => ({ ...r, [cat]: r[cat].filter((_, idx) => idx !== i) }))
  }

  const catTotals = Object.fromEntries(CATEGORIES.map(c => [c, rows[c].reduce((s, r) => s + (parseFloat(r.amount) || 0), 0)]))
  const monthlyBurn = Object.values(catTotals).reduce((a, b) => a + b, 0)
  const totalGoal = parseFloat(funding) || 0
  const runway = monthlyBurn > 0 && totalGoal > 0 ? Math.floor(totalGoal / monthlyBurn) : 0
  const annual = monthlyBurn * 12
  const recommended = Math.ceil(monthlyBurn * 18 / 1000) * 1000

  const fmt = n => '$' + n.toLocaleString()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="label text-xs">Total Funding Goal (USD)</label>
        <input type="number" className="input text-sm" placeholder="e.g. 500000"
          value={funding} onChange={e => setFunding(e.target.value)} />
      </div>

      {CATEGORIES.map(cat => (
        <div key={cat}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${CAT_COLORS[cat]}`} />
            <span className="text-xs font-bold text-gray-700">{cat}</span>
            <span className="text-xs text-gray-400 ml-auto">{fmt(catTotals[cat])}/mo</span>
          </div>
          {rows[cat].map((row, i) => (
            <div key={i} className="flex gap-2 mb-1.5">
              <input className="input text-xs flex-1 py-1.5" placeholder="Item name"
                value={row.name} onChange={e => updateRow(cat, i, 'name', e.target.value)} />
              <input type="number" className="input text-xs w-28 py-1.5" placeholder="$/mo"
                value={row.amount} onChange={e => updateRow(cat, i, 'amount', e.target.value)} />
              <button onClick={() => removeRow(cat, i)} className="text-gray-300 hover:text-red-400 text-sm px-1">×</button>
            </div>
          ))}
          <button onClick={() => addRow(cat)} className="text-xs text-indigo-500 hover:underline">+ Add row</button>
        </div>
      ))}

      {monthlyBurn > 0 && (
        <div className="bg-emerald-50 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xs text-gray-500">Monthly Burn</div>
            <div className="font-black text-emerald-700 text-lg">{fmt(monthlyBurn)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Runway</div>
            <div className={`font-black text-lg ${runway < 12 ? 'text-red-500' : 'text-emerald-700'}`}>{runway > 0 ? `${runway} mo` : '—'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">12-Month Total</div>
            <div className="font-black text-gray-700 text-lg">{fmt(annual)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Recommended Raise</div>
            <div className="font-black text-indigo-700 text-lg">{fmt(recommended)}</div>
          </div>
        </div>
      )}
    </div>
  )
}
