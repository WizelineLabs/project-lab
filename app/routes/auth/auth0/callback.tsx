import type { LoaderFunction } from "@remix-run/node";
import { createUserSession } from "~/session.server";
import { authenticator } from "~/auth.server";
import { returnToCookie } from "~/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  const returnTo =
    (await returnToCookie.parse(request.headers.get("Cookie")));

  const user = await authenticator.authenticate("auth0", request, {
    failureRedirect: "/login",
  });
  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: returnTo || "/projects",
  });
};
