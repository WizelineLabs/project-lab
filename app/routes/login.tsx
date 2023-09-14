import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useSearchParams } from "@remix-run/react";
import {
  Panel,
  Greet,
  StyledLoginForm,
  Button,
  Footer,
  LoginPageContainer,
} from "./login.styles";
import { getUserId, returnToCookie } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/projects";

  //const userRole = await getUserRole(request);
  const userId = await getUserId(request);
  if (userId) return redirect("/projects");
  return json(
    {},
    {
      headers: {
        "Set-Cookie": await returnToCookie.serialize(redirectTo),
      },
    }
  );
};

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/projects";

  return (
    <LoginPageContainer>
      <Panel>
        <img src="/wizeletters.png" alt="Wizeline" width={140} />
        <StyledLoginForm>
          <Greet>Welcome back Wizeliner!</Greet>
          <Form action="/auth/auth0" method="post" className="space-y-6">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <Button type="submit">
              Log in with your Wizeline email account
            </Button>
          </Form>
          <Footer />
        </StyledLoginForm>
      </Panel>
    </LoginPageContainer>
  );
}
