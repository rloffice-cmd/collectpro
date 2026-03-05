import { supabase } from './supabase'
import type { Card } from '../types/card'

export type CardInsert = Omit<Card, 'id' | 'created_at' | 'updated_at' | 'user_id'>

export async function getCards(filters?: {
  game?: string
  search?: string
  rarity?: string
  condition?: string
}) {
  let query = supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.game) query = query.eq('game', filters.game)
  if (filters?.rarity) query = query.eq('rarity', filters.rarity)
  if (filters?.condition) query = query.eq('condition', filters.condition)
  if (filters?.search) query = query.ilike('name', `%${filters.search}%`)

  const { data, error } = await query
  if (error) throw error
  return data as Card[]
}

export async function getCard(id: string) {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Card
}

export async function createCard(card: CardInsert) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('cards')
    .insert({ ...card, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data as Card
}

export async function updateCard(id: string, updates: Partial<CardInsert>) {
  const { data, error } = await supabase
    .from('cards')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Card
}

export async function deleteCard(id: string) {
  const { error } = await supabase.from('cards').delete().eq('id', id)
  if (error) throw error
}

export async function getCardStats() {
  const { data, error } = await supabase.from('cards').select('*')
  if (error) throw error
  const cards = data as Card[]

  return {
    totalCards: cards.reduce((sum, c) => sum + c.quantity, 0),
    uniqueCards: cards.length,
    totalValue: cards.reduce((sum, c) => sum + (c.estimated_value || 0) * c.quantity, 0),
    byGame: cards.reduce((acc, c) => {
      acc[c.game] = (acc[c.game] || 0) + c.quantity
      return acc
    }, {} as Record<string, number>),
    byRarity: cards.reduce((acc, c) => {
      if (c.rarity) acc[c.rarity] = (acc[c.rarity] || 0) + c.quantity
      return acc
    }, {} as Record<string, number>),
    byCondition: cards.reduce((acc, c) => {
      acc[c.condition] = (acc[c.condition] || 0) + c.quantity
      return acc
    }, {} as Record<string, number>),
  }
}
