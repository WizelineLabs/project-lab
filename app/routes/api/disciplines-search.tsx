import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { searchDisciplines } from "~/models/disciplines.server"

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  return json(await searchDisciplines(url.searchParams.get("q") || ""))
}
