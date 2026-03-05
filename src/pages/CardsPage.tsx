import { useEffect, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, ArrowUpDown, Download } from 'lucide-react'
import type { Card, CardGame } from '../types/card'
import { getCards, deleteCard } from '../lib/cards'
import { exportCardsToCSV } from '../lib/export'
import CardItem from '../components/cards/CardItem'

const GAME_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'כל המשחקים' },
  { value: 'pokemon', label: 'Pokemon' },
  { value: 'magic', label: 'Magic' },
  { value: 'yugioh', label: 'Yu-Gi-Oh!' },
  { value: 'one_piece', label: 'One Piece' },
  { value: 'other', label: 'אחר' },
]

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'date_desc', label: 'חדש ביותר' },
  { value: 'date_asc', label: 'ישן ביותר' },
  { value: 'name_asc', label: 'שם (א-ת)' },
  { value: 'name_desc', label: 'שם (ת-א)' },
  { value: 'value_desc', label: 'שווי (גבוה לנמוך)' },
  { value: 'value_asc', label: 'שווי (נמוך לגבוה)' },
]

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [gameFilter, setGameFilter] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')

  const loadCards = useCallback(async () => {
    try {
      const data = await getCards({
        search: searchQuery || undefined,
        game: (gameFilter || undefined) as CardGame | undefined,
      })
      setCards(data)
    } catch (err) {
      console.error('Error loading cards:', err)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, gameFilter])

  useEffect(() => { loadCards() }, [loadCards])

  const sortedCards = useMemo(() => {
    const sorted = [...cards]
    switch (sortBy) {
      case 'date_asc': return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      case 'name_asc': return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'name_desc': return sorted.sort((a, b) => b.name.localeCompare(a.name))
      case 'value_desc': return sorted.sort((a, b) => (b.estimated_value ?? 0) - (a.estimated_value ?? 0))
      case 'value_asc': return sorted.sort((a, b) => (a.estimated_value ?? 0) - (b.estimated_value ?? 0))
      default: return sorted
    }
  }, [cards, sortBy])

  async function handleDelete(id: string) {
    if (!confirm('בטוח שאתה רוצה למחוק את הקלף?')) return
    try {
      await deleteCard(id)
      setCards(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Error deleting card:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">הקלפים שלי</h2>
        <div className="flex gap-2">
          {cards.length > 0 && (
            <button onClick={() => exportCardsToCSV(cards)} className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">ייצוא CSV</span>
            </button>
          )}
          <Link to="/cards/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            <Plus className="h-4 w-4" />
            הוסף קלף
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="חפש קלפים..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border rounded-lg bg-background text-sm"
          />
        </div>
        <select value={gameFilter} onChange={e => setGameFilter(e.target.value)} className="px-3 py-2 border rounded-lg bg-background text-sm">
          {GAME_FILTERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 border rounded-lg bg-background text-sm">
            {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : sortedCards.length === 0 ? (
        <div className="bg-card border rounded-xl p-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery || gameFilter ? 'לא נמצאו קלפים התואמים לחיפוש' : 'עדיין אין קלפים באוסף. הוסף את הקלף הראשון שלך!'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{sortedCards.length} קלפים</p>
          <div className="grid gap-3">
            {sortedCards.map(card => (
              <CardItem key={card.id} card={card} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
