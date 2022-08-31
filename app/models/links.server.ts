import { prisma } from "~/db.server";
import type { User } from "@prisma/client";

export async function getExternalLinks(userId: User["id"]) {
  return prisma.userLink.findMany({
    where: {
      userId,
    },
  });
}
