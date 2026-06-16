import type { QuoteCalculation } from '../types/quote'

const HOURLY_RATE = 25000
const WEEKS_PER_MONTH = 4.34
const VAT_RATE = 0.1

export function calculateQuote(
  dailyHours: number,
  daysPerWeek: number,
  hourlyRate: number = HOURLY_RATE,
  weeksPerMonth: number = WEEKS_PER_MONTH
): QuoteCalculation {
  const monthlyAmount = Math.round(dailyHours * hourlyRate * daysPerWeek * weeksPerMonth)
  const vatAmount = Math.round(monthlyAmount * VAT_RATE)
  const totalAmount = monthlyAmount + vatAmount

  return {
    dailyHours,
    hourlyRate,
    daysPerWeek,
    weeksPerMonth,
    monthlyAmount,
    vatAmount,
    totalAmount,
  }
}

export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function getValidUntilDate(createdAt: string, days = 30): string {
  const d = new Date(createdAt)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}
