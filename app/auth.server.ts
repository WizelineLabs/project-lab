import invariant from "tiny-invariant";
import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";
import { sessionStorage } from "~/session.server";
import type { User} from "~/models/user.server";
import { findOrCreate } from "~/models/user.server";

invariant(process.env.AUTH0_CLIENT_ID, "AUTH0_CLIENT_ID must be set");
invariant(process.env.AUTH0_CLIENT_SECRET, "AUTH0_CLIENT_SECRET must be set");
invariant(process.env.AUTH0_DOMAIN, "AUTH0_DOMAIN must be set");

// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export const authenticator = new Authenticator<User>(sessionStorage);

let auth0Strategy = new Auth0Strategy({
    callbackURL: `${process.env.BASE_URL}/auth/auth0/callback`,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    domain: process.env.AUTH0_DOMAIN,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    return findOrCreate({ email: profile.emails[0].value, name: profile.displayName });
  }
);

authenticator.use(auth0Strategy);
