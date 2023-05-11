/* eslint-disable jest-dom/prefer-in-document */
import { describe } from "vitest";
// import { describe, test, vi } from "vitest";
// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import FilterTags from "../filter-tags";
// import { loader } from "../filter-tags";
// import { RemixStub } from "test/utils";
import "@testing-library/jest-dom";

describe("Filter Tags test", () => {
  // // mocking remix module to handle Loaders
  // vi.mock("@remix-run/react", async () => {
  //   let remix: any = await vi.importActual("@remix-run/react");
  //   return {
  //     ...remix,
  //     useLoaderData: vi.fn().mockReturnValue({
  //       initialTabIdx: 0,
  //     }),
  //   };
  // });

  // afterEach(() => {
  //   vi.clearAllMocks();
  // });

  // test("Path loader", async () => {
  //   let request = new Request("http://localhost:3000/manager/filter-tags");

  //   const response = await loader({ request, params: {}, context: {} });

  //   expect(response).toBeInstanceOf(Response);
  // });

  // test("Filter Tags selects the tab that comes from the Loader", () => {
  //   const { container } = render(
  //     <RemixStub>
  //       <FilterTags />
  //     </RemixStub>
  //   );
  //   const selectedTab = container.getElementsByClassName("tabSelected");
  //   expect(selectedTab.length).toBe(1);
  //   expect(selectedTab[0]).toHaveTextContent("Labels");
  // });

  // test("Click on a different tab change the tab selected", async () => {
  //   const tab = userEvent.setup();
  //   const { container } = render(
  //     <RemixStub>
  //       <FilterTags />
  //     </RemixStub>
  //   );
  //   await tab.click(screen.getByText(/Statuses/i));
  //   const selectedTab = container.getElementsByClassName("tabSelected");
  //   expect(selectedTab.length).toBe(1);
  // });
});
