import { useEffect, useState } from 'react'
import { CreditCard, FolderOpen, TrendingUp, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCardStats } from '../lib/cards'
import { getCollections } from '../lib/collections'

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalCards: 0, uniqueCards: 0, totalValue: 0, byGame: {} as Record<string, number>, byRarity: {} as Record<string, number>, byCondition: {} as Record<string, number> })
  const [collectionsCount, setCollectionsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([getCardStats(), getCollections()])
      .then(([cardStats, collections]) => {
        if (cancelled) return
        setStats(cardStats)
        setCollectionsCount(collections.length)
      })
      .catch(err => {
        if (cancelled) return
        setError('שגיאה בטעינת הנתונים')
        console.error(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const statCards = [
    { label: 'סה"כ קלפים', value: stats.totalCards.toString(), icon: CreditCard, color: 'text-blue-500' },
    { label: 'אוספים', value: collectionsCount.toString(), icon: FolderOpen, color: 'text-green-500' },
    { label: 'שווי כולל', value: `$${stats.totalValue.toFixed(2)}`, icon: TrendingUp, color: 'text-purple-500' },
  ]

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">דשבורד</h2>
        <Link to="/cards/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          הוסף קלף
        </Link>
      </div>

      {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(stat => (
          <div key={stat.label} className="bg-card border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.totalCards === 0 && !error && (
        <div className="bg-card border rounded-xl p-8 text-center">
          <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">האוסף שלך ריק</h3>
          <p className="text-sm text-muted-foreground mb-4">התחל להוסיף קלפים לאוסף שלך</p>
          <Link to="/cards/new" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            <Plus className="h-4 w-4" />
            הוסף את הקלף הראשון
          </Link>
        </div>
      )}
    </div>
  )
}
