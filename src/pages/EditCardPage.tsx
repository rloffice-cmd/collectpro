import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CardForm } from "@/components/cards/CardForm";
import { getCardById, updateCard } from "@/lib/cards";
import type { Card } from "@/types/card";

export default function EditCardPage() {
  const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
      const [card, setCard] = useState<Card | null>(null);
        const [loading, setLoading] = useState(false);
          const [fetching, setFetching] = useState(true);
            const [error, setError] = useState("");

              useEffect(() => {
                  if (!id) return;
                      getCardById(id).then(setCard).catch(() => setError("Card not found")).finally(() => setFetching(false));
                        }, [id]);

                          const handleSubmit = async (data: Partial<Card>) => {
                              if (!id) return;
                                  setLoading(true);
                                      setError("");
                                          try {
                                                await updateCard(id, data);
                                                      navigate("/cards");
                                                          } catch (err) {
                                                                setError(err instanceof Error ? err.message : "Failed to update card");
                                                                    } finally {
                                                                          setLoading(false);
                                                                              }
                                                                                };

                                                                                  if (fetching) {
                                                                                      return (
                                                                                            <div className="flex items-center justify-center h-64">
                                                                                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                                                                                                          </div>
                                                                                                              );
                                                                                                                }

                                                                                                                  return (
                                                                                                                      <div className="space-y-6">
                                                                                                                            <div className="flex items-center gap-3">
                                                                                                                                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-secondary rounded-lg">
                                                                                                                                              <ArrowLeft className="w-5 h-5" />
                                                                                                                                                      </button>
                                                                                                                                                              <h1 className="text-2xl font-bold">Edit Card</h1>
                                                                                                                                                                    </div>
                                                                                                                                                                          {error && (
                                                                                                                                                                                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
                                                                                                                                                                                        )}
                                                                                                                                                                                              {card && <CardForm initialData={card} onSubmit={handleSubmit} loading={loading} />}
                                                                                                                                                                                                  </div>
                                                                                                                                                                                                    );
                                                                                                                                                                                                    }