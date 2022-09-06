import Header from "app/core/layouts/Header";
import CardBox from "app/core/components/CardBox";
import { useState } from "react";
import { useLoaderData, Outlet } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  EditPanelsStyles,
  NavBarTabsStyles,
  LinkStyles,
} from "./manager/manager.styles";

import Wrapper from "./projects/projects.styles";
import { adminRoleName } from "app/core/utils/constants";
import { requireUser } from "~/session.server";

type LoaderData = {
  isAdmin: boolean;
  initialTabIdx: number;
  initialTitle: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const isAdmin = user.role == adminRoleName;
  console.log(request);
  const initialTabIdx = request.url.includes("admins") ? 1 : 0;
  const initialTitle = request.url.includes("admins")
    ? "Admins"
    : "Filter Tags";
  return json<LoaderData>({
    isAdmin,
    initialTabIdx,
    initialTitle,
  });
};

export default function ManagerPage() {
  const { isAdmin, initialTabIdx, initialTitle } =
    useLoaderData() as LoaderData;
  const [tabIndex, setTabIndex] = useState(initialTabIdx);
  const [tabTitle, setTabTitle] = useState(initialTitle);

  if (!isAdmin) return redirect("/");

  const handleChangeTab = (num: number, title: string) => {
    setTabIndex(num);
    setTabTitle(title);
  };

  return (
    <div>
      <Header title="Manager" />
      <Wrapper className="homeWrapper">
        <NavBarTabsStyles>
          <EditPanelsStyles>
            <LinkStyles
              to="/manager"
              onClick={() => handleChangeTab(0, "Filter Tags")}
              className={tabIndex === 0 ? "tabSelected" : undefined}
            >
              Filter Tags
            </LinkStyles>
            <LinkStyles
              to="/manager/admins"
              onClick={() => handleChangeTab(1, "Admins")}
              className={tabIndex === 1 ? "tabSelected" : undefined}
            >
              Admins
            </LinkStyles>
          </EditPanelsStyles>
        </NavBarTabsStyles>
        <CardBox title={tabTitle}>
          <Outlet />
        </CardBox>
      </Wrapper>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}
