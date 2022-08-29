export type PokemonData = {
  pokemon: Pokemon;
  sprites: string;
};

type Pokemon = {
  id: number;
  name: string;
  stats: PokemonStats;
  types: PokemonTypes;
};

type PokemonStats = Array<{ baseStat: number; stat: PokemonStat }>;

type PokemonStat = {
  name: string;
};

type PokemonTypes = Array<{ type: PokemonType }>;

type PokemonType = {
  name: string;
};

export type PokemonTypeColor = {
  normal: string;
  fire: string;
  water: string;
  electric: string;
  grass: string;
  ice: string;
  fighting: string;
  poison: string;
  ground: string;
  flying: string;
  psychic: string;
  bug: string;
  rock: string;
  ghost: string;
  dragon: string;
  dark: string;
  steel: string;
  fairy: string;
};
