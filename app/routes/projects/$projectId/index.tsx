import { formatDistance } from "date-fns";
import Markdown from "marked-react";
import type { ActionFunction, LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
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
  getProjectResources,
} from "~/models/project.server";
import { getDistinctResources } from "~/models/resource.server";

import {
  Card,
  CardContent,
  Chip,
  Stack,
  Grid,
  Box,
  Button,
  Container,
  Paper,
  IconButton,
  Typography,
  CardHeader,
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
import MembershipStatusModal from "~/core/components/MembershipStatusModal";
import { getComments } from "~/models/comment.server";
import Comments from "~/core/components/Comments";

import MDEditorStyles from "@uiw/react-md-editor/markdown-editor.css";
import MarkdownStyles from "@uiw/react-markdown-preview/markdown.css";
import Resources from "../components/resources";
import { validationError } from "remix-validated-form";
import { validator } from "~/routes/projects/components/resources";
import { updateProjectResources } from "~/models/project.server";

export function links() {
  return [
    { rel: "stylesheet", href: MDEditorStyles },
    { rel: "stylesheet", href: MarkdownStyles },
  ];
}

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

  const comments = await getComments(params.projectId);

  // Resources data
  const projectResources = await getProjectResources(params.projectId);
  // const projectResources = [
  //   { type: "Cloud Account", provider: "AWS", name: "Some AWS account" },
  //   { type: "Hardware (cellphone, console)", provider: "Nintendo", name: "Nintendo Switch" },
  // ];
  const resourceData = await getDistinctResources();
  // const resourceData = {
  //   types: [
  //     "New type",
  //     "Uncommon type"
  //   ],
  //   providers: [
  //     "Meta",
  //     "Oracle",
  //     "IBM"
  //   ],
  //   names: [
  //     "Some resource coming from DB",
  //     "Some other resource coming from DB",
  //     "Yet another resource coming from DB",
  //   ]
  // }

  return typedjson({
    isAdmin,
    isTeamMember,
    membership,
    profile,
    project,
    projectsList,
    profileId,
    projectId: params.projectId,
    comments,
    projectResources,
    resourceData
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const subaction = form.get("subaction");
  try {
    invariant(params.projectId, "projectId could not be found");
    const projectId = params.projectId;
    switch (subaction) {
      case "POST_VOTE":
        const profileId = form.get("profileId") as string;
        const isVote = await checkUserVote(projectId, profileId);

        const haveIVoted = isVote > 0 ? true : false;
        if (!haveIVoted) {
          await upvoteProject(projectId, profileId);
        } else {
          await unvoteProject(projectId, profileId);
        }
        return typedjson({ error: "" }, { status: 200 });
      case "UPDATE_RESOURCES":
        console.log('params: ', params);
        const profile = await requireProfile(request);
        const user = await requireUser(request);
        const project = await getProject({ id: params.projectId });
        const isAdmin = user.role == adminRoleName;
        const isTeamMember = isProjectTeamMember(profile.id, project);

        if (!isAdmin && !isTeamMember) {
          return validationError({
            fieldErrors: {
              formError: "Operation not allowed",
            },
          });
        }

        const result = await validator.validate(form);
        if (result.error != undefined) return validationError(result.error);

        try {
          await updateProjectResources(projectId, result.data.resources);
          return redirect(`/projects/${projectId}`);
        } catch (e) {
          console.log(e);
          return validationError({
            fieldErrors: {
              formError: "Server failed",
            },
          });
        }
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
    projectId,
    comments,
    projectResources,
    resourceData
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
        subaction: "POST_VOTE",
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
                <IconButton
                  aria-label="Edit"
                  href={`/projects/${projectId}/edit`}
                >
                  <EditSharp />
                </IconButton>
              )}
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
              <CardHeader
                title="Description"
                action={
                  <Box sx={{ float: "right" }}>
                    <Button variant="outlined">{project?.votes?.length}</Button>
                    &nbsp;
                    <Button
                      variant="contained"
                      onClick={() => handleVote(projectId)}
                      endIcon={
                        voteCount ? <ThumbDownSharp /> : <ThumbUpSharp />
                      }
                    >
                      {voteCount ? "Unlike" : "Like"}
                    </Button>
                  </Box>
                }
              />
              <CardContent>
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
                  <CardHeader title="Slack Channel:" />
                  <CardContent>
                    <Stack direction="row" spacing={1}>
                      {project.slackChannel}
                    </Stack>
                  </CardContent>
                </Card>
              )}
              {project.repoUrls && (
                <Card>
                  <CardHeader title="Repos URLs:" />
                  <CardContent>
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
                  <CardHeader title="Skills:" />
                  <CardContent>
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
                  <CardHeader title="Looking for:" />
                  <CardContent>
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
      <Container sx={{ marginBottom: 2 }}>
        <RelatedProjectsSection
          allowEdit={isTeamMember || isAdmin}
          relatedProjects={project.relatedProjects}
          projectsList={projectsList}
          projectId={projectId}
        />
      </Container>
      <Container sx={{ marginBottom: 2 }}>
        <ContributorPathReport
          project={project}
          isTeamMember={isTeamMember}
          isAdmin={isAdmin}
        />
      </Container>
      <JoinProjectModal
        projectId={projectId}
        open={showJoinModal}
        handleCloseModal={() => setShowJoinModal(false)}
      />

      <Container sx={{ marginBottom: 2 }}>
        <Resources allowEdit={isTeamMember || isAdmin} projectResources={projectResources} resourceData={resourceData}  />
      </Container>

      <Container>
        <Comments
          comments={comments}
          projectId={projectId}
          profileId={profileId}
        />
      </Container>

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
