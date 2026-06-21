export type ItemCategory = 'good' | 'bad';

export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  category: ItemCategory;
  points: number;
  hindiName: string;
  description: string;
}

export interface FallingItem {
  id: string;
  type: string;
  emoji: string;
  category: ItemCategory;
  x: number; // Percentage from left (0 to 100)
  y: number; // Pixels from top of play-field
  speed: number;
  rotation: number;
  rotationSpeed: number;
  isTapped: boolean;
  scale: number;
}

export interface PointLabel {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  timestamp: number;
}

export interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardPoints: number;
  completed: boolean;
  claimed: boolean;
  type: 'ginger_tap' | 'no_bad_items_game' | 'royal_brew_master' | 'max_combo_streak' | 'total_games';
}

