import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserByUsername(username: User["username"]) {
  return prisma.user.findUnique({
    where: {
      username,
    },
  });
}

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      username: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
