import type { LoaderFunction } from "@remix-run/node";
import { getAuthenticator } from "~/auth.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  // check params.connection equals 'google-oauth2' or 'linkedin', or assign null to a connection const
  const connection =
    params.connection === "wizeline"
      ? "google-oauth2"
      : params.connection === "linkedin"
      ? params.connection
      : undefined;
  return getAuthenticator(connection).authenticate("auth0", request);
};
