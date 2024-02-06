import type { LoaderFunction } from "@remix-run/node";
import { createUserSession, getUserRole, requireProfile, returnToCookie } from "~/session.server";
import { getAuthenticator } from "~/auth.server";
import { existApplicant } from "~/models/applicant.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const returnTo = await returnToCookie.parse(request.headers.get("Cookie"));

  const user = await getAuthenticator().authenticate("auth0", request, {
    failureRedirect: "/",
  });

  let roleRedirect: string;

  const userRole = await getUserRole(request);

  //Redirects according to user's role at login
  if (userRole === "ADMIN" || userRole === "USER") {
    roleRedirect = "/projects";
  } else if (userRole === "APPLICANT") {
    const profile = await requireProfile(request);
    const checkExistApplicant = await existApplicant(profile.email);
  
    //Check if the user has already answered the "aplicationform".
    if (checkExistApplicant) {
      roleRedirect = "/internshipProjects";
    } else {
      roleRedirect = `/applicationForm/${profile.id}`;
    }
  } else {
    roleRedirect = `/login/${params.connection}`;
  }

  const navigate = returnTo || roleRedirect;

  return createUserSession({
    request,
    userRole: user.role,
    userId: user.id,
    remember: false,
    redirectTo: navigate,
  });
};
