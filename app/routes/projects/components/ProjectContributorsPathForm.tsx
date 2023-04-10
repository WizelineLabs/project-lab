import styled from "@emotion/styled";
import { Stack, Button, Collapse } from "@mui/material";
import { useState } from "react";
import LabeledTextField from "~/core/components/LabeledTextField";
import LabeledTextFieldArea from "~/core/components/LabeledTextFieldArea";
import StageCollapsableHeader from "~/core/components/StageCollapsableHeader";
import TextEditor from "~/core/components/TextEditor";

import { FieldArray } from "remix-validated-form";


export default function ProjectContributorsPathForm() {
  const [openedStage, setOpenedStage] = useState(0);

  return (
    <Stack>
      <h2>Ehmm yeah this is the contributors Path Form. Hooray!!</h2>
      <Button
        variant="contained"
        tabIndex={-1}
        type="button"
        // onClick={() => handleNewStage(input)}
      >
        Add new Stage
      </Button>

      <FieldArray name='stages'>
      {(items, { push, remove }) => (
        <>
        <LabeledTextField
          fullWidth
          name="StageName"
          label="Stage Name"
          placeholder="Stage Name"
        />          
        </>
        )}

      </FieldArray>



      <StageCollapsableHeader
        // name={stage.name}
        // openedStage={openedStage}
        // position={stage.position}
        // setOpenedStage={setOpenedStage}

        name={"The name"}
        openedStage={openedStage}
        position={1}
        setOpenedStage={setOpenedStage}
      />
      <Collapse
        style={{ paddingTop: "1em" }}
        // in={openedStage === stage.position}
        in={openedStage === 1}
        timeout="auto"
        unmountOnExit
      >
        <LabeledTextField
          fullWidth
          name="StageName"
          label="Stage Name"
          placeholder="Stage Name"
        />
        <TextEditor
          name="criteria"
          label="Criteria"
          placeholder={"Explain the criteria..."}
        />
        <TextEditor
          name="mission"
          label="Mission"
          placeholder={"Explain the mission..."}
        />


        <h3>Tasks:</h3>
        <TextEditor
          name="taskDescription"
          label="Description"
          placeholder={"Describe de task..."}
        />

      </Collapse>
    </Stack>
  );
}
