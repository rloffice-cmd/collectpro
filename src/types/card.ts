export type CardCondition =
  | "mint"
  | "near_mint"
  | "excellent"
  | "good"
  | "light_played"
  | "played"
  | "poor";

export type CardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "ultra_rare"
  | "secret_rare"
  | "promo";

export type CardGame = "pokemon" | "magic" | "yugioh" | "one_piece" | "other";

export interface Card {
  id: string;
  user_id: string;
  name: string;
  game: CardGame;
  set_name: string | null;
  card_number: string | null;
  rarity: CardRarity | null;
  condition: CardCondition;
  language: string;
  is_foil: boolean;
  is_first_edition: boolean;
  quantity: number;
  purchase_price: number | null;
  estimated_value: number | null;
  image_url: string | null;
  notes: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  is_public: boolean;
  card_count: number;
  total_value: number;
  created_at: string;
  updated_at: string;
}

export interface CollectionCard {
  collection_id: string;
  card_id: string;
  added_at: string;
}
