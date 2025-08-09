// Types for Scryfall API responses
export interface ScryfallCard {
  id: string;
  name: string;
  mana_cost?: string;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors?: string[];
  color_identity?: string[];
  cmc?: number;
  rarity: string;
  set: string;
  set_name: string;
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
    png?: string;
    art_crop?: string;
    border_crop?: string;
  };
  card_faces?: Array<{
    name: string;
    mana_cost?: string;
    type_line: string;
    oracle_text?: string;
    power?: string;
    toughness?: string;
    image_uris?: {
      small?: string;
      normal?: string;
      large?: string;
      png?: string;
    };
  }>;
  prices?: {
    usd?: string;
    usd_foil?: string;
    eur?: string;
    tix?: string;
  };
}

export interface ScryfallSearchResponse {
  object: string;
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  data: ScryfallCard[];
}

// Local deck types
export interface Deck {
  id: string;
  name: string;
  description: string;
  format: string;
  cards: DeckCard[];
  mainboard_count: number;
  sideboard_count: number;
  created_at: string;
  updated_at: string;
  author?: string;
  tags?: string[];
}

export interface DeckCard {
  id: string;
  card_id: string;
  name: string;
  quantity: number;
  is_sideboard: boolean;
  mana_cost?: string;
  type_line: string;
  cmc?: number;
}