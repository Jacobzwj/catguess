export interface Cat {
  id: number;
  name: string;
  image: string;
  description: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  score: number;
  selectedCat: number | null;
  currentEatingCat: number | null;
  isFeeding: boolean;
  foodPosition: Position | null;
} 