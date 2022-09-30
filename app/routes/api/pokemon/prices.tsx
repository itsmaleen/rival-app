import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getCardFromPokemonTCGID } from "~/models/ptcg.server";

export async function action({ request }: ActionArgs) {
  // Get request body
  const body = await request.json();
  let collectiblePrices = [];
  for (const collectible of body) {
    const card = await getCardFromPokemonTCGID(collectible.thirdPartyId);
    collectiblePrices.push({
      id: collectible.id,
      price: card.cardmarket.prices.averageSellPrice,
    });
  }
  return json({ collectiblePrices });
}
