import type { CollectibleUser, User } from "@prisma/client";

import { prisma } from "~/db.server";
import { getCardFromPokemonTCGID } from "./ptcg.server";

export type { CollectibleUser } from "@prisma/client";

export function getCollectible(id: CollectibleUser["id"]) {
  return prisma.collectibleUser.findUnique({
    where: {
      id,
    },
  });
}

export async function getAllCollectiblesWithTags(ownerId: User["id"]) {
  const collectiblesFromUser = await prisma.collectibleUser.findMany({
    include: {
      collectible: {
        include: {
          tags: true,
          ThirdPartyCollectibleIdentifier: true,
        },
      },
      tags: true,
    },
    where: {
      ownerId,
    },
  });
  // merge tags from collectible and collectible_user
  const collectibles = collectiblesFromUser.map(async (collectible) => {
    let tags = collectible.tags;
    if (collectible.collectible.tags) {
      tags = tags.concat(collectible.collectible.tags);
    }
    // const card = await getCardFromPokemonTCGID(
    //   collectible.collectible.ThirdPartyCollectibleIdentifier[0].thirdPartyId
    // );
    return {
      ...collectible,
      tags,
      // price: card.cardmarket.averageSellPrice,
    };
  });
  return collectibles;
}

export function getFeaturedCollectibles(ownerId: User["id"]) {
  return prisma.collectibleUser.findMany({
    include: {
      images: true,
    },
    where: {
      ownerId,
      featured: true,
    },
  });
}

export function getCollectibleCounts(ownerId: User["id"]) {
  const allCollectiblesCount = prisma.collectibleUser.count({
    where: {
      ownerId,
    },
  });
  const featuredCollectiblesCount = prisma.collectibleUser.count({
    where: {
      ownerId,
      featured: true,
    },
  });
  return {
    allCollectiblesCount,
    featuredCollectiblesCount,
  };
}
