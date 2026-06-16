import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuoteStore } from '../store/quoteStore'
import { parseNaturalLanguageToQuote } from '../lib/aiQuoteParser'

const EXAMPLE_PROMPTS = [
  {
    label: '핀테크 스타트업 · 120평',
    text: '고객사: 주식회사 페이랩스, 담당자: 정수빈 경영지원팀장, 서울 강남구 테헤란로 152, 120평 80명. 주3회/일2시간. 사무공간·미팅룸 3개·화장실·캔틴바 클리닝, 화장실 소모품 보충, 프린터 소모품 관리. 오전 8:30 이전 청소 필수.',
  },
  {
    label: '게임 개발사 · 250평',
    text: '고객사: 주식회사 크리에이티브웍스, 담당자: 박지훈 총무팀장, 서울 서초구 서초대로 396, 250평 180명. 주5회/일4시간. 사무공간 2개 층·라운지·미팅룸 5개·화장실 클리닝, 캔틴바 일일 정리, 비품소모품 통합 관리, 스낵바 운영. 오전 9시 이후 청소 시작, 현재 청소 업체 3곳 통합 원스톱 전환 희망.',
  },
  {
    label: '자산운용사 · 180평 (프리미엄)',
    text: '고객사: 주식회사 알파에셋운용, 담당자: 최민아 경영지원실 이사, 서울 영등포구 여의대로 108, 180평 60명. 주5회/일3시간. 임원실 4개·회의실 6개·딜링룸·사무공간·화장실 클리닝, 고급 목재 가구·유리 파티션 전용 클리닝, 소모품 보충. 보안 교육 이수 직원 배치 요청, 컨시어지 하프 타입 추가 검토 희망.',
  },
  {
    label: '이커머스 스타트업 · 350평 (신사옥)',
    text: '고객사: 주식회사 버킷오더, 담당자: 이승현 대표이사, 서울 강남구 선릉로 428, 350평 230명. 주5회/일6시간. 사무공간 전체·미팅룸 8개·폰부스 6개·캔틴바 2개 층·화장실 클리닝, 입주 초기 딥클리닝 포함, 비품소모품 통합 관리 + 발주 대행, 테라스·루프탑 월2회, 스낵바 운영. 사옥 이전 직후 서비스 시작(D+1), 이번 주 내 의사결정 예정.',
  },
  {
    label: '헬스케어 기업 · 90평 (컨시어지)',
    text: '고객사: 주식회사 메디링크, 담당자: 강태영 인사총무팀장, 서울 강남구 역삼동 823-1, 90평 45명. 컨시어지 하프 타입 (주5회·4시간 상주) — 전화응대, 사무보조, 입퇴사자 자산 온보딩 포함. 청소 주2회/비품 관리 포함. 기존 알바 잦은 이직으로 정규 컨시어지 전환 희망, 계약 후 2주 내 온보딩 필요.',
  },
]

export default function NewQuotePage() {
  const navigate = useNavigate()
  const addQuote = useQuoteStore((s) => s.addQuote)

  const [input, setInput] = useState('')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ob_api_key') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('ob_api_key'))

  const handleSaveApiKey = () => {
    localStorage.setItem('ob_api_key', apiKey)
    setShowApiKeyInput(false)
  }

  const handleGenerate = async () => {
    if (!input.trim()) return
    if (!apiKey) { setShowApiKeyInput(true); return }
    setLoading(true)
    setError('')
    const result = await parseNaturalLanguageToQuote(input, apiKey)
    if (result.success && result.quote) {
      const newQuote = addQuote(result.quote)
      navigate(`/quote/${newQuote.id}`)
    } else {
      setError(result.error || '견적서 생성에 실패했습니다.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-2">
        <Link to="/" className="inline-flex items-center gap-1 text-[13px] text-neutral-400 hover:text-black transition-colors mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          목록으로
        </Link>
      </div>

      <div className="mb-8">
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-2">New Quote</p>
        <h1 className="text-[28px] font-semibold text-black leading-tight">새 견적서 작성</h1>
        <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
          고객의 요청사항을 자유롭게 입력하면 AI가 견적 초안을 자동으로 생성합니다.
        </p>
      </div>

      {/* API Key */}
      {showApiKeyInput && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 mb-6">
          <p className="text-[13px] font-semibold text-amber-900 mb-1">OpenAI API Key 설정</p>
          <p className="text-[12px] text-amber-700 mb-3">AI 견적 생성을 위해 필요합니다. 브라우저 로컬에만 저장됩니다.</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
              placeholder="sk-..."
              className="flex-1 text-sm border border-amber-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button
              onClick={handleSaveApiKey}
              className="bg-amber-500 text-white text-[13px] font-medium px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate()
          }}
          placeholder="고객사명, 사무실 규모, 요청 서비스, 특이사항 등을 자유롭게 입력하세요.&#10;&#10;예) 강남구 400평 사무실, 주5회 일6시간, 전체 클리닝 + 비품관리 요청, 담당자 홍길동 이사님"
          rows={7}
          className="w-full text-[14px] leading-relaxed text-black placeholder:text-neutral-300 focus:outline-none resize-none"
          style={{ fontFamily: 'inherit' }}
        />

        {error && (
          <div className="mt-3 text-[13px] text-red-500 bg-red-50 rounded-xl px-3 py-2.5">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/6">
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            API 키 변경
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-neutral-300">⌘ + Enter</span>
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="flex items-center gap-2 bg-black text-white text-[13px] font-medium px-5 py-2.5 rounded-full hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  생성 중...
                </>
              ) : '견적서 생성'}
            </button>
          </div>
        </div>
      </div>

      {/* 예시 */}
      <div>
        <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest mb-3">예시 케이스</p>
        <div className="flex flex-col gap-1.5">
          {EXAMPLE_PROMPTS.map((ex, i) => (
            <button
              key={i}
              onClick={() => setInput(ex.text)}
              className="flex items-center justify-between text-left bg-white border border-black/6 rounded-xl px-4 py-3 hover:border-black/20 hover:bg-neutral-50 transition-all group"
            >
              <span className="text-[13px] font-medium text-neutral-600 group-hover:text-black transition-colors">{ex.label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-300 group-hover:text-neutral-500 shrink-0 ml-3 transition-colors">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
