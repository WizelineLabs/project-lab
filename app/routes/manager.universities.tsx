import { LinkTabStyles, EditPanelsStyles, BoxStyles } from "./manager.styles";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { useState } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  let initialTabIdx = 0;
  if (request.url.includes("list")) initialTabIdx = 0;
  if (request.url.includes("points-of-contact")) initialTabIdx = 1;
  const url = new URL(request.url);
  if (url.pathname === "/manager/universities")
    return redirect("/manager/universities/list");
  return json({
    initialTabIdx,
  });
};

export const meta: MetaFunction = () => {
  return [
    { title: "Wizelabs - Universities" },
    { name: "description", content: "This is the Manager's Universities Tab" },
  ];
};

const FilterTagsPage = () => {
  const { initialTabIdx } = useLoaderData<typeof loader>();
  const [tabIndex, setTabIndex] = useState(initialTabIdx);

  const handleChangeTab = (num: number) => {
    setTabIndex(num);
  };

  return (
    <EditPanelsStyles>
      <BoxStyles>
        <LinkTabStyles
          to="/manager/universities/list"
          onClick={() => handleChangeTab(0)}
          className={tabIndex === 0 ? "tabSelected" : undefined}
        >
          Universities
        </LinkTabStyles>
        <LinkTabStyles
          to="/manager/universities/points-of-contact"
          onClick={() => handleChangeTab(1)}
          className={tabIndex === 1 ? "tabSelected" : undefined}
        >
          Points of Contact
        </LinkTabStyles>
      </BoxStyles>
      <Outlet />
    </EditPanelsStyles>
  );
};

export default FilterTagsPage;
