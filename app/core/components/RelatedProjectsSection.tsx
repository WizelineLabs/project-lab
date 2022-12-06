import { Link } from "@remix-run/react"
import { useFetcher } from "@remix-run/react"
import { Autocomplete, TextField, Alert, Chip, Box, IconButton } from "@mui/material"
import { EditSharp, Close } from "@mui/icons-material";
import { useState, useEffect } from "react"
interface IProps {
  relatedProjects: any[]
  allowEdit: Boolean
  projectsList: { id: string; name: string }[]
  projectId: string
}

function RelatedProjectsSection({ relatedProjects, allowEdit, projectsList, projectId }: IProps) {
  const fetcher = useFetcher()
  const [isEditActive, setIsEditActive] = useState(false)
  const handleChangeEditView = (val: Boolean) => setIsEditActive(!isEditActive)
  const [selectedRelatedProjects, setSelectedRelatedProjects] = useState(relatedProjects)
  const [error, setError] = useState<string>("")
  const handleChange = (v: any) => {
    setSelectedRelatedProjects(() => v)
  }

  const submitEdition = async () => {
    try {
      const body = {
        ...fetcher.data,
        projectId,
        relatedProjects: JSON.stringify(selectedRelatedProjects),
        action: "EDIT_RELATED_PROJECTS",
      }
      await fetcher.submit(body, { method: "put" })
    } catch (error: any) {
      console.error(error)
    }
    handleChangeEditView(false)
  }

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
    setSelectedRelatedProjects(relatedProjects)
  }, [relatedProjects])

  return (
    <>
      <big>Related Projects</big>
      {/* {JSON.stringify(selectedRelatedProjects,null,2)} */}
      {allowEdit && isEditActive ? (
        <>
          <IconButton sx={{ margin: "1em .5em" }}  onClick={() => handleChangeEditView(false)}>
            <Close>Cancel</Close>
          </IconButton>
        </>
      ) : (
          <IconButton sx={{ margin: "1em .5em" }} onClick={() => handleChangeEditView(true)}>
            <EditSharp ></EditSharp>
          </IconButton>
      )}
      <div>
        {isEditActive && (
          <>
            <fetcher.Form method="post">
              <Autocomplete
                multiple
                id="relatedProjects"
                options={projectsList.filter((proj) => proj.id !== projectId)}
                getOptionLabel={(option) => option.name}
                value={selectedRelatedProjects}
                onChange={(event, value: { id: string; name: string }[] | []) =>
                  handleChange(value)
                }
                defaultValue={relatedProjects}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) => option.name === value.name}
                renderInput={(params) => (
                  <TextField
                    label="Related Projects"
                    {...params}
                    placeholder="Add Related Projects..."
                  />
                )}
              />
              <div className="margin-vertical-separator">
                <button
                  disabled={fetcher.state === "submitting"}
                  className="primary"
                  onClick={() => submitEdition()}
                >
                  Submit
                </button>
              </div>
              {error && <Alert severity="warning">Information could not be saved</Alert>}
            </fetcher.Form>
          </>
        )}
      </div>

      {!isEditActive && (
        <Box>
          {relatedProjects.map((item, i) => {
            return (
              <Link className="link_button" key={i} to={`/projects/${item.id}`} prefetch="render">
                <Chip className="chip-hover" sx={{ margin: "1em .5em" }} label={item?.name}></Chip>
              </Link>
            )
          })}
        </Box>
      )}
    </>
  )
}

export default RelatedProjectsSection
