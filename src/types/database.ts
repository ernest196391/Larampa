export type Json = string | number | boolean | null | {[key: string]: Json | undefined} | Json[];
export type Database = {public: {Tables: {
  categories: {Row: {id: string; name: string; slug: string; sort_order: number; is_active: boolean; image_url: string | null}};
  menu_items: {Row: {id: string; category_id: string; name: string; slug: string; description: string | null; portion: string | null; price_cup: number | null; price_usd: number | null; image_url: string | null; alt_text: string | null; is_featured: boolean; is_available: boolean; badge: string | null; sort_order: number}};
  site_settings: {Row: {key: string; value: Json}};
  change_log: {Row: {id: number; actor_id: string; entity_type: string; entity_id: string | null; action: string; changes: Json; created_at: string}};
}}};
