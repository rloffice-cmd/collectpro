-- Seed Data for CollectPro
-- Run this AFTER creating a user account and signing in.
-- Replace YOUR_USER_ID with your actual user ID from Supabase Auth.
-- You can find it in: Supabase Dashboard → Authentication → Users → copy the UUID

-- Step 1: Set your user ID
DO $$
DECLARE
  uid UUID := (SELECT id FROM auth.users LIMIT 1);
BEGIN

-- Step 2: Insert sample cards
INSERT INTO cards (user_id, name, game, set_name, card_number, rarity, condition, language, is_foil, is_first_edition, quantity, purchase_price, estimated_value, notes, tags) VALUES
  (uid, 'Charizard VMAX', 'pokemon', 'Shining Fates', '074/073', 'secret_rare', 'near_mint', 'en', true, false, 1, 150.00, 320.00, 'Rainbow rare, pulled from booster box', '{fire,gen1,chase}'),
  (uid, 'Pikachu V', 'pokemon', 'Vivid Voltage', '043/185', 'ultra_rare', 'mint', 'en', true, false, 2, 25.00, 45.00, null, '{electric,pikachu}'),
  (uid, 'Mewtwo GX', 'pokemon', 'Shining Legends', '039/073', 'ultra_rare', 'excellent', 'en', false, false, 1, 12.00, 28.00, null, '{psychic,gen1}'),
  (uid, 'Lugia V Alt Art', 'pokemon', 'Silver Tempest', '186/195', 'secret_rare', 'mint', 'en', false, false, 1, 80.00, 155.00, 'Alt art, amazing artwork', '{flying,gen2,alt_art}'),
  (uid, 'Umbreon VMAX Alt Art', 'pokemon', 'Evolving Skies', '215/203', 'secret_rare', 'near_mint', 'en', false, false, 1, 200.00, 380.00, 'Best card in the set', '{dark,gen2,alt_art}'),
  (uid, 'Black Lotus', 'magic', 'Alpha', null, 'rare', 'played', 'en', false, false, 1, 5000.00, 25000.00, 'The holy grail - played condition', '{power_nine,artifact}'),
  (uid, 'Lightning Bolt', 'magic', 'Alpha', null, 'common', 'good', 'en', false, false, 4, 2.00, 15.00, null, '{red,instant}'),
  (uid, 'Jace, the Mind Sculptor', 'magic', 'Worldwake', '031', 'rare', 'near_mint', 'en', true, false, 1, 45.00, 85.00, 'Foil version', '{blue,planeswalker}'),
  (uid, 'Dark Magician', 'yugioh', 'Legend of Blue Eyes', 'LOB-005', 'ultra_rare', 'good', 'en', false, true, 1, 35.00, 120.00, '1st edition LOB', '{spellcaster,dark}'),
  (uid, 'Blue-Eyes White Dragon', 'yugioh', 'Legend of Blue Eyes', 'LOB-001', 'ultra_rare', 'light_played', 'en', false, true, 1, 50.00, 200.00, '1st edition, classic', '{dragon,light}'),
  (uid, 'Exodia the Forbidden One', 'yugioh', 'Legend of Blue Eyes', 'LOB-124', 'ultra_rare', 'near_mint', 'en', false, false, 1, 25.00, 65.00, 'Head piece only', '{spellcaster,dark}'),
  (uid, 'Monkey D. Luffy (Leader)', 'one_piece', 'Romance Dawn', 'OP01-003', 'rare', 'mint', 'en', false, false, 1, 15.00, 35.00, 'Leader card', '{straw_hat}'),
  (uid, 'Shanks', 'one_piece', 'Romance Dawn', 'OP01-120', 'secret_rare', 'mint', 'en', false, false, 1, 45.00, 90.00, 'Secret rare pull!', '{red_hair_pirates}'),
  (uid, 'Eevee', 'pokemon', 'Evolving Skies', '101/203', 'common', 'near_mint', 'en', false, false, 8, 0.25, 0.50, 'Have too many of these', '{normal,gen1}'),
  (uid, 'Sol Ring', 'magic', 'Commander Collection', null, 'uncommon', 'mint', 'en', false, false, 3, 3.00, 5.00, 'Commander staple', '{artifact,colorless}');

-- Step 3: Insert sample collections
INSERT INTO collections (user_id, name, description, is_public) VALUES
  (uid, 'Gen 1 Favorites', 'My favorite cards from the original 151 Pokemon', true),
  (uid, 'High Value Cards', 'Cards worth $100+', false),
  (uid, 'Yu-Gi-Oh! Classics', 'Classic LOB cards', true);

-- Step 4: Add cards to collections
INSERT INTO collection_cards (collection_id, card_id)
SELECT c.id, k.id FROM collections c, cards k
WHERE c.name = 'Gen 1 Favorites' AND c.user_id = uid
  AND k.name IN ('Charizard VMAX', 'Pikachu V', 'Mewtwo GX', 'Eevee') AND k.user_id = uid;

INSERT INTO collection_cards (collection_id, card_id)
SELECT c.id, k.id FROM collections c, cards k
WHERE c.name = 'High Value Cards' AND c.user_id = uid
  AND k.estimated_value >= 100 AND k.user_id = uid;

INSERT INTO collection_cards (collection_id, card_id)
SELECT c.id, k.id FROM collections c, cards k
WHERE c.name = 'Yu-Gi-Oh! Classics' AND c.user_id = uid
  AND k.game = 'yugioh' AND k.user_id = uid;

END $$;
