import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from "@mui/material";
import { EditSharp, Close, Delete } from "@mui/icons-material";
import { useState } from "react";
import { ResourceRow } from "./styles";
import { useTransition } from "@remix-run/react";
import { zfd } from "zod-form-data";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import SimpleAutocompleteField from "~/core/components/SimpleAutocompleteField";
import { useFieldArray, ValidatedForm } from "remix-validated-form";

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
  allowEdit: Boolean;
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
  const transition = useTransition();
  const [isEditActive, setIsEditActive] = useState(false);
  const toggleChangeEditView = () => setIsEditActive((prevValue) => !prevValue);
  const [resources, { push: addResource, remove: removeResource }] =
    useFieldArray("resources", { formId: "projectResourcesForm" });

  const resourceTypes = [...new Set(RESOURCE_TYPES.concat(resourceData.types))];
  const resourceProviders = [
    ...new Set(RESOURCE_PROVIDERS.concat(resourceData.providers)),
  ];
  const resourceNames = [...new Set(RESOURCE_NAMES.concat(resourceData.names))];

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
              <IconButton type="reset">
                <Close>Cancel</Close>
              </IconButton>
            ) : (
              <IconButton onClick={() => toggleChangeEditView()}>
                <EditSharp></EditSharp>
              </IconButton>
            ))
          }
        />
        <CardContent>
          {isEditActive && (
            <Button
              disabled={transition.state === "submitting"}
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
          {resources.map((resource, index) => (
            <ResourceRow key={index}>
              <SimpleAutocompleteField
                name={`resources[${index}].type`}
                label="Type"
                options={resourceTypes}
                readOnly={!isEditActive}
              />
              <SimpleAutocompleteField
                name={`resources[${index}].provider`}
                label="Provider/Brand"
                options={resourceProviders}
                readOnly={!isEditActive}
                freeSolo
              />
              <SimpleAutocompleteField
                name={`resources[${index}].name`}
                label="Name/Description"
                options={resourceNames}
                readOnly={!isEditActive}
                freeSolo
              />
              {isEditActive && (
                <IconButton
                  onClick={() => {
                    removeResource(index);
                  }}
                >
                  <Delete>Delete</Delete>
                </IconButton>
              )}
            </ResourceRow>
          ))}
          <Box textAlign="center">
            <Button
              disabled={!isEditActive || transition.state === "submitting"}
              variant="contained"
              type="submit"
            >
              {transition.state === "submitting" ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </CardContent>
      </ValidatedForm>
    </Card>
  );
}