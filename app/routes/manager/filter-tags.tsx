import { useState } from "react";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

import { LinkTabStyles, EditPanelsStyles, BoxStyles } from "./manager.styles";

export const loader: LoaderFunction = async ({ request }) => {
  let initialTabIdx = 0;
  if (request.url.includes("statuses")) initialTabIdx = 1;
  if (request.url.includes("innovation-tiers")) initialTabIdx = 2;
  const url = new URL(request.url);
  if (url.pathname === "/manager/filter-tags") return redirect("/manager/filter-tags/labels")
  return json({
    initialTabIdx,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Wizelabs - Filter Tags",
    description: "This is the Manager's Filter Tags Tab",
  };
};

const FilterTagsPage = () => {
  const { initialTabIdx } = useLoaderData();
  const [tabIndex, setTabIndex] = useState(initialTabIdx);

  const handleChangeTab = (num: number) => {
    setTabIndex(num);
  };

  return (
    <EditPanelsStyles>
      <BoxStyles>
        <LinkTabStyles
          to="/manager/filter-tags/labels"
          onClick={() => handleChangeTab(0)}
          className={tabIndex === 0 ? "tabSelected" : undefined}
        >
          Labels
        </LinkTabStyles>
        <LinkTabStyles
          to="/manager/filter-tags/statuses"
          onClick={() => handleChangeTab(1)}
          className={tabIndex === 1 ? "tabSelected" : undefined}
        >
          Statuses
        </LinkTabStyles>
        <LinkTabStyles
          to="/manager/filter-tags/innovation-tiers"
          onClick={() => handleChangeTab(2)}
          className={tabIndex === 2 ? "tabSelected" : undefined}
        >
          Innovation Tiers
        </LinkTabStyles>
      </BoxStyles>
      <Outlet />
    </EditPanelsStyles>
  );
};

export default FilterTagsPage;
