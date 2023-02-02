import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";

export let loader: LoaderFunction = () => redirect("/login");

export const action: ActionFunction = async ({ request }) => {
  return authenticator.authenticate("auth0", request);
};
