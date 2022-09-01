import type { Collectible, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Collectible } from "@prisma/client";

export function getCollectible(id: Collectible["id"]) {
  return prisma.collectible.findUnique({
    where: {
      id,
    },
  });
}

export function getAllCollectibles(ownerId: User["id"]) {
  return prisma.collectible.findMany({
    include: {
      tags: true,
    },
    where: {
      ownerId,
    },
  });
}

export function getFeaturedCollectibles(ownerId: User["id"]) {
  return prisma.collectible.findMany({
    include: {
      tags: true,
      images: true,
    },
    where: {
      ownerId,
      featured: true,
    },
  });
}

export function getCollectibleCounts(ownerId: User["id"]) {
  const allCollectiblesCount = prisma.collectible.count({
    where: {
      ownerId,
    },
  });
  const featuredCollectiblesCount = prisma.collectible.count({
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
