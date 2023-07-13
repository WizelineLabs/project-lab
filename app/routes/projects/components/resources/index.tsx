import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
} from "@mui/material";
import { EditSharp, Close, Delete } from "@mui/icons-material";
import { useState } from "react";
import { useSubmit, useNavigation } from "@remix-run/react";
import { zfd } from "zod-form-data";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import SimpleAutocompleteField from "~/core/components/SimpleAutocompleteField";
import {
  useFieldArray,
  ValidatedForm,
  validationError,
} from "remix-validated-form";
import type { Prisma } from "@prisma/client";

const RESOURCE_TYPES = [
  "Cloud Account",
  "Domain",
  "Hardware (cellphone, console)",
  "License",
  "Other",
];

const RESOURCE_PROVIDERS = ["AWS", "GCP", "Azure"];
const RESOURCE_NAMES: string[] = [];

interface IResource {
  type: string;
  provider: string;
  name: string;
}

interface IProps {
  allowEdit: boolean;
  projectResources: IResource[];
  resourceData: { types: string[]; providers: string[]; names: string[] };
}

export const validator = withZod(
  zfd.formData({
    resources: z.array(
      z.object({
        type: zfd.text(),
        provider: zfd.text(),
        name: zfd.text(),
      })
    ),
  })
);

export default function Resources({
  allowEdit = false,
  projectResources,
  resourceData,
}: IProps) {
  const navigation = useNavigation();
  const submit = useSubmit();
  const [isEditActive, setIsEditActive] = useState(false);
  const [resources, { push: addResource, remove: removeResource }] =
    useFieldArray<Prisma.ResourceCreateInput>("resources", {
      formId: "projectResourcesForm",
    });

  const resourceTypes = [...new Set(RESOURCE_TYPES.concat(resourceData.types))];
  const resourceProviders = [
    ...new Set(RESOURCE_PROVIDERS.concat(resourceData.providers)),
  ];
  const resourceNames = [...new Set(RESOURCE_NAMES.concat(resourceData.names))];

  const handleSubmit = async () => {
    const form = document.getElementById(
      "projectResourcesForm"
    ) as HTMLFormElement;
    const result = await validator.validate(form);
    if (result.error != undefined) {
      setIsEditActive(true);
      return validationError(result.error);
    }
    submit(form);
  };

  return (
    <Card>
      <ValidatedForm
        method="post"
        id="projectResourcesForm"
        validator={validator}
        subaction="UPDATE_RESOURCES"
        defaultValues={{ resources: projectResources }}
      >
        <CardHeader
          title="Resources:"
          action={
            allowEdit &&
            (isEditActive ? (
              <IconButton
                type="reset"
                onClick={(event) => {
                  const form = document.getElementById(
                    "projectResourcesForm"
                  ) as HTMLFormElement;
                  form.reset();
                  setIsEditActive(false);
                }}
              >
                <Close>Cancel</Close>
              </IconButton>
            ) : (
              <IconButton onClick={() => setIsEditActive(true)}>
                <EditSharp></EditSharp>
              </IconButton>
            ))
          }
        />
        <CardContent>
          {isEditActive && (
            <Button
              disabled={navigation.state === "submitting"}
              variant="contained"
              type="button"
              sx={{
                position: "absolute",
                marginTop: "-67px",
                marginLeft: "150px",
              }}
              onClick={() => {
                addResource({ type: resourceTypes[0], provider: "", name: "" });
              }}
            >
              Add new resource
            </Button>
          )}

          <Grid container spacing={2} sx={{ marginBottom: "12px" }}>
            {!isEditActive && (
              <>
                <Grid item xs={3}>
                  <b>Type</b>
                </Grid>
                <Grid item xs={3}>
                  <b>Provider/Brand</b>
                </Grid>
                <Grid item xs={5}>
                  <b>Name/Description</b>
                </Grid>
              </>
            )}
            {resources.map((resource, index) => (
              <>
                <Grid item xs={3}>
                  {isEditActive ? (
                    <SimpleAutocompleteField
                      name={`resources[${index}].type`}
                      label="Type"
                      options={resourceTypes}
                    />
                  ) : (
                    resource.type
                  )}
                </Grid>
                <Grid item xs={3}>
                  {isEditActive ? (
                    <SimpleAutocompleteField
                      name={`resources[${index}].provider`}
                      label="Provider/Brand"
                      options={resourceProviders}
                      freeSolo
                    />
                  ) : (
                    resource.provider
                  )}
                </Grid>
                <Grid item xs={5}>
                  {isEditActive ? (
                    <SimpleAutocompleteField
                      name={`resources[${index}].name`}
                      label="Name/Description"
                      options={resourceNames}
                      freeSolo
                    />
                  ) : (
                    resource.name
                  )}
                </Grid>
                <Grid item xs={1}>
                  {isEditActive && (
                    <IconButton
                      onClick={() => {
                        removeResource(index);
                      }}
                    >
                      <Delete>Delete</Delete>
                    </IconButton>
                  )}
                </Grid>
              </>
            ))}
          </Grid>
          {isEditActive && (
            <Box textAlign="center">
              <Button
                disabled={!isEditActive || navigation.state === "submitting"}
                variant="contained"
                type="submit"
                onClick={() => handleSubmit()}
              >
                {navigation.state === "submitting" ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          )}
        </CardContent>
      </ValidatedForm>
    </Card>
  );
}
