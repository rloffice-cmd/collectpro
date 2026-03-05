import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowRight } from 'lucide-react'
import type { Card, CardGame, CardCondition, CardRarity } from '../../types/card'
import type { CardInsert } from '../../lib/cards'
import { createCard, updateCard } from '../../lib/cards'

const GAMES: { value: CardGame; label: string }[] = [
  { value: 'pokemon', label: 'Pokemon' },
  { value: 'magic', label: 'Magic: The Gathering' },
  { value: 'yugioh', label: 'Yu-Gi-Oh!' },
  { value: 'one_piece', label: 'One Piece' },
  { value: 'other', label: 'אחר' },
]

const CONDITIONS: { value: CardCondition; label: string }[] = [
  { value: 'mint', label: 'Mint' },
  { value: 'near_mint', label: 'Near Mint' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'light_played', label: 'Light Played' },
  { value: 'played', label: 'Played' },
  { value: 'poor', label: 'Poor' },
]

const RARITIES: { value: CardRarity; label: string }[] = [
  { value: 'common', label: 'Common' },
  { value: 'uncommon', label: 'Uncommon' },
  { value: 'rare', label: 'Rare' },
  { value: 'ultra_rare', label: 'Ultra Rare' },
  { value: 'secret_rare', label: 'Secret Rare' },
  { value: 'promo', label: 'Promo' },
]

interface CardFormProps {
  card?: Card
}

export default function CardForm({ card }: CardFormProps) {
  const navigate = useNavigate()
  const isEdit = !!card

  const [form, setForm] = useState<CardInsert>({
    name: card?.name ?? '',
    game: card?.game ?? 'pokemon',
    set_name: card?.set_name ?? null,
    card_number: card?.card_number ?? null,
    rarity: card?.rarity ?? null,
    condition: card?.condition ?? 'near_mint',
    language: card?.language ?? 'en',
    is_foil: card?.is_foil ?? false,
    is_first_edition: card?.is_first_edition ?? false,
    quantity: card?.quantity ?? 1,
    purchase_price: card?.purchase_price ?? null,
    estimated_value: card?.estimated_value ?? null,
    image_url: card?.image_url ?? null,
    notes: card?.notes ?? null,
    tags: card?.tags ?? [],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof CardInsert>(key: K, value: CardInsert[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('שם הקלף הוא שדה חובה'); return }
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await updateCard(card.id, form)
      } else {
        await createCard(form)
      }
      navigate('/cards')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בשמירה')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full px-3 py-2 border rounded-lg bg-background text-sm'
  const labelClass = 'block text-sm font-medium mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-4">
        <button type="button" onClick={() => navigate('/cards')} className="text-muted-foreground hover:text-foreground">
          <ArrowRight className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold">{isEdit ? 'עריכת קלף' : 'הוספת קלף חדש'}</h2>
      </div>

      {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelClass}>שם הקלף *</label>
          <input className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} placeholder="למשל: Charizard VMAX" />
        </div>

        <div>
          <label className={labelClass}>משחק *</label>
          <select className={inputClass} value={form.game} onChange={e => set('game', e.target.value as CardGame)}>
            {GAMES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>מצב *</label>
          <select className={inputClass} value={form.condition} onChange={e => set('condition', e.target.value as CardCondition)}>
            {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>סט</label>
          <input className={inputClass} value={form.set_name ?? ''} onChange={e => set('set_name', e.target.value || null)} placeholder="למשל: Sword & Shield" />
        </div>

        <div>
          <label className={labelClass}>מספר קלף</label>
          <input className={inputClass} value={form.card_number ?? ''} onChange={e => set('card_number', e.target.value || null)} placeholder="למשל: 074/073" />
        </div>

        <div>
          <label className={labelClass}>נדירות</label>
          <select className={inputClass} value={form.rarity ?? ''} onChange={e => set('rarity', (e.target.value || null) as CardRarity | null)}>
            <option value="">לא צוין</option>
            {RARITIES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>כמות</label>
          <input type="number" min={1} className={inputClass} value={form.quantity} onChange={e => set('quantity', parseInt(e.target.value) || 1)} />
        </div>

        <div>
          <label className={labelClass}>מחיר רכישה</label>
          <input type="number" step="0.01" min={0} className={inputClass} value={form.purchase_price ?? ''} onChange={e => set('purchase_price', e.target.value ? parseFloat(e.target.value) : null)} />
        </div>

        <div>
          <label className={labelClass}>שווי מוערך</label>
          <input type="number" step="0.01" min={0} className={inputClass} value={form.estimated_value ?? ''} onChange={e => set('estimated_value', e.target.value ? parseFloat(e.target.value) : null)} />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_foil} onChange={e => set('is_foil', e.target.checked)} className="rounded" />
            פויל (Foil)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_first_edition} onChange={e => set('is_first_edition', e.target.checked)} className="rounded" />
            מהדורה ראשונה (1st Ed)
          </label>
        </div>

        <div>
          <label className={labelClass}>שפה</label>
          <input className={inputClass} value={form.language} onChange={e => set('language', e.target.value)} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>URL תמונה</label>
          <input className={inputClass} value={form.image_url ?? ''} onChange={e => set('image_url', e.target.value || null)} placeholder="https://..." />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>הערות</label>
          <textarea className={inputClass} rows={3} value={form.notes ?? ''} onChange={e => set('notes', e.target.value || null)} />
        </div>
      </div>

      <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50">
        <Save className="h-4 w-4" />
        {saving ? 'שומר...' : isEdit ? 'עדכן קלף' : 'הוסף קלף'}
      </button>
    </form>
  )
}
