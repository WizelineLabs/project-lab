import { formatDistance } from "date-fns";
import Markdown from "marked-react";
import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { useCatch, useFetcher, useTransition } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { TypedMetaFunction } from "remix-typedjson";
import invariant from "tiny-invariant";
import { requireProfile, requireUser } from "~/session.server";
import {
  getProjectTeamMember,
  isProjectTeamMember,
  getProject,
  getProjects,
} from "~/models/project.server";

import {
  Card,
  CardContent,
  Chip,
  Stack,
  Grid,
  Box,
  Button,
  IconButton,
  Tooltip,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { EditSharp, ThumbUpSharp, ThumbDownSharp } from "@mui/icons-material";
import { adminRoleName } from "app/constants";
import ContributorPathReport from "../../../core/components/ContributorPathReport/index";
import { useEffect, useState } from "react";
import JoinProjectModal from "~/core/components/JoinProjectModal";
import {
  upvoteProject,
  unvoteProject,
  checkUserVote,
} from "~/models/votes.server";
import RelatedProjectsSection from "~/core/components/RelatedProjectsSection";
import Header from "~/core/layouts/Header";
import { ArchiveProject } from "~/core/components/ArchiveProject";
import { UnarchiveProject } from "~/core/components/UnarchiveProject";

import MembershipStatusModal from "~/core/components/MembershipStatusModal";

type voteProject = {
  projectId: string;
  profileId: string;
};

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.projectId, "projectId not found");

  const project = await getProject({ id: params.projectId });
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await requireUser(request);
  const profile = await requireProfile(request);
  const isTeamMember = isProjectTeamMember(profile.id, project);
  const projectsList = await getProjects({});

  const membership = getProjectTeamMember(profile.id, project);
  const isAdmin = user.role == adminRoleName;
  const profileId = profile.id;
  return typedjson({
    isAdmin,
    isTeamMember,
    membership,
    profile,
    project,
    projectsList,
    profileId,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("action");
  try {
    switch (action) {
      case "POST_VOTE":
        const projectId = form.get("projectId") as string;
        const profileId = form.get("profileId") as string;
        const isVote = await checkUserVote(projectId, profileId);

        const haveIVoted = isVote > 0 ? true : false;
        if (!haveIVoted) {
          await upvoteProject(projectId, profileId);
        } else {
          await unvoteProject(projectId, profileId);
        }
        return typedjson({ error: "" }, { status: 200 });
      default: {
        throw new Error("Something went wrong");
      }
    }
  } catch (error: any) {
    throw error;
  }
};

export const meta: TypedMetaFunction<typeof loader> = ({ data, params }) => {
  if (!data) {
    return {
      title: "Missing Project",
      description: `There is no Project with the ID of ${params.projectId}. 😢`,
    };
  }

  const { project } = data;
  return {
    title: `${project?.name} milkshake`,
    description: project?.description,
  };
};

export default function ProjectDetailsPage() {
  const {
    isAdmin,
    isTeamMember,
    profile,
    membership,
    project,
    projectsList,
    profileId,
  } = useTypedLoaderData<typeof loader>();
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [showMembershipModal, setShowMembershipModal] =
    useState<boolean>(false);

  invariant(project, "project not found");

  const handleVote = async (id: string) => {
    const payload = { projectId: id, profileId: profileId };
    await voteForProject(payload);
    return;
  };

  const fetcher = useFetcher();
  const voteForProject = async (values: voteProject) => {
    try {
      const body = {
        ...values,
        action: "POST_VOTE",
      };
      await fetcher.submit(body, { method: "post" });
    } catch (error: any) {
      console.error(error);
    }
  };

  const transition = useTransition();
  useEffect(() => {
    if (transition.type == "actionRedirect") {
      setShowJoinModal(false);
      setShowMembershipModal(false);
    }
  }, [transition]);

  const voteCount = project.votes?.filter(
    (vote) => vote.profileId === profile.id
  ).length;

  return (
    <>
      <Header title={project.name || ""} />
      {project.isArchived && <Header title="(Archived)" />}

      <Container sx={{ marginBottom: 2 }}>
        <Paper
          sx={{
            paddingLeft: 2,
            paddingRight: 2,
            paddingBottom: 2,
          }}
        >
          <Grid container justifyContent="space-between">
            <Grid item>
              <h1 style={{ marginBottom: 0 }}>{project.name}</h1>
              <Typography color="text.secondary">
                Last update:{" "}
                {project.updatedAt &&
                  formatDistance(new Date(project.updatedAt), new Date(), {
                    addSuffix: true,
                  })}
              </Typography>
            </Grid>
            <Grid item>
              {(isTeamMember || isAdmin) && (
                <Tooltip title="Edit project">
                  <IconButton
                    aria-label="Edit"
                    href={`/projects/${project.id}/edit`}
                  >
                    <EditSharp />
                  </IconButton>
                </Tooltip>
              )}

              {(isTeamMember || isAdmin) &&
                (!project?.isArchived ? (
                  <ArchiveProject projectId={project.id} />
                ) : (
                  <UnarchiveProject projectId={project.id} />
                ))}
            </Grid>
          </Grid>
          <p className="descriptionProposal">{project.description}</p>
        </Paper>
      </Container>
      <Container sx={{ marginBottom: 2 }}>
        <Paper sx={{ padding: 2 }}>
          <Grid container alignItems="flex-start" justifyContent="flex-start">
            <Grid
              item
              container
              sm={6}
              xs={12}
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
              direction={{ xs: "column", md: "row" }}
            >
              <Grid item>
                <div className="itemHeadName">Owner:</div>{" "}
              </Grid>
              <Grid item>
                <div className="itemHeadValue">{`${project.owner?.firstName} ${project.owner?.lastName}`}</div>
              </Grid>
            </Grid>
            <Grid
              item
              container
              sm={6}
              xs={12}
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
              direction={{ xs: "column", md: "row" }}
            >
              <Grid item>
                <div className="itemHeadName">Status:</div>{" "}
              </Grid>
              <Grid item>
                <div className="itemHeadValue">{project.status}</div>
              </Grid>
            </Grid>
            <Grid
              item
              container
              sm={6}
              xs={12}
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
              direction={{ xs: "column", md: "row" }}
            >
              <Grid item>
                <div className="itemHeadName">Tier:</div>{" "}
              </Grid>
              <Grid item>
                <div className="itemHeadValue">{project.tierName}</div>
              </Grid>
            </Grid>
            <Grid
              item
              container
              sm={6}
              xs={12}
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
              direction={{ xs: "column", md: "row" }}
            >
              <Grid item>
                <div className="itemHeadName">Labels:</div>
              </Grid>
              <Grid item>
                {project.labels &&
                  project.labels.map((item, index) => (
                    <Chip
                      key={index}
                      label={item.name}
                      sx={{ marginRight: 1, marginBottom: 1 }}
                    />
                  ))}
              </Grid>
            </Grid>

            <Grid
              item
              container
              sm={6}
              xs={12}
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
              direction={{ xs: "column", md: "row" }}
            >
              <Grid item>
                <div className="itemHeadName">Innovation Tier:</div>
              </Grid>
              <Grid item>
                <a
                  href="https://wizeline.atlassian.net/wiki/spaces/wiki/pages/3075342381/Innovation+Tiers"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="itemHeadValue innovationTier">
                    {project.tierName}
                  </div>
                </a>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      {isTeamMember && (
        <div className="wrapper">
          {/* <Stages path={project.stages} project={project} /> */}
        </div>
      )}
      <Container>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ float: "right" }}>
                  <Button variant="outlined">{project?.votes?.length}</Button>
                  &nbsp;
                  <Button
                    variant="contained"
                    onClick={() => handleVote(project.id || "")}
                    endIcon={voteCount ? <ThumbDownSharp /> : <ThumbUpSharp />}
                  >
                    {voteCount ? "Unlike" : "Like"}
                  </Button>
                </Box>
                <h2>Description</h2>
                <div>
                  <Markdown>
                    {project.valueStatement ? project.valueStatement : ""}
                  </Markdown>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="column" spacing={1}>
              {project.slackChannel && (
                <Card>
                  <CardContent>
                    <big>Slack Channel:</big>
                    <Stack direction="row" spacing={1}>
                      {project.slackChannel}
                    </Stack>
                  </CardContent>
                </Card>
              )}
              {project.repoUrls && (
                <Card>
                  <CardContent>
                    <big>Repos URLs:</big>
                    <ul>
                      {project.repoUrls.map((item, index) => (
                        <li key={index}>
                          <a href={item.url} target="_blank" rel="noreferrer">
                            {item.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {project.skills && project.skills.length > 0 && (
                <Card>
                  <CardContent>
                    <big>Skills:</big>
                    {project.skills.map((item, index) => (
                      <Chip
                        key={index}
                        label={item.name}
                        sx={{ marginRight: 1, marginBottom: 1 }}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}
              {project.disciplines && project.disciplines.length > 0 && (
                <Card>
                  <CardContent>
                    <big>Looking for:</big>
                    {project.disciplines &&
                      project.disciplines.map((item, index) => (
                        <Chip
                          key={index}
                          label={item.name}
                          sx={{ marginRight: 1, marginBottom: 1 }}
                        />
                      ))}
                  </CardContent>
                </Card>
              )}
              {isTeamMember ? (
                <Button
                  variant="contained"
                  disabled={showMembershipModal}
                  onClick={() => setShowMembershipModal(true)}
                >
                  {membership?.active
                    ? "Suspend my Membership"
                    : "Join Project Again"}
                </Button>
              ) : (
                project.helpWanted && (
                  <Button
                    variant="contained"
                    onClick={() => setShowJoinModal(true)}
                  >
                    Want to Join?
                  </Button>
                )
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </Container>
      <Container>
        <Paper sx={{ padding: 2, marginBottom: 2 }}>
          <RelatedProjectsSection
            allowEdit={isTeamMember || isAdmin}
            relatedProjects={project.relatedProjects}
            projectsList={projectsList}
            projectId={project.id || ""}
          />
        </Paper>
      </Container>
      <Container>
        <ContributorPathReport
          project={project}
          isTeamMember={isTeamMember}
          isAdmin={isAdmin}
        />
      </Container>
      <JoinProjectModal
        projectId={project.id || ""}
        open={showJoinModal}
        handleCloseModal={() => setShowJoinModal(false)}
      />

      {/* <div className="wrapper">
        <Comments projectId={project.id} />
      </div> */}

      {membership && (
        <MembershipStatusModal
          close={() => setShowMembershipModal(false)}
          member={membership}
          open={showMembershipModal}
          project={project}
        />
      )}
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Project not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
