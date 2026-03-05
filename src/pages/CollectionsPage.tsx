import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, FolderOpen, Globe, Lock } from 'lucide-react'
import type { Collection } from '../types/card'
import { getCollections, createCollection, deleteCollection, updateCollection } from '../lib/collections'

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)

  async function load() {
    try {
      const data = await getCollections()
      setCollections(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function resetForm() {
    setName('')
    setDescription('')
    setIsPublic(false)
    setShowForm(false)
    setEditingId(null)
  }

  function startEdit(c: Collection) {
    setEditingId(c.id)
    setName(c.name)
    setDescription(c.description ?? '')
    setIsPublic(c.is_public)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await updateCollection(editingId, { name, description: description || null, is_public: isPublic })
      } else {
        await createCollection({ name, description: description || null, is_public: isPublic })
      }
      resetForm()
      await load()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('בטוח שאתה רוצה למחוק את האוסף?')) return
    try {
      await deleteCollection(id)
      setCollections(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">אוספים</h2>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
          <Plus className="h-4 w-4" />
          אוסף חדש
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-medium">{editingId ? 'עריכת אוסף' : 'אוסף חדש'}</h3>
          <input className="w-full px-3 py-2 border rounded-lg bg-background text-sm" placeholder="שם האוסף *" value={name} onChange={e => setName(e.target.value)} />
          <textarea className="w-full px-3 py-2 border rounded-lg bg-background text-sm" placeholder="תיאור (אופציונלי)" rows={2} value={description} onChange={e => setDescription(e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="rounded" />
            אוסף ציבורי
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
              {saving ? 'שומר...' : editingId ? 'עדכן' : 'צור אוסף'}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg text-sm">ביטול</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : collections.length === 0 ? (
        <div className="bg-card border rounded-xl p-8 text-center">
          <p className="text-muted-foreground">עדיין אין אוספים. צור את האוסף הראשון שלך!</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {collections.map(c => (
            <div key={c.id} className="bg-card border rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{c.name}</h3>
                </div>
                <div className="flex gap-1">
                  {c.is_public ? <Globe className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                  <button onClick={() => startEdit(c)} className="p-1 hover:bg-muted rounded-md text-muted-foreground"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-1 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              {c.description && <p className="text-sm text-muted-foreground">{c.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
