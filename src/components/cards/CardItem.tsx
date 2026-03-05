import { Link } from "react-router-dom";
import { Pencil, Trash2, Sparkles, Star } from "lucide-react";
import type { Card } from "@/types/card";

const GAME_LABELS: Record<string, string> = {
  pokemon: "Pokémon", magic: "MTG", yugioh: "Yu-Gi-Oh!",
    one_piece: "One Piece", other: "Other",
    };

    const RARITY_COLORS: Record<string, string> = {
      common: "bg-gray-500", uncommon: "bg-green-500", rare: "bg-blue-500",
        ultra_rare: "bg-purple-500", secret_rare: "bg-yellow-500", promo: "bg-pink-500",
        };

        interface CardItemProps {
          card: Card;
            onDelete: (id: string) => void;
            }

            export function CardItem({ card, onDelete }: CardItemProps) {
              return (
                  <div className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                          <h3 className="font-semibold truncate">{card.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{GAME_LABELS[card.game] || card.game}</p>
                                                            </div>
                                                                    {card.image_url && (
                                                                              <img src={card.image_url} alt={card.name}
                                                                                          className="w-16 h-22 object-cover rounded-lg ml-3" />
                                                                                                  )}
                                                                                                        </div>
                                                                                                              <div className="flex flex-wrap gap-1.5 mb-3">
                                                                                                                      {card.rarity && (
                                                                                                                                <span className={`text-xs text-white px-2 py-0.5 rounded-full ${RARITY_COLORS[card.rarity] || "bg-gray-500"}`}>
                                                                                                                                            {card.rarity.replace("_", " ")}
                                                                                                                                                      </span>
                                                                                                                                                              )}
                                                                                                                                                                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                                                                                                                                                                                {card.condition.replace("_", " ")}
                                                                                                                                                                                        </span>
                                                                                                                                                                                                {card.is_foil && (
                                                                                                                                                                                                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                                                                                                                                                                                                      <Sparkles className="w-3 h-3" /> Foil
                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                {card.is_first_edition && (
                                                                                                                                                                                                                                                          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                                                                                                                                                                                                                                                      <Star className="w-3 h-3" /> 1st Ed
                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                    {card.estimated_value && (
                                                                                                                                                                                                                                                                                                            <p className="text-sm font-medium text-green-600 mb-2">
                                                                                                                                                                                                                                                                                                                      ${Number(card.estimated_value).toFixed(2)}
                                                                                                                                                                                                                                                                                                                              </p>
                                                                                                                                                                                                                                                                                                                                    )}
                                                                                                                                                                                                                                                                                                                                          <div className="flex items-center gap-2 pt-2 border-t border-border">
                                                                                                                                                                                                                                                                                                                                                  <Link to={`/cards/${card.id}/edit`}
                                                                                                                                                                                                                                                                                                                                                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                                                                                                                                                                                                                                                                                                                                                                      <Pencil className="w-3.5 h-3.5" /> Edit
                                                                                                                                                                                                                                                                                                                                                                              </Link>
                                                                                                                                                                                                                                                                                                                                                                                      <button onClick={() => onDelete(card.id)}
                                                                                                                                                                                                                                                                                                                                                                                                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 ml-auto">
                                                                                                                                                                                                                                                                                                                                                                                                          <Trash2 className="w-3.5 h-3.5" /> Delete
                                                                                                                                                                                                                                                                                                                                                                                                                  </button>
                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                                                                                                                                                                                              }