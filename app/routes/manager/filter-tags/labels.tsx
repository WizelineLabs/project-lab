import React, { useState, useEffect } from "react"
import { useFetcher, useLoaderData, useCatch } from "@remix-run/react"
import type { LoaderFunction, ActionFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import type { GridRenderCellParams } from "@mui/x-data-grid"
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"
import { ThemeProvider } from "@mui/material/styles"
import invariant from "tiny-invariant"

import themeWize from "app/core/utils/themeWize"
import ConfirmationModal from "../../../core/components/ConfirmationModal"
import { getLabels, addLabel, removeLabel, updateLabel } from "~/models/label.server"

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    secondaryB: true
    secondaryC: true
  }
}

type LabelRecord = {
  id: number | string
  name: string | null
}

type gridEditToolbarProps = {
  setRows: React.Dispatch<React.SetStateAction<LabelRecord[]>>
  createButtonText: string
}

type LoaderData = {
  labels: Awaited<ReturnType<typeof getLabels>>
}

type newLabel = {
  name: string
}

export const loader: LoaderFunction = async () => {
  const labels = await getLabels()
  return json<LoaderData>({
    labels,
  })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const action = formData.get("action")
  let response, id, name

  try {
    switch (action) {
      case "POST":
        name = formData.get("name") as string
        invariant(name, "Invalid label name")
        response = await addLabel({ name })
        return json(response, { status: 201 })

      case "DELETE":
        id = formData.get("id") as string
        invariant(id, "Label Id is required")
        response = await removeLabel({ id })
        return json({ error: "" }, { status: 200 })

      case "UPDATE":
        id = formData.get("id") as string
        name = formData.get("name") as string
        invariant(id, "Label Id is required")
        response = await updateLabel({ id, name })
        return json({ error: "" }, { status: 200 })

      default: {
        throw new Error("Something went wrong")
      }
    }
  } catch (e: any) {
    switch (e.code) {
      case "NOT_FOUND":
        return json({ error: e.message }, { status: 404 })
      default:
        throw e
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

export default function LabelsDataGrid() {
  const fetcher = useFetcher()
  const { labels } = useLoaderData() as LoaderData
  const createButtonText = "Create New Label"
  const [error, setError] = useState<string>("")
  const [rows, setRows] = useState<LabelRecord[]>(() =>
    labels.map((item: LabelRecord) => ({
      id: item.id,
      name: item.name,
    }))
  )

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [selectedRowID, setSelectedRowID] = useState("")

  useEffect(() => {
    //It handles the fetcher error from the response
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.error) {
        setError(fetcher.data.error)
      } else {
        setError("")
      }
    }
  }, [fetcher])

  useEffect(() => {
    //It changes the rows shown based on admins
    setRows(
      labels.map((item: LabelRecord) => ({
        id: item.id,
        name: item.name,
      }))
    )
  }, [labels])

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

  // Add new label
  const createNewLabel = async (values: newLabel) => {
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

  const handleSaveClick = async (idRef: GridRenderCellParams) => {
    const id = idRef.row.id

    const row = idRef.api.getRow(id)
    const isValid = await idRef.api.commitRowChange(idRef.row.id)
    const newName = idRef.api.getCellValue(id, "name")

    if (labels.find((rowValue) => rowValue.name === newName)) {
      setError("Field Already exists")
      return
    }

    if (!newName) {
      setError("Field Name is required")
      return
    }

    if (row.isNew && isValid) {
      const newValues = { name: newName }
      idRef.api.setRowMode(id, "view")
      await createNewLabel(newValues)
      return
    }
    if (isValid) {
      const row = idRef.api.getRow(idRef.row.id)
      let id = idRef.row.id
      await editLabelInfo(id, { name: newName })
      idRef.api.updateRows([{ ...row, isNew: false }])
      idRef.api.setRowMode(id, "view")
    }
  }

  // Delete label
  const deleteConfirmationHandler = async () => {
    setOpenDeleteModal(false)
    try {
      const body = {
        id: selectedRowID,
        action: "DELETE",
      }
      await fetcher.submit(body, { method: "delete" })
    } catch (error: any) {
      console.error(error)
    }
  }

  const handleDeleteClick = (idRef: GridRenderCellParams) => {
    let id = idRef.row.id
    setSelectedRowID(() => id)
    setOpenDeleteModal(() => true)
  }

  // Edit label
  const editLabelInfo = async (id: string, values: newLabel) => {
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
    { field: "name", headerName: "Name", width: 300, editable: true },

    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      cellClassName: "actions",
      renderCell: (idRef: GridRenderCellParams) => {
        if (idRef.row.id === "new-value") {
          idRef.api.setRowMode(idRef.row.id, "edit")
          idRef.api.setCellFocus(idRef.row.id, "name")
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
              <DeleteIcon color="inherit" />
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <div>
      <h2>Labels</h2>
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
      <ConfirmationModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        close={() => setOpenDeleteModal(false)}
        label="Delete"
        className="warning"
        disabled={false}
        onClick={async () => {
          deleteConfirmationHandler()
        }}
      >
        <h2>Are you sure you want to delete this Label ?</h2>
        <p>This action cannot be undone.</p>
        <br />
      </ConfirmationModal>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Label not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
