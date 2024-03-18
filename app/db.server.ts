import { DB } from "./kysely";
import { singleton } from "./singleton.server";
import { PrismaClient, Prisma } from "@prisma/client";
import { Sql } from "@prisma/client/runtime/library";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
  log: ["error", "query"],
});

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
