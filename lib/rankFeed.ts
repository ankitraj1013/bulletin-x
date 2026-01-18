import { getSignals } from './feedSignals'

const NOW = Date.now()

function timeDecay(ts: number) {
  const hours = (NOW - ts) / (1000 * 60 * 60)
  return Math.exp(-hours / 24) // 24h half-life
}

export function rankArticles(
  articles: any[],
  userInterests: string[]
) {
  const signals = getSignals()

  const categoryScore: Record<string, number> = {}
  const sourceScore: Record<string, number> = {}

  // Base interest boost
  userInterests.forEach(c => {
    categoryScore[c] = 6
  })

  // Learn from behavior
  signals.forEach(s => {
    const decay = timeDecay(s.viewedAt)

    if (s.dwellTime > 4000) {
      categoryScore[s.category] =
        (categoryScore[s.category] || 0) + 3 * decay

      sourceScore[s.source] =
        (sourceScore[s.source] || 0) + 2 * decay
    }

    if (s.liked || s.bookmarked) {
      categoryScore[s.category] =
        (categoryScore[s.category] || 0) + 5 * decay
    }

    if (s.skipped) {
      categoryScore[s.category] =
        (categoryScore[s.category] || 0) - 1 * decay
    }
  })

  return [...articles].sort((a, b) => {
    const freshnessA =
      1 / Math.max(1, (NOW - new Date(a.publishedAt).getTime()) / 3.6e6)

    const freshnessB =
      1 / Math.max(1, (NOW - new Date(b.publishedAt).getTime()) / 3.6e6)

    const scoreA =
      (categoryScore[a.category] || 0) +
      (sourceScore[a.source.name] || 0) +
      freshnessA

    const scoreB =
      (categoryScore[b.category] || 0) +
      (sourceScore[b.source.name] || 0) +
      freshnessB

    return scoreB - scoreA
  })
}
