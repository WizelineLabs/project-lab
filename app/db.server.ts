import { PrismaClient, Prisma } from "@prisma/client";
import { Sql } from "@prisma/client/runtime/library";
import { singleton } from "./singleton.server";

// Hard-code a unique key, so we can look up the client when this module gets re-imported
const prisma = singleton("prisma", () => new PrismaClient());
prisma.$connect();

function joinCondition(where: Sql, condition: Sql): Sql {
  if (where == Prisma.empty) {
    return condition;
  } else {
    return Prisma.sql`${where} AND ${condition}`;
  }
}

export { prisma, joinCondition };
