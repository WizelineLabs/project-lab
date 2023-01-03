/* eslint-disable jest-dom/prefer-in-document */
import { describe, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Labels from "../labels";
import { loader } from "../labels";
import type { DataGridProps } from "@mui/x-data-grid";
import "@testing-library/jest-dom";

describe("Labels test", () => {
  // mocking remix module to handle Loaders
  vi.mock("@remix-run/react", async () => {
    let remix: any = await vi.importActual("@remix-run/react");
    return {
      ...remix,
      // get useFetcher to return an idle state initially and an empty submit
      useFetcher: vi.fn().mockReturnValue({ state: "idle", submit: () => {} }),
      useLoaderData: vi.fn().mockReturnValue({
        labels: [
          {
            id: "12345",
            name: "Test Label",
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

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("Path loader", async () => {
    const response = await loader();

    expect(response).toBeInstanceOf(Response);
  });

  test("Labels from loader rendered", () => {
    render(<Labels />);
    expect(screen.getByText(/Test Label/i)).toBeDefined();
  });

  test("Delete button opens the delete modal", async () => {
    const deleteButton = userEvent.setup();
    render(<Labels />);
    expect(await screen.findByTestId("testLabelDelete")).toBeInTheDocument();
    await deleteButton.click(screen.getByTestId("testLabelDelete"));
    await waitFor(() => {
      expect(screen.getByTestId("deleteLabelModal")).toBeInTheDocument();
    });
  });

  test("Create button adds a new row in the table", async () => {
    const saveButton = userEvent.setup();
    render(<Labels />);
    expect(await screen.findByTestId("testLabelCreate")).toBeInTheDocument();
    await saveButton.click(screen.getByTestId("testLabelCreate"));
    await waitFor(() => {
      expect(screen.getByTestId("testLabelSave")).toBeInTheDocument();
    });
  });
});
