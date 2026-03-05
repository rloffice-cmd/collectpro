import { Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Card } from '../../types/card'

const GAME_LABELS: Record<string, string> = {
  pokemon: 'Pokemon',
  magic: 'Magic',
  yugioh: 'Yu-Gi-Oh!',
  one_piece: 'One Piece',
  other: 'אחר',
}

const CONDITION_LABELS: Record<string, string> = {
  mint: 'Mint',
  near_mint: 'NM',
  excellent: 'EX',
  good: 'Good',
  light_played: 'LP',
  played: 'PL',
  poor: 'Poor',
}

const RARITY_COLORS: Record<string, string> = {
  common: 'bg-gray-100 text-gray-700',
  uncommon: 'bg-green-100 text-green-700',
  rare: 'bg-blue-100 text-blue-700',
  ultra_rare: 'bg-purple-100 text-purple-700',
  secret_rare: 'bg-yellow-100 text-yellow-700',
  promo: 'bg-pink-100 text-pink-700',
}

interface CardItemProps {
  card: Card
  onDelete: (id: string) => void
}

export default function CardItem({ card, onDelete }: CardItemProps) {
  return (
    <div className="bg-card border rounded-xl p-4 flex gap-4 hover:shadow-sm transition-shadow">
      {card.image_url ? (
        <img src={card.image_url} alt={card.name} className="w-20 h-28 object-cover rounded-lg" />
      ) : (
        <div className="w-20 h-28 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
          אין תמונה
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold truncate">{card.name}</h3>
            <p className="text-sm text-muted-foreground">{GAME_LABELS[card.game]}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Link to={`/cards/${card.id}/edit`} className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground" aria-label="ערוך קלף">
              <Pencil className="h-4 w-4" />
            </Link>
            <button onClick={() => onDelete(card.id)} className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive" aria-label="מחק קלף">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{CONDITION_LABELS[card.condition]}</span>
          {card.rarity && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${RARITY_COLORS[card.rarity]}`}>
              {card.rarity.replaceAll('_', ' ')}
            </span>
          )}
          {card.is_foil && <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">פויל</span>}
          {card.is_first_edition && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">מהד' ראשונה</span>}
          {card.quantity > 1 && <span className="text-xs px-2 py-0.5 bg-muted rounded-full">x{card.quantity}</span>}
        </div>

        {card.estimated_value != null && (
          <p className="text-sm font-medium mt-2">${card.estimated_value.toFixed(2)}</p>
        )}
      </div>
    </div>
  )
}
