# הוראות לתוסף כרום — CollectPro v2

## מצב נוכחי
הקוד של CollectPro v2 נבנה ב-Claude Code (session CLI) ונמצא מקומית במכונה.
ה-repo ב-GitHub (`rloffice-cmd/collectpro`) עדיין ריק — צריך לדחוף אליו.

## מה צריך ממך (התוסף) לעשות — לפי סדר:

### שלב 1: דחיפת הקוד ל-GitHub
הקוד כבר committed מקומית ב-`/home/user/collectpro`.
צריך push ל-`https://github.com/rloffice-cmd/collectpro.git` branch `main`.
אם אין לך גישת push — תנחה את המשתמש איך לעשות את זה מהטרמינל שלו.

### שלב 2: הקמת פרויקט Supabase חדש
1. היכנס ל-https://supabase.com/dashboard
2. צור פרויקט חדש בשם **CollectPro**
3. אזור: בחר את הקרוב ביותר (eu-central-1 לישראל)
4. שמור את:
   - **Project URL** (VITE_SUPABASE_URL)
   - **Anon public key** (VITE_SUPABASE_ANON_KEY)
5. צור קובץ `.env` ב-root של הפרויקט עם הערכים האלה

### שלב 3: יצירת טבלאות ב-Supabase
הריצו את ה-SQL הבא ב-Supabase SQL Editor:

```sql
-- פרופילים
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  favorite_game TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- קלפים
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  game TEXT NOT NULL CHECK (game IN ('pokemon','magic','yugioh','one_piece','other')),
  set_name TEXT,
  card_number TEXT,
  rarity TEXT CHECK (rarity IN ('common','uncommon','rare','ultra_rare','secret_rare','promo')),
  condition TEXT NOT NULL DEFAULT 'near_mint' CHECK (condition IN ('mint','near_mint','excellent','good','light_played','played','poor')),
  language TEXT DEFAULT 'en',
  is_foil BOOLEAN DEFAULT FALSE,
  is_first_edition BOOLEAN DEFAULT FALSE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  purchase_price DECIMAL(10,2),
  estimated_value DECIMAL(10,2),
  image_url TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- אוספים
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- קלפים באוספים (many-to-many)
CREATE TABLE collection_cards (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, card_id)
);

-- אינדקסים
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_game ON cards(game);
CREATE INDEX idx_cards_name ON cards(name);
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collection_cards_card ON collection_cards(card_id);

-- RLS — כל משתמש רואה רק את הנתונים שלו
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "users_own_cards" ON cards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_collections" ON collections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_collection_cards" ON collection_cards
  FOR ALL USING (
    collection_id IN (
      SELECT id FROM collections WHERE user_id = auth.uid()
    )
  );

-- אוספים ציבוריים — כולם יכולים לקרוא
CREATE POLICY "public_collections_read" ON collections
  FOR SELECT USING (is_public = TRUE);

-- טריגר ליצירת פרופיל אוטומטית בהרשמה
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- טריגר לעדכון updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### שלב 4: הגדרות Auth ב-Supabase
1. Authentication → Providers → הפעל Email
2. Authentication → Providers → הפעל Google (צריך OAuth credentials מ-Google Cloud Console)
3. Authentication → URL Configuration → הוסף את ה-URL של האפליקציה (localhost:5173 לפיתוח)

### שלב 5: Deploy ל-Vercel
1. חבר את ה-repo `rloffice-cmd/collectpro` ל-Vercel
2. הוסף Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Framework: Vite
4. Build command: `npm run build`
5. Output directory: `dist`

## מבנה הפרויקט הנוכחי
```
src/
├── components/layout/   — AppLayout, Sidebar, MobileNav
├── pages/               — 7 עמודים עם lazy loading
├── hooks/               — useAuth
├── lib/                 — supabase client, cn utility
├── types/               — card.ts, user.ts
└── styles/              — globals.css (Tailwind v4)
```

## טכנולוגיות
- React 19 + Vite + TypeScript (strict)
- Tailwind CSS v4
- Supabase (Auth + DB + RLS)
- React Router v7 + lazy loading
- Lucide React (אייקונים)

## כללים חשובים
- **אל תשנה את מבנה התיקיות** בלי תיאום עם Claude Code
- **אל תיצור קבצים ענקיים** — מקסימום 200 שורות לקובץ
- **.env לעולם לא ב-git**
- **כל שינוי ב-DB schema** צריך להיעשות דרך SQL migrations מתועדות
