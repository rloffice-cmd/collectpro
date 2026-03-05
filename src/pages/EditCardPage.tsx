import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCard } from '../lib/cards'
import type { Card } from '../types/card'
import CardForm from '../components/cards/CardForm'

export default function EditCardPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { navigate('/cards'); return }
    getCard(id)
      .then(setCard)
      .catch(() => navigate('/cards'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!card) return null

  return <CardForm card={card} />
}
