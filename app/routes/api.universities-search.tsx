import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { searchUniversities } from "~/models/university.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  return json(await searchUniversities(url.searchParams.get("q") || ""));
};
