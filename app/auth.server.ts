import invariant from "tiny-invariant";
import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";
import { sessionStorage } from "~/session.server";
import type { User } from "~/models/user.server";
import { findOrCreate } from "~/models/user.server";
import { createProfile, getProfileByEmail } from "./models/profile.server";
import { findProfileData } from "./lake.server";

invariant(process.env.AUTH0_CLIENT_ID, "AUTH0_CLIENT_ID must be set");
invariant(process.env.AUTH0_CLIENT_SECRET, "AUTH0_CLIENT_SECRET must be set");
invariant(process.env.AUTH0_DOMAIN, "AUTH0_DOMAIN must be set");

// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export const authenticator = new Authenticator<User>(sessionStorage);

let auth0Strategy = new Auth0Strategy(
  {
    callbackURL: `${process.env.BASE_URL}/auth/auth0/callback`,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    domain: process.env.AUTH0_DOMAIN,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // search profile in our DB or get from data lake
    const email = profile.emails[0].value;
    const userProfile = await getProfileByEmail(email);
    if (!userProfile) {
      try {
        const lakeProfile = await findProfileData(email);
        createProfile({
          id: String(lakeProfile.contact__employee_number),
          email: lakeProfile.contact__email,
          firstName: lakeProfile.contact__first_name,
          preferredName: lakeProfile.contact__preferred_name,
          lastName: lakeProfile.contact__last_name,
          department: lakeProfile.contact__department,
          jobLevelTier: lakeProfile.contact__wizeos__level,
          jobLevelTitle: lakeProfile.contact__title,
          avatarUrl: lakeProfile.contact__photo__url,
          location: lakeProfile.contact__location,
          country: lakeProfile.contact__country,
          status: lakeProfile.contact__status,
          // - NULL
          // - Bench
          // - Assigned
          // - Terminated
          // - Active Hold
          // - Proposed
          // - Assignment to start
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
    // Get the user data from your DB or API using the tokens and profile
    return findOrCreate({
      email: profile.emails[0].value,
      name: profile.displayName,
    });
  }
);

authenticator.use(auth0Strategy);
