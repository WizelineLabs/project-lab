import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { searchProfiles } from "~/models/profile.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const project = url.searchParams.get("projectId");
  const profileId = url.searchParams.get("profileId");
  return json(await searchProfiles(q || "", project, profileId));
};
