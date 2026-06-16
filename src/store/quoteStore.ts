import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Quote } from '../types/quote'
import { generateId, getValidUntilDate } from '../lib/quoteCalculator'

interface QuoteStore {
  quotes: Quote[]
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => Quote
  updateQuote: (id: string, updates: Partial<Quote>) => void
  deleteQuote: (id: string) => void
  getQuote: (id: string) => Quote | undefined
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      quotes: [],

      addQuote: (quoteData) => {
        const now = new Date().toISOString()
        const quote: Quote = {
          ...quoteData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          validUntil: quoteData.validUntil || getValidUntilDate(now),
        }
        set((state) => ({ quotes: [quote, ...state.quotes] }))
        return quote
      },

      updateQuote: (id, updates) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q
          ),
        }))
      },

      deleteQuote: (id) => {
        set((state) => ({ quotes: state.quotes.filter((q) => q.id !== id) }))
      },

      getQuote: (id) => get().quotes.find((q) => q.id === id),
    }),
    { name: 'ob-quotes' }
  )
)
