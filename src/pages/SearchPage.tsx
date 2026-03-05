import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import type { Card, CardGame } from '../types/card'
import { getCards } from '../lib/cards'
import CardItem from '../components/cards/CardItem'
import { deleteCard } from '../lib/cards'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [game, setGame] = useState('')
  const [rarity, setRarity] = useState('')
  const [condition, setCondition] = useState('')
  const [results, setResults] = useState<Card[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query && !game && !rarity && !condition) { setSearched(false); setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await getCards({
          search: query || undefined,
          game: (game || undefined) as CardGame | undefined,
          rarity: rarity || undefined,
          condition: condition || undefined,
        })
        setResults(data)
        setSearched(true)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, game, rarity, condition])

  async function handleDelete(id: string) {
    if (!confirm('בטוח שאתה רוצה למחוק את הקלף?')) return
    try {
      await deleteCard(id)
      setResults(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Error deleting card:', err)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">חיפוש מתקדם</h2>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" placeholder="חפש לפי שם, סט, או מספר קלף..." value={query} onChange={e => setQuery(e.target.value)} className="w-full pr-10 pl-4 py-3 border rounded-lg bg-background" />
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={game} onChange={e => setGame(e.target.value)} className="px-3 py-2 border rounded-lg bg-background text-sm">
          <option value="">כל המשחקים</option>
          <option value="pokemon">Pokemon</option>
          <option value="magic">Magic</option>
          <option value="yugioh">Yu-Gi-Oh!</option>
          <option value="one_piece">One Piece</option>
          <option value="other">אחר</option>
        </select>
        <select value={rarity} onChange={e => setRarity(e.target.value)} className="px-3 py-2 border rounded-lg bg-background text-sm">
          <option value="">כל הנדירויות</option>
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="ultra_rare">Ultra Rare</option>
          <option value="secret_rare">Secret Rare</option>
          <option value="promo">Promo</option>
        </select>
        <select value={condition} onChange={e => setCondition(e.target.value)} className="px-3 py-2 border rounded-lg bg-background text-sm">
          <option value="">כל המצבים</option>
          <option value="mint">Mint</option>
          <option value="near_mint">Near Mint</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="light_played">Light Played</option>
          <option value="played">Played</option>
          <option value="poor">Poor</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : !searched ? (
        <div className="bg-card border rounded-xl p-8 text-center">
          <p className="text-muted-foreground">הקלד מונח חיפוש או בחר פילטרים כדי למצוא קלפים</p>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-card border rounded-xl p-8 text-center">
          <p className="text-muted-foreground">לא נמצאו תוצאות</p>
        </div>
      ) : (
        <div className="grid gap-3">
          <p className="text-sm text-muted-foreground">{results.length} תוצאות</p>
          {results.map(card => <CardItem key={card.id} card={card} onDelete={handleDelete} />)}
        </div>
      )}
    </div>
  )
}
