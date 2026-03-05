import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CardForm } from "@/components/cards/CardForm";
import { createCard } from "@/lib/cards";
import { useAuth } from "@/hooks/useAuth";
import type { Card } from "@/types/card";

export default function AddCardPage() {
  const { user } = useAuth();
    const navigate = useNavigate();
      const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");

          const handleSubmit = async (data: Partial<Card>) => {
              if (!user) return;
                  setLoading(true);
                      setError("");
                          try {
                                await createCard({ ...data, user_id: user.id } as Card);
                                      navigate("/cards");
                                          } catch (err) {
                                                setError(err instanceof Error ? err.message : "Failed to create card");
                                                    } finally {
                                                          setLoading(false);
                                                              }
                                                                };

                                                                  return (
                                                                      <div>
                                                                            <button onClick={() => navigate(-1)}
                                                                                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
                                                                                            <ArrowLeft size={16} /> Back
                                                                                                  </button>
                                                                                                        <h1 className="text-2xl font-bold mb-6">Add New Card</h1>
                                                                                                              {error && (
                                                                                                                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                                                                                                                                {error}
                                                                                                                                        </div>
                                                                                                                                              )}
                                                                                                                                                    <CardForm onSubmit={handleSubmit} loading={loading} />
                                                                                                                                                        </div>
                                                                                                                                                          );
                                                                                                                                                          }
                                                                                                                                                          