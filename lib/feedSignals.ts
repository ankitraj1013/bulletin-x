'use client'

export type FeedSignal = {
  articleId: string
  category: string
  source: string
  viewedAt: number
  dwellTime: number
  liked?: boolean
  bookmarked?: boolean
  skipped?: boolean
}

const STORAGE_KEY = 'bx_feed_signals'
const MAX_SIGNALS = 500

export function getSignals(): FeedSignal[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveSignal(signal: FeedSignal) {
  if (typeof window === 'undefined') return

  const signals = getSignals()
  signals.push(signal)

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(signals.slice(-MAX_SIGNALS))
  )
}
