import { FormControlLabel, Switch, Collapse } from "@mui/material";
import { Form } from "@remix-run/react";

export function ProjectForm() {
  return (
    <div>
      <form method="post">
        <div>
          <label>
            <input type="text" name="name" placeholder="Name" />
          </label>
        </div>
        <div>
          <label>
            <input type="text" name="description" placeholder="Problem Statement" />
          </label>
        </div>
        <div>
          <label>
            Your Proposal <input type="text" name="valueStatement" placeholder="Explain us your proposal..." />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}


