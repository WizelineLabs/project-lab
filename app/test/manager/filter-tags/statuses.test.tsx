/* eslint-disable jest-dom/prefer-in-document */
import { describe, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Statuses, { loader } from "../../../routes/manager.filter-tags.statuses";

// import type { DataGridProps } from "@mui/x-data-grid";
import "@testing-library/jest-dom";

describe("Statuses test", () => {
  // mocking remix module to handle Loaders
  vi.mock("@remix-run/react", async () => {
    const remix: any = await vi.importActual("@remix-run/react");
    return {
      ...remix,
      // get useFetcher to return an idle state initially and an empty submit
      useFetcher: vi.fn().mockReturnValue({ state: "idle", submit: () => ({}) }),
      useLoaderData: vi.fn().mockReturnValue({
        statuses: [
          {
            id: "12345",
            name: "Test Status",
          },
        ],
        projects: [],
      }),
      useNavigation: vi.fn().mockReturnValue({
        type: "",
      }),
    };
  });

  vi.mock("remix-validated-form", async () => {
    const validateForm: any = await vi.importActual("remix-validated-form");
    return {
      ...validateForm,
      useFieldArray: vi.fn().mockReturnValue([
        [],
        {
          push: () => ({}),
        },
      ]),
      ValidatedForm: ({ children }: any) => <>{children}</>,
    };
  });
  // Mocking InputSelect as it is not tested here
  vi.mock("app/core/components/InputSelect", async () => {
    return {
      InputSelect: "",
    };
  });
  // Mocking LabeledTextField as it is not tested here
  vi.mock("app/core/components/LabeledTextField", async () => {
    const LabeledTextField = "";
    return {
      default: LabeledTextField,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("Path loader", async () => {
    const request = new Request(
      "http://localhost:3000/manager/filter-tags/statuses"
    );

    const response = await loader({ request, params: {}, context: {} });

    expect(response).toBeInstanceOf(Response);
  });

  test("Statuses from loader rendered", () => {
    render(<Statuses />);
    expect(screen.getByText(/Test Status/i)).toBeDefined();
  });

  test("Delete button opens the delete modal", async () => {
    const deleteButton = userEvent.setup();
    render(<Statuses />);
    expect(await screen.findByTestId("testStatusDelete")).toBeInTheDocument();
    await deleteButton.click(screen.getByTestId("testStatusDelete"));
    await waitFor(() => {
      expect(screen.getByTestId("deleteStatusModal")).toBeInTheDocument();
    });
  });

  test("Create button opens the Create Status modal", async () => {
    const saveButton = userEvent.setup();
    render(<Statuses />);
    expect(await screen.findByTestId("testStatusCreate")).toBeInTheDocument();
    await saveButton.click(screen.getByTestId("testStatusCreate"));
    await waitFor(() => {
      expect(screen.getByTestId("testStatusCreateModal")).toBeInTheDocument();
    });
  });

  test("Edit button opens the Edit Status modal", async () => {
    const saveButton = userEvent.setup();
    render(<Statuses />);
    expect(await screen.findByTestId("testStatusEdit")).toBeInTheDocument();
    await saveButton.click(screen.getByTestId("testStatusEdit"));
    await waitFor(() => {
      expect(screen.getByTestId("testStatusEditModal")).toBeInTheDocument();
    });
  });
});
