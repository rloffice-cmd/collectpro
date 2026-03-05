import { supabase } from "./supabase";
import type { Card } from "@/types/card";

export async function getCards(userId: string) {
  const { data, error } = await supabase
      .from("cards")
          .select("*")
              .eq("user_id", userId)
                  .order("created_at", { ascending: false });
                    if (error) throw error;
                      return data as Card[];
                      }

                      export async function getCardById(id: string) {
                        const { data, error } = await supabase
                            .from("cards")
                                .select("*")
                                    .eq("id", id)
                                        .single();
                                          if (error) throw error;
                                            return data as Card;
                                            }

                                            export async function createCard(card: Omit<Card, "id" | "created_at" | "updated_at">) {
                                              const { data, error } = await supabase
                                                  .from("cards")
                                                      .insert(card)
                                                          .select()
                                                              .single();
                                                                if (error) throw error;
                                                                  return data as Card;
                                                                  }

                                                                  export async function updateCard(id: string, updates: Partial<Card>) {
                                                                    const { data, error } = await supabase
                                                                        .from("cards")
                                                                            .update(updates)
                                                                                .eq("id", id)
                                                                                    .select()
                                                                                        .single();
                                                                                          if (error) throw error;
                                                                                            return data as Card;
                                                                                            }

                                                                                            export async function deleteCard(id: string) {
                                                                                              const { error } = await supabase.from("cards").delete().eq("id", id);
                                                                                                if (error) throw error;
                                                                                                }

                                                                                                export async function searchCards(userId: string, query: string) {
                                                                                                  const { data, error } = await supabase
                                                                                                      .from("cards")
                                                                                                          .select("*")
                                                                                                              .eq("user_id", userId)
                                                                                                                  .ilike("name", `%${query}%`)
                                                                                                                      .order("created_at", { ascending: false });
                                                                                                                        if (error) throw error;
                                                                                                                          return data as Card[];
                                                                                                                          }

                                                                                                                          export async function getCardsByGame(userId: string, game: string) {
                                                                                                                            const { data, error } = await supabase
                                                                                                                                .from("cards")
                                                                                                                                    .select("*")
                                                                                                                                        .eq("user_id", userId)
                                                                                                                                            .eq("game", game)
                                                                                                                                                .order("created_at", { ascending: false });
                                                                                                                                                  if (error) throw error;
                                                                                                                                                    return data as Card[];
                                                                                                                                                    }

                                                                                                                                                    export async function getCardStats(userId: string) {
                                                                                                                                                      const { data, error } = await supabase
                                                                                                                                                          .from("cards")
                                                                                                                                                              .select("*")
                                                                                                                                                                  .eq("user_id", userId);
                                                                                                                                                                    if (error) throw error;
                                                                                                                                                                      const cards = data as Card[];
                                                                                                                                                                        const totalCards = cards.length;
                                                                                                                                                                          const totalValue = cards.reduce((sum, c) => sum + (c.estimated_value || 0), 0);
                                                                                                                                                                            const byGame: Record<string, number> = {};
                                                                                                                                                                              const byRarity: Record<string, number> = {};
                                                                                                                                                                                const byCondition: Record<string, number> = {};
                                                                                                                                                                                  for (const card of cards) {
                                                                                                                                                                                      byGame[card.game] = (byGame[card.game] || 0) + (card.quantity || 1);
                                                                                                                                                                                          if (card.rarity) byRarity[card.rarity] = (byRarity[card.rarity] || 0) + (card.quantity || 1);
                                                                                                                                                                                              byCondition[card.condition] = (byCondition[card.condition] || 0) + (card.quantity || 1);
                                                                                                                                                                                                }
                                                                                                                                                                                                  return { totalCards, totalValue, byGame, byRarity, byCondition };
                                                                                                                                                                                                  }