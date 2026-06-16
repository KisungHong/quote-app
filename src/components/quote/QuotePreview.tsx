import type { Quote } from '../../types/quote'
import { formatKRW, formatDate } from '../../lib/quoteCalculator'

interface Props {
  quote: Quote
  onBack: () => void
}

export default function QuotePreview({ quote, onBack }: Props) {
  const { customer, calculation, serviceItems, notes } = quote

  return (
    <div>
      {/* 컨트롤 바 */}
      <div className="flex items-center justify-between mb-6 no-print">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[13px] text-neutral-400 hover:text-black transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          편집으로 돌아가기
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-black text-white text-[13px] font-medium px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          인쇄 / PDF 저장
        </button>
      </div>

      {/* 견적서 본문 */}
      <div
        className="bg-white max-w-4xl mx-auto"
        style={{
          fontFamily: "'Figtree', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
          border: '1px solid #e5e5e5',
          borderRadius: '16px',
          padding: '48px 52px',
        }}
      >
        {/* 헤더: 로고 + 문서 타이틀 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px', borderBottom: '2px solid #000', paddingBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#000', letterSpacing: '-0.5px', lineHeight: 1 }}>
              Office Buddie
            </div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '4px', letterSpacing: '0.5px' }}>
              공간 토탈케어 솔루션
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#000', letterSpacing: '-0.3px' }}>견&nbsp;&nbsp;적&nbsp;&nbsp;서</div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>작성일: {formatDate(quote.createdAt)}</div>
          </div>
        </div>

        {/* 고객사 정보 */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', marginBottom: '28px', fontSize: '12px' }}>
          <colgroup>
            <col style={{ width: '110px' }} />
            <col />
            <col style={{ width: '110px' }} />
            <col />
          </colgroup>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
              <td style={{ padding: '10px 14px', backgroundColor: '#f8f8f8', fontWeight: '600', color: '#666', fontSize: '11px', borderRight: '1px solid #e8e8e8' }}>고객사명</td>
              <td style={{ padding: '10px 14px', color: '#111', borderRight: '1px solid #e8e8e8' }}>{customer.companyName || '—'}</td>
              <td style={{ padding: '10px 14px', backgroundColor: '#f8f8f8', fontWeight: '600', color: '#666', fontSize: '11px', borderRight: '1px solid #e8e8e8' }}>고객사 담당자</td>
              <td style={{ padding: '10px 14px', color: '#111' }}>{customer.contactName || '—'}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
              <td style={{ padding: '10px 14px', backgroundColor: '#f8f8f8', fontWeight: '600', color: '#666', fontSize: '11px', borderRight: '1px solid #e8e8e8' }}>사무실 주소</td>
              <td colSpan={3} style={{ padding: '10px 14px', color: '#111' }}>{customer.address || '—'}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
              <td style={{ padding: '10px 14px', backgroundColor: '#f8f8f8', fontWeight: '600', color: '#666', fontSize: '11px', borderRight: '1px solid #e8e8e8' }}>실면적</td>
              <td style={{ padding: '10px 14px', color: '#111', borderRight: '1px solid #e8e8e8' }}>{customer.officeSizePyeong}평 내외</td>
              <td style={{ padding: '10px 14px', backgroundColor: '#f8f8f8', fontWeight: '600', color: '#666', fontSize: '11px', borderRight: '1px solid #e8e8e8' }}>서비스 주기</td>
              <td style={{ padding: '10px 14px', color: '#111' }}>{customer.serviceFrequency || '—'}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 14px', backgroundColor: '#f8f8f8', fontWeight: '600', color: '#666', fontSize: '11px', borderRight: '1px solid #e8e8e8' }}>OB 담당자</td>
              <td colSpan={3} style={{ padding: '10px 14px', color: '#111' }}>{customer.obManager || '—'}</td>
            </tr>
          </tbody>
        </table>

        {/* 서비스 항목 */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ backgroundColor: '#000', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '8px 14px', borderRadius: '6px 6px 0 0', letterSpacing: '0.5px' }}>
            서비스 내역
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e0e0e0', borderTop: 'none', fontSize: '11px' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
                {['구분', '서비스형태', '공간 대분류', '공간 소분류', '업무 내용', '주기', '비고'].map((h) => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '600', color: '#666', letterSpacing: '0.3px', borderRight: '1px solid #ebebeb' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {serviceItems.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: idx % 2 === 1 ? '#fafafa' : '#fff' }}>
                  <td style={{ padding: '8px 10px', color: '#333', borderRight: '1px solid #ebebeb', whiteSpace: 'nowrap' }}>{item.serviceType}</td>
                  <td style={{ padding: '8px 10px', color: '#333', borderRight: '1px solid #ebebeb' }}>{item.category}</td>
                  <td style={{ padding: '8px 10px', color: '#333', borderRight: '1px solid #ebebeb' }}>{item.spaceCategory}</td>
                  <td style={{ padding: '8px 10px', color: '#333', borderRight: '1px solid #ebebeb' }}>{item.spaceSubcategory}</td>
                  <td style={{ padding: '8px 10px', color: '#111', borderRight: '1px solid #ebebeb' }}>{item.taskName}</td>
                  <td style={{ padding: '8px 10px', color: '#333', borderRight: '1px solid #ebebeb', whiteSpace: 'nowrap' }}>{item.frequency}</td>
                  <td style={{ padding: '8px 10px', color: '#888' }}>{item.notes}</td>
                </tr>
              ))}
              {serviceItems.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#ccc' }}>서비스 항목 없음</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 견적 산출 */}
        <div style={{ marginBottom: '28px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e0e0e0', borderRadius: '6px', overflow: 'hidden', fontSize: '12px' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #ebebeb' }}>
                <td style={{ padding: '10px 14px', backgroundColor: '#fafafa', fontWeight: '600', color: '#666', width: '50%', fontSize: '11px', letterSpacing: '0.3px' }}>
                  산출 기준
                </td>
                <td style={{ padding: '10px 14px', color: '#555', textAlign: 'right' }}>
                  일 {calculation.dailyHours}시간 × {formatKRW(calculation.hourlyRate)}/시간 × 주{calculation.daysPerWeek}회 × {calculation.weeksPerMonth}주
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #ebebeb' }}>
                <td style={{ padding: '10px 14px', backgroundColor: '#fafafa', fontWeight: '600', color: '#666', fontSize: '11px', letterSpacing: '0.3px' }}>합계 (VAT 별도)</td>
                <td style={{ padding: '10px 14px', fontWeight: '600', color: '#111', textAlign: 'right' }}>{formatKRW(calculation.monthlyAmount)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #ebebeb' }}>
                <td style={{ padding: '10px 14px', backgroundColor: '#fafafa', fontWeight: '600', color: '#666', fontSize: '11px', letterSpacing: '0.3px' }}>부가가치세 (10%)</td>
                <td style={{ padding: '10px 14px', color: '#666', textAlign: 'right' }}>{formatKRW(calculation.vatAmount)}</td>
              </tr>
              <tr style={{ backgroundColor: '#000' }}>
                <td style={{ padding: '13px 14px', fontWeight: '700', color: '#fff', fontSize: '12px' }}>최종 합계 (VAT 포함)</td>
                <td style={{ padding: '13px 14px', fontWeight: '800', color: '#fff', textAlign: 'right', fontSize: '16px' }}>{formatKRW(calculation.totalAmount)}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ textAlign: 'right', marginTop: '6px', fontSize: '11px', color: '#aaa' }}>
            연간 {formatKRW(calculation.totalAmount * 12)} 수준
          </div>
        </div>

        {/* 안내사항 */}
        {notes && (
          <div style={{ backgroundColor: '#f8f8f8', border: '1px solid #e8e8e8', borderRadius: '6px', padding: '14px 16px', marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#666', marginBottom: '6px', letterSpacing: '0.5px' }}>안내사항</div>
            <p style={{ fontSize: '12px', color: '#444', lineHeight: '1.7', whiteSpace: 'pre-wrap', margin: 0 }}>{notes}</p>
          </div>
        )}

        {/* 하단: 유효기간 + 담당자 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', borderTop: '1px solid #e8e8e8' }}>
          <div style={{ fontSize: '11px', color: '#aaa', lineHeight: '1.7' }}>
            <div>견적 유효기간 · {formatDate(quote.validUntil)}</div>
            <div>본 견적서는 현장 실사 후 변동될 수 있습니다.</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#000', marginBottom: '2px' }}>주식회사 이십사쩜칠</div>
            <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.7' }}>
              <div>대표이사 이선욱</div>
              <div>070-4102-2407 · 24.7@24dot7company.com</div>
              <div>buddie.kr</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #root > div > header { display: none !important; }
          main { padding: 0 !important; max-width: 100% !important; }
          .no-print + div > div { border: none !important; border-radius: 0 !important; padding: 24px !important; }
        }
      `}</style>
    </div>
  )
}
