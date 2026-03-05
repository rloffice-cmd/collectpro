import { useState, useEffect } from "react";
import { Layers, FolderOpen, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getCardStats } from "@/lib/cards";
import { getCollectionCount } from "@/lib/collections";

export default function DashboardPage() {
  const { user } = useAuth();
    const [stats, setStats] = useState({ totalCards: 0, totalValue: 0, collections: 0 });
      const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (!user) return;
                Promise.all([getCardStats(user.id), getCollectionCount(user.id)])
                      .then(([cardStats, collCount]) => {
                              setStats({
                                        totalCards: cardStats.totalCards,
                                                  totalValue: cardStats.totalValue,
                                                            collections: collCount,
                                                                    });
                                                                          })
                                                                                .catch(console.error)
                                                                                      .finally(() => setLoading(false));
                                                                                        }, [user]);

                                                                                          const cards = [
                                                                                              { label: "Total Cards", value: stats.totalCards, icon: Layers, color: "text-blue-500" },
                                                                                                  { label: "Collections", value: stats.collections, icon: FolderOpen, color: "text-purple-500" },
                                                                                                      { label: "Total Value", value: `$${stats.totalValue.toFixed(2)}`, icon: DollarSign, color: "text-green-500" },
                                                                                                        ];

                                                                                                          return (
                                                                                                              <div className="space-y-6">
                                                                                                                    <h1 className="text-2xl font-bold">Dashboard</h1>
                                                                                                                          {loading ? (
                                                                                                                                  <div className="flex justify-center py-12">
                                                                                                                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                                                                                                                                                    </div>
                                                                                                                                                          ) : (
                                                                                                                                                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                                                                                                                                            {cards.map((card) => (
                                                                                                                                                                                        <div key={card.label} className="rounded-xl border border-border bg-card p-5">
                                                                                                                                                                                                      <div className="flex items-center gap-3 mb-2">
                                                                                                                                                                                                                      <card.icon className={`w-5 h-5 ${card.color}`} />
                                                                                                                                                                                                                                      <span className="text-sm text-muted-foreground">{card.label}</span>
                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                  <p className="text-2xl font-bold">{card.value}</p>
                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                        ))}
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                      )}
                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                            }