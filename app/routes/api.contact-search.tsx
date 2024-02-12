import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { searchPointOfContact } from "~/models/pointsOfContact.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const university = url.searchParams.get("universityId");
  return json(
    (await searchPointOfContact(q || "", university || "")).map((c) => {
      return {
        id: c.id,
        name: c.fullName,
      };
    })
  );
};
