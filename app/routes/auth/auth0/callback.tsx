import type { LoaderFunction } from "@remix-run/node";
import { createUserSession, returnToCookie } from "~/session.server";
import { getAuthenticator } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const returnTo = await returnToCookie.parse(request.headers.get("Cookie"));

  const user = await getAuthenticator().authenticate("auth0", request, {
    failureRedirect: "/",
  });
  return createUserSession({
    request,
    userRole: user.role,
    userId: user.id,
    remember: false,
    redirectTo: returnTo || "/projects",
  });
};
