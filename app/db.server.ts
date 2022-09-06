import { PrismaClient, Prisma } from "@prisma/client";
import type { Sql } from "@prisma/client/runtime";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
  }
  prisma = global.__db__;
  prisma.$connect();
}

function joinCondition(where: Sql, condition: Sql): Sql {
  if (where == Prisma.empty) {
    return condition;
  } else {
    return Prisma.sql`${where} AND ${condition}`;
  }
}

export { prisma, joinCondition };
