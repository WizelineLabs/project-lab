/* eslint-disable jest-dom/prefer-in-document */
import { describe, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InnovationTiers from "../innovation-tiers";
import { loader } from "../innovation-tiers";
import type { DataGridProps } from "@mui/x-data-grid";
import "@testing-library/jest-dom";

describe("Innovation Tiers test", () => {
  // mocking remix module to handle Loaders
  vi.mock("@remix-run/react", async () => {
    let remix: any = await vi.importActual("@remix-run/react");
    return {
      ...remix,
      // get useFetcher to return an idle state initially and an empty submit
      useFetcher: vi.fn().mockReturnValue({ state: "idle", submit: () => {} }),
      useLoaderData: vi.fn().mockReturnValue({
        innovationTiers: [
          {
            id: "12345",
            name: "Test Innovation Tier",
            requisites: "Test requsitees",
            goals: "Test goals",
            benefits: "Test benefits",
          },
        ],
        projects: [],
      }),
    };
  });
  // Disable Virtualization so vitest can render all the columns
  vi.mock("@mui/x-data-grid", async () => {
    const datagrid: any = await vi.importActual("@mui/x-data-grid");
    const { DataGrid } = datagrid;
    return {
      ...datagrid,
      DataGrid: (props: DataGridProps) => {
        return <DataGrid {...props} autoHeight disableVirtualization />;
      },
    };
  });

  vi.mock("remix-validated-form", async () => {
    const validateForm: any = await vi.importActual("remix-validated-form");
    return {
      ...validateForm,
      useFieldArray: vi.fn().mockReturnValue([
        [],
        {
          push: () => {},
        },
      ]),
      ValidatedForm: ({children}: any) => <>{children}</>
    };
  });

  vi.mock("app/core/components/InputSelect", async () => {
    return {
      InputSelect: null,
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

  test("Innovation tiers renders Tiers from loader", () => {
    render(<InnovationTiers />);
    expect(screen.getByText(/Test Innovation Tier/i)).toBeDefined();
  });

  test("Delete button opens the delete modal", async () => {
    const deleteButton = userEvent.setup();
    render(<InnovationTiers />);
    expect(
      await screen.findByTestId("testInnovationDelete")
    ).toBeInTheDocument();
    await deleteButton.click(screen.getByTestId("testInnovationDelete"));
    await waitFor(() => {
      expect(screen.getByTestId("deleteTierModal")).toBeInTheDocument();
    });
  });

  test("Create button adds a new row in the table", async () => {
    const saveButton = userEvent.setup();
    render(<InnovationTiers />);
    expect(
      await screen.findByTestId("testInnovationCreate")
    ).toBeInTheDocument();
    await saveButton.click(screen.getByTestId("testInnovationCreate"));
    await waitFor(() => {
      expect(screen.getByTestId("testInnovationSave")).toBeInTheDocument();
    });
  });
});
