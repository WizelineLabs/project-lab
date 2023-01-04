/* eslint-disable jest-dom/prefer-in-document */
import { describe, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Manager from "../manager";
import { loader } from "../manager";
import "@testing-library/jest-dom";
import { RemixStub } from "test/utils";

describe("Admins test", () => {
  // mocking remix module to handle Loaders
  vi.mock("@remix-run/react", async () => {
    let remix: any = await vi.importActual("@remix-run/react");
    return {
      ...remix,
      useLoaderData: vi.fn().mockReturnValue({
        initialTabIdx: 0,
        initialTitle: "Filter Tags",
      }),
    };
  });

  vi.mock("~/session.server", async () => {
    let session: any = await vi.importActual("~/session.server");
    return {
      ...session,
      requireUser: vi.fn().mockReturnValue({
        role: "ADMIN",
      }),
    };
  });

  vi.mock("~/utils", async () => {
    let userUtils: any = await vi.importActual("~/utils");
    return {
      ...userUtils,
      useUser: vi.fn().mockReturnValue({
        role: "ADMIN",
        email: "test@test.com",
      }),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("Path loader", async () => {
    let request = new Request(
      "http://localhost:3000/manager/filter-tags/innovation-tiers"
    );

    const response = await loader({ request, params: {}, context: {} });

    expect(response).toBeInstanceOf(Response);
  });

  test("Manager selects the tab that comes from the Loader", () => {
    const { container } = render(
      <RemixStub>
        <Manager />
      </RemixStub>
    );
    const selectedTab = container.getElementsByClassName("linkSelected");
    expect(selectedTab.length).toBe(1);
    expect(selectedTab[0]).toHaveTextContent("Filter Tags");
  });

  test("Click on a different tab change the tab selected", async () => {
    const tab = userEvent.setup();
    const { container } = render(
      <RemixStub>
        <Manager />
      </RemixStub>
    );
    await tab.click(screen.getByText(/Admins/i));
    const selectedTab = container.getElementsByClassName("linkSelected");
    expect(selectedTab.length).toBe(1);
    expect(selectedTab[0]).toHaveTextContent("Admins");
  });
});
