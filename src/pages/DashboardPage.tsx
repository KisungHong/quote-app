import { Link } from 'react-router-dom'
import { useQuoteStore } from '../store/quoteStore'
import { formatKRW, formatDate } from '../lib/quoteCalculator'

export default function DashboardPage() {
  const { quotes, deleteQuote } = useQuoteStore()

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-2">Quotations</p>
          <h1 className="text-[28px] font-semibold text-black leading-tight">견적서 목록</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span className="font-medium text-black">{quotes.length}</span>건
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/8 py-24 text-center">
          <div className="w-12 h-12 bg-black/4 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-neutral-400 text-sm mb-6">아직 작성된 견적서가 없습니다</p>
          <Link
            to="/new"
            className="inline-flex items-center gap-1.5 bg-black text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors"
          >
            첫 견적서 만들기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="group bg-white rounded-2xl border border-black/8 px-6 py-5 flex items-center justify-between hover:border-black/20 hover:shadow-sm transition-all duration-150"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center text-xs font-bold tracking-tight shrink-0">
                  {quote.customer.companyName.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="font-semibold text-[15px] text-black">{quote.customer.companyName}</span>
                    <span className="text-xs text-neutral-400">{quote.customer.contactName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>{quote.customer.officeSizePyeong}평</span>
                    <span>·</span>
                    <span>{quote.customer.serviceFrequency}</span>
                    <span>·</span>
                    <span>{formatDate(quote.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="text-right">
                  <div className="font-semibold text-[15px] text-black">{formatKRW(quote.calculation.totalAmount)}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">월 합계 (VAT 포함)</div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to={`/quote/${quote.id}`}
                    className="text-[13px] font-medium text-black px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors"
                  >
                    열기
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`"${quote.customer.companyName}" 견적서를 삭제할까요?`)) {
                        deleteQuote(quote.id)
                      }
                    }}
                    className="text-[13px] text-neutral-400 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
