import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetDisciplinesInput
  extends Pick<Prisma.DisciplinesFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetDisciplinesInput) => {
    const {
      items: disciplines,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.disciplines.count({ where }),
      query: (paginateArgs) => db.disciplines.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      disciplines,
      nextPage,
      hasMore,
      count,
    }
  }
)
