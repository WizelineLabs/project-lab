import Header from "app/core/layouts/Header";
import { useState } from "react";
import { useLoaderData, Outlet, useRouteError } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  EditPanelsStyles,
  NavBarTabsStyles,
  LinkStyles,
} from "./manager/manager.styles";
import { adminRoleName } from "app/constants";
import { requireUser } from "~/session.server";
import { Container, Paper } from "@mui/material";

type LoaderData = {
  initialTabIdx: number;
  initialTitle: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const isAdmin = user.role == adminRoleName;
  const url = new URL(request.url);
  if (!isAdmin) return redirect("/");
  if (url.pathname === "/manager")
    return redirect("/manager/filter-tags/labels");
  const initialTabIdx = request.url.includes("admins") ? 1 : 0;
  const initialTitle = request.url.includes("admins")
    ? "Admins"
    : "Filter Tags";
  return json<LoaderData>({
    initialTabIdx,
    initialTitle,
  });
};

export default function ManagerPage() {
  const { initialTabIdx, initialTitle } = useLoaderData() as LoaderData;
  const [tabIndex, setTabIndex] = useState(initialTabIdx);
  const [tabTitle, setTabTitle] = useState(initialTitle);

  const handleChangeTab = (num: number, title: string) => {
    setTabIndex(num);
    setTabTitle(title);
  };

  return (
    <div>
      <Header title="Manager" />
      <Container>
        <NavBarTabsStyles>
          <EditPanelsStyles>
            <LinkStyles
              to="/manager/filter-tags/labels"
              onClick={() => handleChangeTab(0, "Filter Tags")}
              className={tabIndex === 0 ? "linkSelected" : undefined}
            >
              Filter Tags
            </LinkStyles>
            <LinkStyles
              to="/manager/universities/list"
              onClick={() => handleChangeTab(1, "Universities")}
              className={tabIndex === 1 ? "linkSelected" : undefined}
            >
              Universities
            </LinkStyles>
            <LinkStyles
              to="/manager/admins"
              onClick={() => handleChangeTab(2, "Admins")}
              className={tabIndex === 2 ? "linkSelected" : undefined}
            >
              Admins
            </LinkStyles>
          </EditPanelsStyles>
        </NavBarTabsStyles>
        <Paper elevation={0} sx={{ padding: 2 }}>
          <h2 style={{ marginTop: 0 }}>{tabTitle}</h2>
          <Outlet />
        </Paper>
      </Container>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError() as Error
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}
