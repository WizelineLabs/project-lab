import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { searchProfiles } from "~/models/profiles.server"

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  return json(await searchProfiles(url.searchParams.get("q") || ""))
}
