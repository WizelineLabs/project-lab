import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
} from "@mui/material";
import { EditSharp, Close, Delete } from "@mui/icons-material";
import { useState } from "react";
import { ResourceRow } from "./styles";


const RESOURCE_TYPES = [
  "Cloud Account",
  "Domain",
  "Hardware (cellphone, console)",
  "License",
  "Other",
];

const RESOURCE_PROVIDERS = ["AWS", "GCP", "Azure"];
const RESOURCE_NAMES: string[] = [];

interface IResource { id: number; type: string, provider: string, name: string };

interface IProps {
  allowEdit: Boolean;
  projectResources: IResource[];
  resourceData: { types: string[], providers: string[], names: string[] };
}

export default function Resources({ allowEdit = false, projectResources, resourceData }: IProps) {
  const [isEditActive, setIsEditActive] = useState(false);
  const toggleChangeEditView = () => setIsEditActive((prevValue) => !prevValue);
  
  const resourceTypes = [...new Set(RESOURCE_TYPES.concat(resourceData.types))];
  const resourceProviders = [...new Set(RESOURCE_PROVIDERS.concat(resourceData.providers))];
  const resourceNames = [...new Set(RESOURCE_NAMES.concat(resourceData.names))]
  return (
    <Card>
      <CardHeader
        title="Resources:"
        action={
          allowEdit && (
            <IconButton onClick={() => toggleChangeEditView()}>
              {isEditActive ? <Close>Cancel</Close> : <EditSharp></EditSharp>}
            </IconButton>
          )
        }
      />
      <CardContent>
        {projectResources.map((resource: IResource) => (
          <ResourceRow
            key={resource.id}
          >
            <Autocomplete
              disablePortal
              options={resourceTypes}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Type" />}
              readOnly={!isEditActive}
              value={resource.type}
            />
            <Autocomplete
              disablePortal
              options={resourceProviders}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Provider/Brand" />
              )}
              readOnly={!isEditActive}
              value={resource.provider}
              freeSolo
            />
            <Autocomplete
              disablePortal
              options={resourceNames}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Name/Description" />
              )}
              readOnly={!isEditActive}
              value={resource.name}
              freeSolo
            />
            {isEditActive && (
              <IconButton>
                <Delete>Delete</Delete>
              </IconButton>
            )}
          </ResourceRow>
        ))}
      </CardContent>
    </Card>
  );
}
