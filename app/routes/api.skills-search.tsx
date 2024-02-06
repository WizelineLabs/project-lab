import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { searchSkills } from "~/models/skill.server"

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  return json(await searchSkills(url.searchParams.get("q") || ""))
}
