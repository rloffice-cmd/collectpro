import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [favoriteGame, setFavoriteGame] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name ?? '')
          setBio(data.bio ?? '')
          setFavoriteGame(data.favorite_game ?? '')
        }
        setLoading(false)
      })
  }, [user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setSaved(false)
    try {
      await supabase.from('profiles').update({
        display_name: displayName || null,
        bio: bio || null,
        favorite_game: favoriteGame || null,
      }).eq('id', user.id)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-2xl font-bold">הגדרות</h2>

      <div className="bg-card border rounded-xl p-6 space-y-2">
        <h3 className="font-medium">פרטי חשבון</h3>
        <div>
          <label className="text-sm text-muted-foreground">אימייל</label>
          <p className="text-sm">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-card border rounded-xl p-6 space-y-4">
        <h3 className="font-medium">פרופיל</h3>
        <div>
          <label className="block text-sm font-medium mb-1">שם תצוגה</label>
          <input className="w-full px-3 py-2 border rounded-lg bg-background text-sm" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="השם שלך" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ביו</label>
          <textarea className="w-full px-3 py-2 border rounded-lg bg-background text-sm" rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="ספר על עצמך..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">משחק מועדף</label>
          <select className="w-full px-3 py-2 border rounded-lg bg-background text-sm" value={favoriteGame} onChange={e => setFavoriteGame(e.target.value)}>
            <option value="">לא צוין</option>
            <option value="pokemon">Pokemon</option>
            <option value="magic">Magic: The Gathering</option>
            <option value="yugioh">Yu-Gi-Oh!</option>
            <option value="one_piece">One Piece</option>
          </select>
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
          <Save className="h-4 w-4" />
          {saving ? 'שומר...' : saved ? 'נשמר!' : 'שמור שינויים'}
        </button>
      </form>
    </div>
  )
}
