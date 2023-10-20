import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import type { User } from "~/models/user.server";
import type { Navigation } from "@remix-run/router";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export const isProjectMemberOrOwner = (
  profileId: string,
  projectMembers: { profileId: string }[],
  ownerId: string | null
) => {
  // Validate if the user have permissions (team member or owner of the project)
  const isProjectMember = projectMembers.some(
    (member) => member.profileId === profileId
  );
  const isProjectOwner = profileId === ownerId;

  if (!isProjectMember && !isProjectOwner) {
    throw new Error("You don't have permission to perform this operation");
  }
};

export const generateRandomNumberString = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require("crypto");
  const randomString = crypto.randomBytes(3).toString("hex");

  return randomString;
};

export const validateNavigationRedirect = (navigation: Navigation) => {
  return (
    navigation.state === "loading" &&
    navigation.formMethod !== null &&
    navigation.formMethod !== "GET" // &&
    // We had a submission navigation and are now navigating to different location
    // navigation.formAction !== navigation.location.pathname
  );
};


    export const currentdate:any = new Date();
    export const oneJan:any = new Date(currentdate.getFullYear(),0,1);
    export const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    export const week = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);

