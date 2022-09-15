import { useState, useEffect } from "react"
import { useFetcher, useLoaderData, useCatch } from "@remix-run/react"
import type { LoaderFunction, ActionFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import styled from "@emotion/styled"
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid"
import type { GridRenderCellParams } from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"
import EastIcon from "@mui/icons-material/East"
import { ThemeProvider } from "@mui/material/styles"
import invariant from "tiny-invariant"
import themeWize from "app/core/utils/themeWize"
import { InputSelect } from "app/core/components/InputSelect"
import ModalBox from "../../../core/components/ModalBox"
import {
  getInnovationTiers,
  addInnovationTier,
  removeInnovationTier,
  updateInnovationTier,
} from "~/models/innovationTier.server"
import type { InnovationTiers } from "~/models/innovationTier.server"
import { getProjects, updateProjects } from "~/models/project.server"

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    secondaryB: true
    secondaryC: true
  }
}

type InnovationTierRecord = {
  id: string
  name: string
  benefits?: string
  requisites?: string
  goals?: string
}

type gridEditToolbarProps = {
  setRows: React.Dispatch<React.SetStateAction<InnovationTierRecord[]>>
  createButtonText: string
}

type LoaderData = {
  innovationTiers: Awaited<ReturnType<typeof getInnovationTiers>>
  projects: Awaited<ReturnType<typeof getProjects>>
}

type newInnovationTier = {
  name: string
  benefits: string
  requisites: string
  goals: string
}

type ProjectRecord = {
  id: number | string
  name: string | null
}

const ModalButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const innovationTier = url.searchParams.get("innovationTier")
  const innovationTiers = await getInnovationTiers()
  const projects = await getProjects({ tierName: innovationTier })
  return json<LoaderData>({
    innovationTiers,
    projects,
  })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const action = formData.get("action")
  let response
  let name, benefits, requisites, goals

  switch (action) {
    case "POST":
      name = formData.get("name") as string
      benefits = formData.get("benefits") as string
      requisites = formData.get("requisites") as string
      goals = formData.get("goals") as string
      invariant(name, "Invalid innovation tier name")
      invariant(name, "Invalid innovation tier benefits")
      invariant(name, "Invalid innovation tier requisites")
      invariant(name, "Invalid innovation tier goals")
      response = await addInnovationTier({ name, benefits, requisites, goals })
      if (response.error) {
        return json({ error: response.error }, { status: 404 })
      }
      return json(response, { status: 201 })

    case "DELETE":
      name = formData.get("name") as string
      invariant(name, "Project status name is required")
      response = await removeInnovationTier({ name })
      if (response.error) {
        return json({ error: response.error }, { status: 400 })
      }
      return json(response, { status: 200 })

    case "UPDATE":
      name = formData.get("name") as string
      benefits = formData.get("benefits") as string
      requisites = formData.get("requisites") as string
      goals = formData.get("goals") as string
      invariant(name, "Invalid innovation tier name")
      invariant(name, "Invalid innovation tier benefits")
      invariant(name, "Invalid innovation tier requisites")
      invariant(name, "Invalid innovation tier goals")
      response = await updateInnovationTier({ name, benefits, requisites, goals })
      if (response.error) {
        return json({ error: response.error }, { status: 400 })
      }
      return json(response, { status: 200 })

    case "UPDATE-PROJECTS":
      const ids = JSON.parse(formData.get("ids") as string)
      const tierName = formData.get("tierName") as string
      invariant(tierName, "Innovation tier name is required")
      response = await updateProjects({ ids, data: { tierName } })
      if (response.error) {
        return json({ error: response.error }, { status: 400 })
      }
      return json(response, { status: 200 })

    default: {
      throw new Error("Something went wrong")
    }
  }
}

const GridEditToolbar = (props: gridEditToolbarProps) => {
  const { setRows, createButtonText } = props
  const handleAddClick = () => {
    const id = "new-value"
    const newName = ""
    setRows((prevRows) => {
      if (prevRows.find((rowValue) => rowValue.id === "new-value")) {
        return [...prevRows]
      }
      return [...prevRows, { id, name: newName, isNew: true }]
    })
  }
  return (
    <GridToolbarContainer>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleAddClick()}
      >
        {createButtonText}
      </Button>
    </GridToolbarContainer>
  )
}

const InnovationTiersGrid = () => {
  const fetcher = useFetcher()
  const { innovationTiers } = useLoaderData() as LoaderData
  const createButtonText = "Create New Innovation Tier"
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [rows, setRows] = useState<InnovationTierRecord[]>(() =>
    innovationTiers.map((item: InnovationTiers) => ({
      id: item.name,
      name: item.name,
      benefits: item.benefits,
      requisites: item.requisites,
      goals: item.goals,
    }))
  )
  const [selectedRowID, setSelectedRowID] = useState("")
  const [selectedTier, setSelectedTier] = useState({ name: "" })
  const [projects, setProjects] = useState<ProjectRecord[]>([])

  useEffect(() => {
    //It handles the fetcher error from the response
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.error) {
        setError(fetcher.data.error)
      } else {
        setError("")
      }

      if (fetcher.data.projects) {
        setProjects(fetcher.data.projects)
      } else {
        setProjects([])
      }
    }
  }, [fetcher])

  useEffect(() => {
    //It changes the rows shown based on admins
    setRows(
      innovationTiers.map((item: InnovationTiers) => ({
        id: item.name,
        name: item.name,
        benefits: item.benefits,
        requisites: item.requisites,
        goals: item.goals,
      }))
    )
  }, [innovationTiers])

  // Set handles for interactions

  const handleRowEditStart = (event: any) => {
    event.defaultMuiPrevented = true
  }

  const handleRowEditStop = (event: any) => {
    event.defaultMuiPrevented = true
  }

  const handleCellFocusOut = (event: any) => {
    event.defaultMuiPrevented = true
  }

  const handleEditClick = (idRef: GridRenderCellParams) => {
    idRef.api.setRowMode(idRef.row.id, "edit")
  }

  // Add new Innovation Tier
  const createNewTier = async (values: newInnovationTier) => {
    try {
      const body = {
        ...values,
        action: "POST",
      }
      await fetcher.submit(body, { method: "post" })
    } catch (error: any) {
      console.error(error)
    }
  }

  const handleSaveClick = async (idRef: GridRenderCellParams) => {
    const id = idRef.row.id

    const row = idRef.api.getRow(id)
    const isValid = await idRef.api.commitRowChange(idRef.row.id)
    const newName = idRef.api.getCellValue(id, "name")
    const newBenefits = idRef.api.getCellValue(id, "benefits")
    const newRequisites = idRef.api.getCellValue(id, "requisites")
    const newGoals = idRef.api.getCellValue(id, "goals")

    if (rows.find((rowValue) => rowValue.name === newName)) {
      console.error("Field Already exists")
      return
    } else {
      console.error("All fields are valid")
    }

    if (row.isNew && isValid) {
      const newValues = {
        name: newName,
        benefits: newBenefits,
        requisites: newRequisites,
        goals: newGoals,
      }
      idRef.api.setRowMode(id, "view")
      await createNewTier(newValues)
      return
    }
    if (isValid) {
      const row = idRef.api.getRow(idRef.row.id)
      let id = idRef.row.id
      await editTierInfo(id, {
        name: newName,
        benefits: newBenefits,
        requisites: newRequisites,
        goals: newGoals,
      })
      idRef.api.updateRows([{ ...row, isNew: false }])
      idRef.api.setRowMode(id, "view")
    }
  }

  const handleCancelClick = async (idRef: GridRenderCellParams) => {
    const id = idRef.row.id
    idRef.api.setRowMode(id, "view")

    const row = idRef.api.getRow(id)
    if (row && row.isNew) {
      await idRef.api.updateRows([{ id, _action: "delete" }])
      setRows((prevRows) => {
        const rowToDeleteIndex = prevRows.length - 1
        return [...rows.slice(0, rowToDeleteIndex), ...rows.slice(rowToDeleteIndex + 1)]
      })
    }
  }

  // Delete Innovation Tier
  const deleteConfirmationHandler = async () => {
    setOpenDeleteModal(false)
    try {
      const body = {
        name: selectedRowID,
        action: "DELETE",
      }
      await fetcher.submit(body, { method: "delete" })
    } catch (error: any) {
      console.error(error)
    }
  }

  const handleDeleteClick = async (idRef: GridRenderCellParams) => {
    let id = idRef.row.id
    const body = {
      innovationTier: id,
    }
    await fetcher.submit(body, { method: "get" })
    setSelectedRowID(() => id)
    setOpenDeleteModal(() => true)
  }

  const handleSubmit = async ({ projectsIds }: { projectsIds: (string | number)[] }) => {
    const body = {
      ids: JSON.stringify(projectsIds),
      tierName: selectedTier.name,
      action: "UPDATE-PROJECTS",
    }
    await fetcher.submit(body, { method: "put" })

    await deleteConfirmationHandler()
  }

  // Edit Innovation Tier
  const editTierInfo = async (id: string, values: newInnovationTier) => {
    try {
      const body = {
        id,
        ...values,
        action: "UPDATE",
      }
      await fetcher.submit(body, { method: "put" })
    } catch (error: any) {
      console.error(error)
    }
  }

  const columns = [
    { field: "name", headerName: "Name", width: 150, editable: true },
    { field: "benefits", headerName: "Benefits", flex: 1, editable: true },
    { field: "requisites", headerName: "Requisites", flex: 1, editable: true },
    { field: "goals", headerName: "Goals", flex: 1, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      renderCell: (idRef: any) => {
        if (idRef.row.id === "new-value") {
          idRef.api.setRowMode(idRef.row.id, "edit")
        }
        const isInEditMode = idRef.api.getRowMode(idRef.row.id) === "edit"
        if (isInEditMode) {
          return (
            <>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleCancelClick(idRef)}
                style={{ marginLeft: 16 }}
              >
                <CancelIcon color="inherit" />
              </Button>

              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleSaveClick(idRef)}
                style={{ marginLeft: 16 }}
              >
                <SaveIcon color="inherit" />
              </Button>
            </>
          )
        }
        return (
          <>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleEditClick(idRef)}
              style={{ marginLeft: 16 }}
            >
              <EditIcon color="inherit" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleDeleteClick(idRef)}
              style={{ marginLeft: 16 }}
            >
              <EastIcon color="inherit" />
            </Button>
          </>
        )
      },
    },
  ]

  const isMergeAction = projects.length > 0

  return (
    <div>
      <h2>Innovation Tiers</h2>
      <div style={{ display: "flex", width: "100%", height: "70vh" }}>
        <div style={{ flexGrow: 1 }}>
          <ThemeProvider theme={themeWize}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <DataGrid
              rows={rows}
              columns={columns}
              rowsPerPageOptions={[50]}
              pageSize={50}
              editMode="row"
              onRowEditStart={handleRowEditStart}
              onRowEditStop={handleRowEditStop}
              onCellFocusOut={handleCellFocusOut}
              components={{
                Toolbar: GridEditToolbar,
              }}
              componentsProps={{
                toolbar: { setRows, createButtonText },
              }}
            />
          </ThemeProvider>
        </div>
      </div>
      {/* Confirmation for deletion */}
      <ModalBox
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        close={() => setOpenDeleteModal(false)}
      >
        <h2>Choose the Innovation Tier to merge {selectedRowID} with </h2>
        <p>This action will delete {selectedRowID}</p>
        <p>This action cannot be undone.</p>
        <br />
        <p>
          {projects.length < 1
            ? "There are no projects"
            : projects.length === 1
            ? "There is 1 project"
            : `There are ${projects.length} projects`}{" "}
          with this category
        </p>
        <br />
        <div>
          <form
            onSubmit={async (values) => {
              await handleSubmit({
                projectsIds: projects.map((project) => project.id),
              })
            }}
          >
            {isMergeAction && (
              <InputSelect
                valuesList={innovationTiers.filter((tier) => tier.name !== selectedRowID)}
                defaultValue=""
                name="tierName"
                label="Innovation Tier to merge with"
                disabled={false}
                value={selectedTier.name}
                handleChange={setSelectedTier}
              />
            )}

            <ModalButtonsContainer>
              <Button className="primary default" onClick={() => setOpenDeleteModal(false)}>
                Cancel
              </Button>
              &nbsp;
              <Button
                className="primary warning"
                disabled={false}
                {...(isMergeAction
                  ? {
                      type: "submit",
                    }
                  : {
                      onClick: async () => {
                        await deleteConfirmationHandler()
                      },
                    })}
              >
                {isMergeAction ? "Merge" : "Delete"}
              </Button>
            </ModalButtonsContainer>
          </form>
        </div>
      </ModalBox>
    </div>
  )
}
export default InnovationTiersGrid

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Innovation Tier not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
