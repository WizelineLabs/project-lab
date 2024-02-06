/* eslint-disable jest-dom/prefer-in-document */
import { describe, test, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Admins, { loader } from "../../routes/manager.admins"
import type { DataGridProps } from "@mui/x-data-grid"
import "@testing-library/jest-dom"

describe("Admins test", () => {
  // mocking remix module to handle Loaders
  vi.mock("@remix-run/react", async () => {
    const remix: any = await vi.importActual("@remix-run/react")
    return {
      ...remix,
      // get useFetcher to return an idle state initially and an empty submit
      useFetcher: vi.fn().mockReturnValue({ state: "idle", submit: () => ({}) }),
      useLoaderData: vi.fn().mockReturnValue({
        admins: [
          {
            id: "12345",
            name: "Test Admin",
            email: "testadmin@test.com"
          },
        ],
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
    const request = new Request("http://localhost:3000/manager/admins")

    const response = await loader({ request, params: {}, context: {} })

    expect(response).toBeInstanceOf(Response)
  })

  test("Admins renders Admins from loader", () => {
    render(<Admins />)
    expect(screen.getByText(/Test Admin/i)).toBeDefined()
  })

  test("Delete button opens the delete modal", async () => {
    const deleteButton = userEvent.setup()
    render(<Admins />)
    expect(await screen.findByTestId("testAdminDelete")).toBeInTheDocument()
    await deleteButton.click(screen.getByTestId("testAdminDelete"))
    await waitFor(() => {
      expect(screen.getByTestId("deleteAdminModal")).toBeInTheDocument()
    })
  })

  test("Create button adds a new row in the table", async () => {
    const saveButton = userEvent.setup()
    render(<Admins />)
    expect(await screen.findByTestId("testAdminCreate")).toBeInTheDocument()
    await saveButton.click(screen.getByTestId("testAdminCreate"))
    await waitFor(() => {
      expect(screen.getByTestId("testAdminSave")).toBeInTheDocument()
    })
  })
})
