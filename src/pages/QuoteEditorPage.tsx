import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuoteStore } from '../store/quoteStore'
import CustomerInfoSection from '../components/quote/CustomerInfoSection'
import ServiceItemsTable from '../components/quote/ServiceItemsTable'
import CalculationSection from '../components/quote/CalculationSection'
import QuotePreview from '../components/quote/QuotePreview'
import type { Quote } from '../types/quote'

export default function QuoteEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getQuote, updateQuote } = useQuoteStore()

  const [draft, setDraft] = useState<Quote | null>(null)
  const [saved, setSaved] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (!id) return
    const q = getQuote(id)
    if (!q) { navigate('/'); return }
    setDraft(q)
  }, [id])

  if (!draft) return null

  const update = (partial: Partial<Quote>) => {
    setSaved(false)
    setDraft((prev) => prev ? { ...prev, ...partial } : prev)
  }

  const handleSave = () => {
    if (!draft) return
    updateQuote(draft.id, draft)
    setSaved(true)
  }

  if (showPreview) {
    return <QuotePreview quote={draft} onBack={() => setShowPreview(false)} />
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-1 text-[13px] text-neutral-400 hover:text-black transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            목록
          </Link>
          <div className="w-px h-4 bg-black/10" />
          <div>
            <h1 className="text-[18px] font-semibold text-black leading-tight">
              {draft.customer.companyName || '새 견적서'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved ? (
            <span className="text-[12px] text-neutral-400 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              저장됨
            </span>
          ) : (
            <span className="text-[12px] text-amber-500">미저장</span>
          )}
          <button
            onClick={() => setShowPreview(true)}
            className="text-[13px] font-medium text-black border border-black/15 px-4 py-2 rounded-full hover:bg-black/5 transition-colors"
          >
            미리보기
          </button>
          <button
            onClick={handleSave}
            className="text-[13px] font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors"
          >
            저장
          </button>
        </div>
      </div>

      <CustomerInfoSection customer={draft.customer} onChange={(customer) => update({ customer })} />
      <ServiceItemsTable items={draft.serviceItems} onChange={(serviceItems) => update({ serviceItems })} />
      <CalculationSection calculation={draft.calculation} onChange={(calculation) => update({ calculation })} />

      {/* 특이사항 */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 mb-3">
        <h2 className="text-[13px] font-semibold text-black mb-3 uppercase tracking-wide">특이사항 / 안내사항</h2>
        <textarea
          value={draft.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="유효기간, 추가 안내, 협의 필요 항목 등을 입력하세요."
          rows={4}
          className="w-full text-[14px] text-black border border-black/10 rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 resize-none placeholder:text-neutral-300"
          style={{ fontFamily: 'inherit' }}
        />
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-end gap-2 pt-2 pb-8">
        <button
          onClick={() => setShowPreview(true)}
          className="text-[13px] font-medium text-black border border-black/15 px-5 py-2.5 rounded-full hover:bg-black/5 transition-colors"
        >
          미리보기
        </button>
        <button
          onClick={handleSave}
          className="text-[13px] font-medium bg-black text-white px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors"
        >
          저장
        </button>
      </div>
    </div>
  )
}
