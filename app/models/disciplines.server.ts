import { Prisma } from "~/db.server";

export type { Disciplines } from "@prisma/client";

type newDiscipline = {
  name: string;
};

interface ResponseError extends Error {
  code?: string;
}
