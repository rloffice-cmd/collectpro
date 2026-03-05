import { supabase } from "./supabase";

export interface Collection {
  id: string;
    user_id: string;
      name: string;
        description: string | null;
          cover_image_url: string | null;
            is_public: boolean;
              created_at: string;
                updated_at: string;
                }

                export async function getCollections(userId: string) {
                  const { data, error } = await supabase
                      .from("collections")
                          .select("*")
                              .eq("user_id", userId)
                                  .order("created_at", { ascending: false });
                                    if (error) throw error;
                                      return data as Collection[];
                                      }

                                      export async function createCollection(collection: { user_id: string; name: string; description?: string; is_public?: boolean }) {
                                        const { data, error } = await supabase
                                            .from("collections")
                                                .insert(collection)
                                                    .select()
                                                        .single();
                                                          if (error) throw error;
                                                            return data as Collection;
                                                            }

                                                            export async function updateCollection(id: string, updates: Partial<Collection>) {
                                                              const { data, error } = await supabase
                                                                  .from("collections")
                                                                      .update(updates)
                                                                          .eq("id", id)
                                                                              .select()
                                                                                  .single();
                                                                                    if (error) throw error;
                                                                                      return data as Collection;
                                                                                      }

                                                                                      export async function deleteCollection(id: string) {
                                                                                        const { error } = await supabase.from("collections").delete().eq("id", id);
                                                                                          if (error) throw error;
                                                                                          }

                                                                                          export async function addCardToCollection(collectionId: string, cardId: string) {
                                                                                            const { error } = await supabase
                                                                                                .from("collection_cards")
                                                                                                    .insert({ collection_id: collectionId, card_id: cardId });
                                                                                                      if (error) throw error;
                                                                                                      }

                                                                                                      export async function removeCardFromCollection(collectionId: string, cardId: string) {
                                                                                                        const { error } = await supabase
                                                                                                            .from("collection_cards")
                                                                                                                .delete()
                                                                                                                    .eq("collection_id", collectionId)
                                                                                                                        .eq("card_id", cardId);
                                                                                                                          if (error) throw error;
                                                                                                                          }

                                                                                                                          export async function getCollectionCards(collectionId: string) {
                                                                                                                            const { data, error } = await supabase
                                                                                                                                .from("collection_cards")
                                                                                                                                    .select("card_id, cards(*)")
                                                                                                                                        .eq("collection_id", collectionId);
                                                                                                                                          if (error) throw error;
                                                                                                                                            return data;
                                                                                                                                            }

                                                                                                                                            export async function getCollectionCount(userId: string) {
                                                                                                                                              const { count, error } = await supabase
                                                                                                                                                  .from("collections")
                                                                                                                                                      .select("*", { count: "exact", head: true })
                                                                                                                                                          .eq("user_id", userId);
                                                                                                                                                            if (error) throw error;
                                                                                                                                                              return count || 0;
                                                                                                                                                              }