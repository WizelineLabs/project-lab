import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { searchLabels } from "~/models/label.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  return json(await searchLabels(url.searchParams.get("q") || ""));
};
