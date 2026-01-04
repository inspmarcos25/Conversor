export type CategoryId = 'pressure' | 'volume' | 'temperature' | 'length' | 'mass' | 'speed';

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  // Factor to convert to the base unit of the category
  toBase: (val: number) => number;
  // Factor to convert from the base unit of the category
  fromBase: (val: number) => number;
}

export interface Category {
  id: CategoryId;
  name: string;
  icon: string; // Material Symbol name
  imageUrl?: string; // URL opcional para imagem direta (ex: .png, .svg)
  units: Unit[];
}