import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const DOCUMENT_CATEGORIES = [
  {
    id: 'legal',
    label: 'Legal & Registration',
    docs: [
      { key: 'registration_certificate', label: 'Company Registration Certificate', required: true },
      { key: 'founder_id', label: 'Founder ID Proof (Aadhaar / Passport)', required: true },
      { key: 'cap_table', label: 'Cap Table', required: true },
      { key: 'legal_disputes', label: 'Legal Disputes Declaration', required: false },
    ],
  },
  {
    id: 'financial',
    label: 'Financial Documents',
    docs: [
      { key: 'financials', label: 'Financial Statements (P&L, Balance Sheet)', required: true },
      { key: 'tax_documents', label: 'Tax Returns (last 2 years)', required: true },
      { key: 'debt_liabilities', label: 'Debt & Liabilities Schedule', required: false },
      { key: 'customer_contracts', label: 'Key Customer Contracts', required: false },
    ],
  },
  {
    id: 'product',
    label: 'Product & IP',
    docs: [
      { key: 'ip_documents', label: 'IP / Patent Documents', required: false },
      { key: 'licenses', label: 'Licenses & Permits', required: false },
      { key: 'product_demo', label: 'Product Demo Link / Video', required: false, isLink: true },
    ],
  },
  {
    id: 'pitch',
    label: 'Pitch Materials',
    docs: [
      { key: 'pitch_deck', label: 'Pitch Deck (PDF)', required: true },
      { key: 'pitch_video', label: 'Pitch Video Link', required: false, isLink: true },
      { key: 'executive_summary', label: 'Executive Summary', required: false },
    ],
  },
]

function UploadRow({ doc, uploaded, onUpload, onLink }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('doc_type', doc.key)
      await api.post('/data-room/upload/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      onUpload(doc.key, file.name)
    } catch {
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const isUploaded = !!uploaded

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
      isUploaded ? 'border-emerald-200 bg-emerald-50' : 'border-zinc-200 bg-white'
    }`}>
      {/* Status icon */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUploaded ? 'bg-emerald-100' : 'bg-zinc-100'
      }`}>
        {isUploaded ? (
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        )}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900">
          {doc.label}
          {doc.required && <span className="text-red-400 ml-1">*</span>}
        </p>
        {isUploaded && (
          <p className="text-xs text-emerald-600 mt-0.5 truncate">{uploaded}</p>
        )}
      </div>

      {/* Action */}
      {doc.isLink ? (
        <input
          type="url"
          placeholder="Paste link..."
          defaultValue={uploaded || ''}
          onBlur={e => onLink(doc.key, e.target.value)}
          className="input w-48 text-xs"
        />
      ) : (
        <>
          <input ref={inputRef} type="file" className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={handleFile} />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              isUploaded
                ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}>
            {uploading ? 'Uploading...' : isUploaded ? 'Replace' : 'Upload'}
          </button>
        </>
      )}
    </div>
  )
}

export default function DataRoom() {
  const { user } = useAuth()
  const [uploads, setUploads] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/data-room/').then(res => {
      const map = {}
      ;(res.data || []).forEach(d => { map[d.doc_type] = d.filename || d.url || 'Uploaded' })
      setUploads(map)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  function handleUpload(key, name) {
    setUploads(u => ({ ...u, [key]: name }))
  }
  function handleLink(key, url) {
    if (url) setUploads(u => ({ ...u, [key]: url }))
  }

  const total = DOCUMENT_CATEGORIES.flatMap(c => c.docs).length
  const required = DOCUMENT_CATEGORIES.flatMap(c => c.docs).filter(d => d.required).length
  const uploadedCount = Object.keys(uploads).length
  const requiredDone = DOCUMENT_CATEGORIES.flatMap(c => c.docs)
    .filter(d => d.required && uploads[d.key]).length
  const pct = Math.round((uploadedCount / total) * 100)

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Founder Data Room</p>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">Documents & Data Room</h1>
          <p className="text-sm text-zinc-500">
            Upload supporting documents for the audit team. All documents are stored securely and shared only with verified auditors and, after approval, relevant investors.
          </p>
        </div>

        {/* Progress overview */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900">{uploadedCount} of {total} documents uploaded</p>
              <p className="text-xs text-zinc-500 mt-0.5">{requiredDone} of {required} required documents complete</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-zinc-900">{pct}%</p>
              <p className="text-xs text-zinc-500">complete</p>
            </div>
          </div>
          <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          {requiredDone < required && (
            <div className="mt-3 flex items-center gap-2 text-amber-600">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-xs font-medium">{required - requiredDone} required document{required - requiredDone !== 1 ? 's' : ''} still needed before audit can begin</p>
            </div>
          )}
        </div>

        {/* Security notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
          <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-xs text-blue-700 leading-relaxed">
            Documents are stored with end-to-end encryption. Investors only gain access after your pitch is approved and live, and only if they meet eligibility requirements.
          </p>
        </div>

        {/* Document categories */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {DOCUMENT_CATEGORIES.map(cat => (
              <div key={cat.id}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-sm font-semibold text-zinc-900">{cat.label}</h2>
                  <div className="flex-1 h-px bg-zinc-100" />
                  <span className="text-xs text-zinc-400">
                    {cat.docs.filter(d => uploads[d.key]).length}/{cat.docs.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {cat.docs.map(doc => (
                    <UploadRow
                      key={doc.key}
                      doc={doc}
                      uploaded={uploads[doc.key]}
                      onUpload={handleUpload}
                      onLink={handleLink}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Accepted formats */}
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-400">
            Accepted: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG &bull; Max 50MB per file &bull; All uploads are version-controlled
          </p>
        </div>
      </div>
    </div>
  )
}
