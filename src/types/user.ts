export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  favorite_game: string | null;
  created_at: string;
  updated_at: string;
}
