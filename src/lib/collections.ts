import { supabase } from './supabase'
import type { Collection } from '../types/card'

export type CollectionInsert = Pick<Collection, 'name' | 'description' | 'is_public'>

export async function getCollections() {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Collection[]
}

export async function getCollection(id: string) {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Collection
}

export async function createCollection(collection: CollectionInsert) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('collections')
    .insert({ ...collection, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data as Collection
}

export async function updateCollection(id: string, updates: Partial<CollectionInsert>) {
  const { data, error } = await supabase
    .from('collections')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Collection
}

export async function deleteCollection(id: string) {
  const { error } = await supabase.from('collections').delete().eq('id', id)
  if (error) throw error
}

export async function getCollectionCards(collectionId: string) {
  const { data, error } = await supabase
    .from('collection_cards')
    .select('card_id, added_at, cards(*)')
    .eq('collection_id', collectionId)
  if (error) throw error
  return data
}

export async function addCardToCollection(collectionId: string, cardId: string) {
  const { error } = await supabase
    .from('collection_cards')
    .insert({ collection_id: collectionId, card_id: cardId })
  if (error) throw error
}

export async function removeCardFromCollection(collectionId: string, cardId: string) {
  const { error } = await supabase
    .from('collection_cards')
    .delete()
    .eq('collection_id', collectionId)
    .eq('card_id', cardId)
  if (error) throw error
}
