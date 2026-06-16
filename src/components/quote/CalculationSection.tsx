import { useEffect } from 'react'
import type { QuoteCalculation } from '../../types/quote'
import { calculateQuote, formatKRW } from '../../lib/quoteCalculator'

interface Props {
  calculation: QuoteCalculation
  onChange: (updated: QuoteCalculation) => void
}

export default function CalculationSection({ calculation, onChange }: Props) {
  const { dailyHours, daysPerWeek, hourlyRate, weeksPerMonth } = calculation

  useEffect(() => {
    const updated = calculateQuote(dailyHours, daysPerWeek, hourlyRate, weeksPerMonth)
    if (updated.monthlyAmount !== calculation.monthlyAmount) {
      onChange(updated)
    }
  }, [dailyHours, daysPerWeek, hourlyRate, weeksPerMonth])

  const handleChange = (field: keyof QuoteCalculation, value: number) => {
    onChange({ ...calculation, [field]: value })
  }

  const inputCls = 'w-full text-[14px] text-black border border-black/10 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition-colors'

  return (
    <div className="bg-white rounded-2xl border border-black/8 p-6 mb-3">
      <h2 className="text-[13px] font-semibold text-black mb-4 uppercase tracking-wide">견적 산출</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { field: 'dailyHours', label: '투입 시간 (일)', unit: '시간', step: 0.5 },
          { field: 'hourlyRate', label: '시간당 비용', unit: '원', step: 1000 },
          { field: 'daysPerWeek', label: '주 방문 횟수', unit: '회', step: 1 },
          { field: 'weeksPerMonth', label: '월 환산 주수', unit: '주', step: 0.01 },
        ].map(({ field, label, unit, step }) => (
          <div key={field}>
            <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-1.5">{label}</label>
            <div className="relative">
              <input
                type="number"
                value={calculation[field as keyof QuoteCalculation]}
                onChange={(e) => handleChange(field as keyof QuoteCalculation, parseFloat(e.target.value) || 0)}
                step={step}
                min={0}
                className={inputCls}
                style={{ fontFamily: 'inherit' }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 합계 영역 */}
      <div className="border border-black/8 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b border-black/6">
          <span className="text-[13px] text-neutral-500">합계</span>
          <span className="text-[14px] font-medium text-black">{formatKRW(calculation.monthlyAmount)}</span>
        </div>
        <div className="flex justify-between items-center px-4 py-3 border-b border-black/6">
          <span className="text-[13px] text-neutral-500">부가가치세 (10%)</span>
          <span className="text-[14px] text-neutral-500">{formatKRW(calculation.vatAmount)}</span>
        </div>
        <div className="flex justify-between items-center px-4 py-4 bg-black">
          <span className="text-[13px] font-semibold text-white">최종 합계 (VAT 포함)</span>
          <span className="text-[20px] font-bold text-white">{formatKRW(calculation.totalAmount)}</span>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-3 text-[12px] text-neutral-400">
        <span>연간 {formatKRW(calculation.totalAmount * 12)}</span>
        <span>·</span>
        <span>일 환산 {formatKRW(Math.round(calculation.totalAmount / 30))}</span>
      </div>
    </div>
  )
}
