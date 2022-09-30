import type { Set, CollectibleSet, User } from "@prisma/client";
import { prisma } from "~/db.server";
// TODO: Move to saving to Database instead of 1000s of fetch requests

export function getOwnedCardsInSet(ownerId: User["id"]) {
  return prisma.$queryRaw<
    CollectibleSet[]
  >`SELECT * FROM collectible_set WHERE "collectibleId" in (
    SELECT "collectibleId" FROM collectible_user WHERE "ownerId"=${ownerId}
    );`;
}

export function getSetsOwned(ownerId: User["id"]) {
  return prisma.$queryRaw<Set[]>`SELECT * from sets WHERE id in (
    SELECT DISTINCT "setId" FROM collectible_set WHERE "collectibleId" in (
        SELECT "collectibleId" FROM collectible_user WHERE "ownerId"=${ownerId}
        )
    )`;
}

export function getCollectiblesFromSet(setName: string) {
  // using pivot table CollectibleSet to return collectibles from set using set name
  return prisma.collectibleSet.findMany({
    include: {
      collectible: true,
    },
    where: {
      set: {
        name: setName,
      },
    },
  });
}
