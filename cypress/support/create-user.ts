// Use this to create a new user and login with that user
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts username@example.com
// and it will log out the cookie value you can use to interact with the server
// as that new user.

import { installGlobals } from "@remix-run/node";
import { faker } from "@faker-js/faker";
import { parse } from "cookie";

import { createUserSession } from "~/session.server";
import { findOrCreate } from "~/models/user.server";
import { createProfile } from "~/models/profile.server";

installGlobals();

async function createAndLogin(email: string) {
  if (!email) {
    throw new Error("email required for login");
  }
  if (!email.endsWith("@example.com")) {
    throw new Error("All test emails must end in @example.com");
  }

  const user = await findOrCreate({
    name: email.replace("@example.com", ""),
    email,
    role: "USER",
  });
  // a profile is also needed on labs
  await createProfile({
    email,
    firstName: faker.name.firstName(),
    preferredName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  });

  const response = await createUserSession({
    request: new Request("test://test"),
    userRole: user.role,
    userId: user.id,
    remember: false,
    redirectTo: "/projects",
  });

  const cookieValue = response.headers.get("Set-Cookie");
  if (!cookieValue) {
    throw new Error("Cookie missing from createUserSession response");
  }
  const parsedCookie = parse(cookieValue);
  // we log it like this so our cypress command can parse it out and set it as
  // the cookie value.
  console.log(
    `
<cookie>
  ${parsedCookie.__session}
</cookie>
  `.trim()
  );
}

createAndLogin(process.argv[2]);
