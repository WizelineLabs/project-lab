import Link from "./Link";
import { EditSharp, Close } from "@mui/icons-material";
import {
  Autocomplete,
  TextField,
  Alert,
  Chip,
  IconButton,
  Button,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { useNavigation } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useState } from "react";
import { useField, ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { validateNavigationRedirect } from "~/utils";

interface ProjectValue {
  id: string;
  name: string;
}

interface IProps {
  relatedProjects: ProjectValue[];
  allowEdit: boolean;
  projectsList: { id: string; name: string }[];
  projectId: string;
}

export const validator = withZod(
  zfd.formData({
    relatedProjects: z.array(
      z.object({
        id: z.string(),
        name: z.string().optional(),
      })
    ),
  })
);

function RelatedProjectsSection({
  relatedProjects,
  allowEdit,
  projectsList,
  projectId,
}: IProps) {
  const [isEditActive, setIsEditActive] = useState(false);
  const handleChangeEditView = (val: boolean) => setIsEditActive(!isEditActive);
  const [selectedRelatedProjects, setSelectedRelatedProjects] =
    useState(relatedProjects);
  const { error } = useField("relatedProjects", {
    formId: "relatedProjectsForm",
  });
  const navigation = useNavigation();

  useEffect(() => {
    const isActionRedirect = validateNavigationRedirect(navigation);
    if (isActionRedirect) {
      setIsEditActive(false);
    }
  }, [navigation]);

  return (
    <>
      <Card>
        <CardHeader
          title="Related Projects:"
          action={
            allowEdit ? (
              isEditActive ? (
                <>
                  <IconButton onClick={() => handleChangeEditView(false)}>
                    <Close>Cancel</Close>
                  </IconButton>
                </>
              ) : (
                <IconButton onClick={() => handleChangeEditView(true)}>
                  <EditSharp></EditSharp>
                </IconButton>
              )
            ) : (
              <></>
            )
          }
        />

        <div>
          {isEditActive ? (
            <>
              <ValidatedForm
                id="relatedProjectsForm"
                action="./updateRelatedProjects"
                method="post"
                validator={validator}
              >
                {selectedRelatedProjects?.map((value, i) => (
                  <input
                    type="hidden"
                    name={`relatedProjects[${i}].id`}
                    key={i}
                    value={value.id}
                  />
                ))}
                <Autocomplete
                  multiple
                  id="relatedProjects"
                  options={projectsList.filter((proj) => proj.id !== projectId)}
                  getOptionLabel={(option) => option.name}
                  value={selectedRelatedProjects}
                  onChange={(
                    event,
                    value: { id: string; name: string }[] | []
                  ) => setSelectedRelatedProjects(value)}
                  defaultValue={relatedProjects}
                  filterSelectedOptions
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  renderInput={(params) => (
                    <TextField
                      name="relateProjects"
                      label="Related Projects"
                      {...params}
                      placeholder="Add Related Projects..."
                    />
                  )}
                />
                {error ? <span>{error}</span> : null}
                <Button
                  variant="contained"
                  type="submit"
                  disabled={navigation.state === "submitting"}
                >
                  Submit
                </Button>
                {error ? (
                  <Alert severity="warning">
                    Information could not be saved
                  </Alert>
                ) : null}
              </ValidatedForm>
            </>
          ) : null}
        </div>
        {!isEditActive ? (
          <CardContent>
            {relatedProjects.map((item, i) => {
              return (
                <Link
                  className="link_button"
                  key={i}
                  to={`/projects/${item.id}`}
                  prefetch="render"
                >
                  <Chip
                    className="chip-hover"
                    sx={{ margin: "1em .5em" }}
                    label={item?.name}
                  ></Chip>
                </Link>
              );
            })}
          </CardContent>
        ) : null}
      </Card>
    </>
  );
}

export default RelatedProjectsSection;
