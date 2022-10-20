/* eslint-disable jest-dom/prefer-in-document */
import { describe, test, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Statuses from "../statuses"
import { loader } from "../statuses"
import type { DataGridProps } from "@mui/x-data-grid"
import "@testing-library/jest-dom"

describe("Statuses test", () => {
  // mocking remix module to handle Loaders
  vi.mock("@remix-run/react", async () => {
    let remix: any = await vi.importActual("@remix-run/react")
    return {
      ...remix,
      // get useFetcher to return an idle state initially and an empty submit
      useFetcher: vi.fn().mockReturnValue({ state: "idle", submit: () => {} }),
      useLoaderData: vi.fn().mockReturnValue({
        statuses: [
          {
            id: "12345",
            name: "Test Status",
          },
        ],
        projects: [],
      }),
    }
  })
  // Disable Virtualization so vitest can render all the columns
  vi.mock("@mui/x-data-grid", async () => {
    const datagrid: any = await vi.importActual("@mui/x-data-grid")
    const { DataGrid } = datagrid
    return {
      ...datagrid,
      DataGrid: (props: DataGridProps) => {
        return <DataGrid {...props} autoHeight disableVirtualization />
      },
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test("Path loader", async () => {
    let request = new Request("http://localhost:3000/manager/filter-tags/Statuses")

    const response = await loader({ request, params: {}, context: {} })

    expect(response).toBeInstanceOf(Response)
  })

  test("Statuses from loader rendered", () => {
    render(<Statuses />)
    expect(screen.getByText(/Test Status/i)).toBeDefined()
  })

  test("Delete button opens the delete modal", async () => {
    const deleteButton = userEvent.setup()
    render(<Statuses />)
    expect(await screen.findByTestId("testStatusDelete")).toBeInTheDocument()
    await deleteButton.click(screen.getByTestId("testStatusDelete"))
    await waitFor(() => {
      expect(screen.getByTestId("deleteStatusModal")).toBeInTheDocument()
    })
  })

  test("Create button adds a new row in the table", async () => {
    const saveButton = userEvent.setup()
    render(<Statuses />)
    expect(await screen.findByTestId("testStatusCreate")).toBeInTheDocument()
    await saveButton.click(screen.getByTestId("testStatusCreate"))
    await waitFor(() => {
      expect(screen.getByTestId("testStatusSave")).toBeInTheDocument()
    })
  })
})
