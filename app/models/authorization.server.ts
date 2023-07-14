import { isProjectTeamMember } from "./project.server";

export type Roles =
  | "ADMIN"
  | "USER"
  | "APPLICANT"
  | "ANONYMOUS"
  | "project-team-member";

type Actions = "create" | "view" | "edit" | "delete" | "edit.project";

type Resources = "applicant" | "project";

export function checkPermission(
  principal: string | number,
  role: Roles,
  action: Actions,
  resourceType: Resources,
  resource: any
) {
  const derivedRoles = getDerivedRoles(principal, resourceType, resource);
  if (role == "ADMIN") {
    return true;
  }

  if (resourceType == "project") {
    if (derivedRoles.includes("project-team-member")) {
      if (["view", "edit"].includes(action)) {
        return true;
      }
    }
  }

  if (resourceType == "applicant" && action == "edit.project") {
    if (!resource.mentorId && role == "USER") {
      return true;
    }
    if (resource.mentorId == principal) {
      return true;
    }
    const projectDerivedRoles = getDerivedRoles(
      principal,
      "project",
      resource.project
    );
    if (projectDerivedRoles.includes("project-team-member")) {
      return true;
    }
  }

  return false;
}

function getDerivedRoles(
  principal: string | number,
  resourceType: Resources,
  resource: any
) {
  const derivedRoles: Roles[] = [];

  if (resourceType === "project") {
    if (isProjectTeamMember(principal, resource)) {
      derivedRoles.push("project-team-member");
    }
  }

  return derivedRoles;
}
