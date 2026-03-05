import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getCards, deleteCard, getCardsByGame } from "@/lib/cards";
import { CardItem } from "@/components/cards/CardItem";
import type { Card } from "@/types/card";

const GAMES = [
  { value: "", label: "All Games" },
    { value: "pokemon", label: "Pokemon" },
      { value: "magic", label: "MTG" },
        { value: "yugioh", label: "Yu-Gi-Oh!" },
          { value: "one_piece", label: "One Piece" },
            { value: "other", label: "Other" },
            ];

            export default function CardsPage() {
              const { user } = useAuth();
                const [cards, setCards] = useState<Card[]>([]);
                  const [loading, setLoading] = useState(true);
                    const [search, setSearch] = useState("");
                      const [gameFilter, setGameFilter] = useState("");

                        const fetchCards = async () => {
                            if (!user) return;
                                setLoading(true);
                                    try {
                                          const data = gameFilter
                                                  ? await getCardsByGame(user.id, gameFilter)
                                                          : await getCards(user.id);
                                                                setCards(data);
                                                                    } catch (err) {
                                                                          console.error(err);
                                                                              } finally {
                                                                                    setLoading(false);
                                                                                        }
                                                                                          };

                                                                                            useEffect(() => { fetchCards(); }, [user, gameFilter]);

                                                                                              const handleDelete = async (id: string) => {
                                                                                                  if (!confirm("Delete this card?")) return;
                                                                                                      try {
                                                                                                            await deleteCard(id);
                                                                                                                  setCards((prev) => prev.filter((c) => c.id !== id));
                                                                                                                      } catch (err) {
                                                                                                                            console.error(err);
                                                                                                                                }
                                                                                                                                  };

                                                                                                                                    const filtered = cards.filter((c) =>
                                                                                                                                        c.name.toLowerCase().includes(search.toLowerCase())
                                                                                                                                          );

                                                                                                                                            return (
                                                                                                                                                <div className="space-y-6">
                                                                                                                                                      <div className="flex items-center justify-between">
                                                                                                                                                              <h1 className="text-2xl font-bold">My Cards</h1>
                                                                                                                                                                      <Link to="/cards/new"
                                                                                                                                                                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                                                                                                                                                                                          <Plus className="w-4 h-4" /> Add Card
                                                                                                                                                                                                  </Link>
                                                                                                                                                                                                        </div>
                                                                                                                                                                                                              <div className="flex flex-col sm:flex-row gap-3">
                                                                                                                                                                                                                      <div className="relative flex-1">
                                                                                                                                                                                                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                                                                                                                                                                                                          <input type="text" placeholder="Search cards..."
                                                                                                                                                                                                                                                      value={search} onChange={(e) => setSearch(e.target.value)}
                                                                                                                                                                                                                                                                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card" />
                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                  <select value={gameFilter} onChange={(e) => setGameFilter(e.target.value)}
                                                                                                                                                                                                                                                                                            className="px-3 py-2 rounded-lg border border-border bg-card">
                                                                                                                                                                                                                                                                                                      {GAMES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                                                                                                                                                                                                                                                                                                              </select>
                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                          {loading ? (
                                                                                                                                                                                                                                                                                                                                  <div className="flex justify-center py-12">
                                                                                                                                                                                                                                                                                                                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                          ) : filtered.length === 0 ? (
                                                                                                                                                                                                                                                                                                                                                                  <div className="text-center py-12 text-muted-foreground">
                                                                                                                                                                                                                                                                                                                                                                            <p>No cards found.</p>
                                                                                                                                                                                                                                                                                                                                                                                      <Link to="/cards/new" className="text-primary hover:underline mt-2 inline-block">
                                                                                                                                                                                                                                                                                                                                                                                                  Add your first card
                                                                                                                                                                                                                                                                                                                                                                                                            </Link>
                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                          ) : (
                                                                                                                                                                                                                                                                                                                                                                                                                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                                                                                                                                                                                                                                                                                                                                                                                            {filtered.map((card) => (
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <CardItem key={card.id} card={card} onDelete={handleDelete} />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ))}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      }