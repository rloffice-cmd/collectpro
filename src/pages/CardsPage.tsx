import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import type { Card, CardGame } from '../types/card'
import { getCards, deleteCard } from '../lib/cards'
import CardItem from '../components/cards/CardItem'

const GAME_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'כל המשחקים' },
  { value: 'pokemon', label: 'Pokemon' },
  { value: 'magic', label: 'Magic' },
  { value: 'yugioh', label: 'Yu-Gi-Oh!' },
  { value: 'one_piece', label: 'One Piece' },
  { value: 'other', label: 'אחר' },
]

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [gameFilter, setGameFilter] = useState('')

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
        <Link to="/cards/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
          <Plus className="h-4 w-4" />
          הוסף קלף
        </Link>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="חפש קלפים..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border rounded-lg bg-background text-sm"
          />
        </div>
        <select
          value={gameFilter}
          onChange={e => setGameFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg bg-background text-sm"
        >
          {GAME_FILTERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-card border rounded-xl p-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery || gameFilter ? 'לא נמצאו קלפים התואמים לחיפוש' : 'עדיין אין קלפים באוסף. הוסף את הקלף הראשון שלך!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {cards.map(card => (
            <CardItem key={card.id} card={card} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
