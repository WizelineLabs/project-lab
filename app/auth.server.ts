import { findProfileData } from "./lake.server";
import { getUserInfo } from "./models/github.get-getUserInfo";
import {
  createProfile,
  getProfileByEmail,
  updateProfile,
} from "./models/profile.server";
import { Authenticator, type StrategyVerifyCallback } from "remix-auth";
import type { Auth0ExtraParams, Auth0Profile } from "remix-auth-auth0";
import { Auth0Strategy } from "remix-auth-auth0";
import type { OAuth2StrategyVerifyParams } from "remix-auth-oauth2";
import invariant from "tiny-invariant";
import type { User } from "~/models/user.server";
import { findOrCreate } from "~/models/user.server";
import { sessionStorage } from "~/session.server";

const verifyCallback: StrategyVerifyCallback<
  User,
  OAuth2StrategyVerifyParams<Auth0Profile, Auth0ExtraParams>
> = async ({ profile }) => {
  try {
    if (profile.emails == undefined || !profile.emails[0]) {
      throw new Error("we need an email to login");
    }
    // search profile in our DB or get from data lake
    const email = profile.emails[0].value;
    const userProfile = await getProfileByEmail(email);

    // TODO: maybe move this to another process (auth.auth0.callback? or cron?)
    if (userProfile?.githubUser === "" || userProfile?.githubUser === null) {
      const { data } = await getUserInfo(email);
      // TODO: fix error when data might be null. But also simplify logic in this function
      if (data.total_count > 0) {
        const gitHubUser = data.items[0].login;
        userProfile.githubUser = gitHubUser;
        await updateProfile(userProfile, userProfile.id);
      }
    }

    const allowedDomains = [
      "@wizeline.com",
      "@in.wizeline.com",
      "@team.wizeline.com",
    ];
    const isAllowedDomain = allowedDomains.some((domain) =>
      email.endsWith(domain)
    );
    const isIntern = email.endsWith("@in.wizeline.com");

    if (!userProfile && isAllowedDomain) {
      const lakeProfile = await findProfileData(email);
      createProfile({
        id: String(lakeProfile.contact__employee_number),
        email: lakeProfile.contact__email,
        firstName: lakeProfile.contact__first_name,
        preferredName:
          lakeProfile.contact__preferred_name ||
          lakeProfile.contact__first_name,
        isBillable: lakeProfile.contact__isbillable === "Billable",
        lastName: lakeProfile.contact__last_name,
        department: lakeProfile.contact__department,
        jobLevelTier: lakeProfile.contact__wizeos__level,
        jobLevelTitle: lakeProfile.contact__title,
        avatarUrl: lakeProfile.contact__photo__url,
        location: lakeProfile.contact__location,
        country: lakeProfile.contact__country,
        employeeStatus: lakeProfile.contact__employee_status,
        businessUnit: lakeProfile.contact__business_unit,
        benchStatus: lakeProfile.contact__status,
      });
    }

    // Get the user data from your DB or API using the tokens and profile
    const role = isIntern ? "INTERN" : isAllowedDomain ? "USER" : "APPLICANT";
    return findOrCreate({
      email: profile.emails[0].value,
      name: profile.displayName || "Unnamed",
      role: role,
      avatarUrl: profile?.photos ? profile.photos[0].value : undefined,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("exception", e);
    throw e;
  }
};

export function getAuthenticator(connection?: "google-oauth2" | "linkedin") {
  invariant(process.env.AUTH0_CLIENT_ID, "AUTH0_CLIENT_ID must be set");
  invariant(process.env.AUTH0_CLIENT_SECRET, "AUTH0_CLIENT_SECRET must be set");
  invariant(process.env.AUTH0_DOMAIN, "AUTH0_DOMAIN must be set");

  // Create an instance of the authenticator, pass a generic with what your
  // strategies will return and will be stored in the session
  const authenticator = new Authenticator<User>(sessionStorage);

  const auth0Strategy = new Auth0Strategy(
    {
      callbackURL: `${process.env.BASE_URL}/auth/auth0/callback`,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
      connection,
    },
    verifyCallback
  );

  authenticator.use(auth0Strategy);

  return authenticator;
}
