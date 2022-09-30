// Get api key for env
const API_KEY = process.env.POKEMON_TCG_API_KEY;
// X-Api-Key header for fetch requests
const headers = new Headers();
if (API_KEY) {
  headers.append("X-Api-Key", API_KEY);
}

export type PokemonCard = {
  id: string;
  name: string;
  images: { small: string; large: string };
  number: string;
  rarity: string;
  cardmarket: { averageSellPrice: number };
};

export async function getCardsFromPokemonSetName(setName: string) {
  const response = await fetch(
    `https://api.pokemontcg.io/v2/cards?q=set.name:"${setName}"`,
    {
      headers,
    }
  );
  const data = await response.json();

  return data.data;
}

export async function getCardsFromPokemonSetSeries(setSeries: string) {
  const response = await fetch(
    `https://api.pokemontcg.io/v2/cards?q=set.series:"${setSeries}"`,
    {
      headers,
    }
  );
  const data = await response.json();
  //   Turn data to PokemonCard type

  return data.data;
}

export async function getCardFromPokemonTCGID(id: string) {
  const response = await fetch(`https://api.pokemontcg.io/v2/cards/${id}`, {
    headers,
  });
  const data = await response.json();

  return data.data;
  //   const card: PokemonCard = data.data;

  //   return card;
}
