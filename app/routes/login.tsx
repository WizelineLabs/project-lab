import type {
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useSearchParams } from "@remix-run/react";
import {
  Panel,
  Greet,
  StyledLoginForm,
  Button,
  Footer,
  Body,
  LoginPageContainer,
} from "./login.styles";

import { getUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/notes";

  return (
  <LoginPageContainer>
    <Panel>
      <img src="/wizeline.png" alt="wizeline" height={40} width={40} />
      <StyledLoginForm>
        <Body>
          <Greet>Welcome back Wizeliner!</Greet>
          <Form action="/auth/auth0" method="post" className="space-y-6">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <Button type="submit">Log in</Button>
          </Form>
        </Body>
        <Footer />
      </StyledLoginForm>
    </Panel>
  </LoginPageContainer>
  );
}
