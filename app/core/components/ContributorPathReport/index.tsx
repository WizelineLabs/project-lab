import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp";
import CheckBoxOutlineBlankSharpIcon from "@mui/icons-material/CheckBoxOutlineBlankSharp";
import EditSharp from "@mui/icons-material/EditSharp";

import {
  CompleteIcon,
  IncompleteIcon,
  TipBubble,
  HtmlTooltip,
} from "./ContributorPathReport.styles";

import type {
  ContributorPath,
  ProjectMember,
  ProjectTask,
  Stage,
} from "~/core/interfaces/ContributorPathReport";
import { Grid, IconButton } from "@mui/material";

interface IProps {
  project: any;
  isTeamMember: boolean;
  isAdmin: boolean;
}

export const ContributorPathReport = ({
  project,
  isTeamMember,
  isAdmin,
}: IProps) => {
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="flext-start">
        <big>
          Contributors (
          {
            project.projectMembers?.filter((member: ProjectMember) => {
              return member.active;
            }).length
          }{" "}
          active)
        </big>
        {(isTeamMember || isAdmin) && (
          <IconButton
            aria-label="Edit"
            href={`/projects/${project.id}/members`}
          >
            <EditSharp />
          </IconButton>
        )}
      </Grid>
      <table width="100%" className="table-project-members">
        <thead>
          <tr>
            <th>Active</th>
            <th>Name(s)</th>
            <th>Role(s)</th>
            <th>Skills</th>
            <th>
              H.P.W.
              <br />
              <HtmlTooltip title="Hours per Week">
                <TipBubble>?</TipBubble>
              </HtmlTooltip>
            </th>
            {project.stages?.map((stage: Stage, i: number) => (
              <th key={i}>
                {stage.name}
                <br />
                {stage.projectTasks?.map(
                  (task: ProjectTask, taskIndex: number) => (
                    <HtmlTooltip key={taskIndex} title={task.description}>
                      <TipBubble>{taskIndex + 1}</TipBubble>
                    </HtmlTooltip>
                  )
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {project.projectMembers?.map(
            (member: ProjectMember, memberIndex: number) => {
              const projectTaskIds: any = member.contributorPath.map(
                (cp: ContributorPath) => cp.projectTaskId
              );

              return (
                <tr key={memberIndex}>
                  <td align="center">
                    {member.active ? (
                      <CompleteIcon>
                        <CheckSharpIcon />
                      </CompleteIcon>
                    ) : (
                      <IncompleteIcon>
                        <ClearSharpIcon />
                      </IncompleteIcon>
                    )}
                  </td>

                  <td>
                    <a href={`mailto:${member.profile.email}`}>
                      {member.profile?.firstName} {member.profile?.lastName}
                    </a>
                  </td>

                  <td>{member.role?.map((skill) => skill.name).join(", ")}</td>

                  <td>
                    {member.practicedSkills
                      ?.map((skill) => skill.name)
                      .join(", ")}
                  </td>

                  <td align="center">{member.hoursPerWeek}</td>
                  {project.stages?.map((stage: Stage, stageIndex: number) => (
                    <td key={stageIndex}>
                      <ul>
                        {stage.projectTasks?.map(
                          (task: ProjectTask, taskIndex: number) => (
                            <li key={taskIndex}>
                              {projectTaskIds.includes(task.id) ? (
                                <CompleteIcon>
                                  <CheckBoxSharpIcon />
                                </CompleteIcon>
                              ) : (
                                <>
                                  <IncompleteIcon>
                                    <CheckBoxOutlineBlankSharpIcon />
                                  </IncompleteIcon>
                                  {""}
                                </>
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    </td>
                  ))}
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </>
  );
};

export default ContributorPathReport;
