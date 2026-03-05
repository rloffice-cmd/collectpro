import { useEffect, useState } from 'react'
import { getCardStats } from '../lib/cards'

const GAME_LABELS: Record<string, string> = {
  pokemon: 'Pokemon', magic: 'Magic', yugioh: 'Yu-Gi-Oh!', one_piece: 'One Piece', other: 'אחר',
}
const RARITY_LABELS: Record<string, string> = {
  common: 'Common', uncommon: 'Uncommon', rare: 'Rare', ultra_rare: 'Ultra Rare', secret_rare: 'Secret Rare', promo: 'Promo',
}
const CONDITION_LABELS: Record<string, string> = {
  mint: 'Mint', near_mint: 'NM', excellent: 'EX', good: 'Good', light_played: 'LP', played: 'PL', poor: 'Poor',
}

const BAR_COLORS = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500', 'bg-cyan-500', 'bg-red-500']

function BarChart({ data, labels }: { data: Record<string, number>; labels: Record<string, string> }) {
  const entries = Object.entries(data).filter(([, v]) => v > 0)
  if (entries.length === 0) return <p className="text-sm text-muted-foreground">אין נתונים</p>
  const max = Math.max(...entries.map(([, v]) => v))

  return (
    <div className="space-y-2">
      {entries.map(([key, value], i) => (
        <div key={key} className="flex items-center gap-3">
          <span className="text-xs w-20 text-left shrink-0">{labels[key] ?? key}</span>
          <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden">
            <div className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`} style={{ width: `${(value / max) * 100}%` }} />
          </div>
          <span className="text-xs font-medium w-8 text-left">{value}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getCardStats>> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCardStats().then(setStats).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!stats || stats.totalCards === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">ניתוח אוסף</h2>
        <div className="bg-card border rounded-xl p-8 text-center">
          <p className="text-muted-foreground">הוסף קלפים כדי לראות סטטיסטיקות</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">ניתוח אוסף</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-5 text-center">
          <p className="text-3xl font-bold">{stats.totalCards}</p>
          <p className="text-sm text-muted-foreground">סה"כ קלפים</p>
        </div>
        <div className="bg-card border rounded-xl p-5 text-center">
          <p className="text-3xl font-bold">{stats.uniqueCards}</p>
          <p className="text-sm text-muted-foreground">קלפים ייחודיים</p>
        </div>
        <div className="bg-card border rounded-xl p-5 text-center">
          <p className="text-3xl font-bold">${stats.totalValue.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">שווי כולל</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-medium mb-4">התפלגות לפי משחק</h3>
          <BarChart data={stats.byGame} labels={GAME_LABELS} />
        </div>
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-medium mb-4">התפלגות לפי נדירות</h3>
          <BarChart data={stats.byRarity} labels={RARITY_LABELS} />
        </div>
        <div className="bg-card border rounded-xl p-6 md:col-span-2">
          <h3 className="font-medium mb-4">התפלגות לפי מצב</h3>
          <BarChart data={stats.byCondition} labels={CONDITION_LABELS} />
        </div>
      </div>
    </div>
  )
}
