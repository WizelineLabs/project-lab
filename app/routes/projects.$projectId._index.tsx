import ContributorPathReport from "../core/components/ContributorPathReport/index";
import EditSharp from "@mui/icons-material/EditSharp";
import GitHub from "@mui/icons-material/GitHub";
import OpenInNew from "@mui/icons-material/OpenInNew";
import ThumbDownSharp from "@mui/icons-material/ThumbDownSharp";
import ThumbUpSharp from "@mui/icons-material/ThumbUpSharp";
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
  Link,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  useFetcher,
  useNavigation,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import MarkdownStyles from "@uiw/react-markdown-preview/markdown.css";
import MDEditorStyles from "@uiw/react-md-editor/markdown-editor.css";
import { formatDistance } from "date-fns";
import Markdown from "marked-react";
import { useEffect, useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import ApplicantsSection from "~/core/components/ApplicantsSection";
import Comments from "~/core/components/Comments";
import JoinProjectModal from "~/core/components/JoinProjectModal";
import MembershipStatusModal from "~/core/components/MembershipStatusModal";
import RelatedProjectsSection from "~/core/components/RelatedProjectsSection";
import Resources, { validator } from "~/core/components/Resources";
import Header from "~/core/layouts/Header";
import { searchApplicants } from "~/models/applicant.server";
import { checkPermission } from "~/models/authorization.server";
import type { Roles } from "~/models/authorization.server";
import { getComments } from "~/models/comment.server";
import {
  getProjectTeamMember,
  isProjectTeamMember,
  getProject,
  getProjects,
  getProjectResources,
  updateProjectResources,
  getProjectTeamMembers,
} from "~/models/project.server";
import { getDistinctResources } from "~/models/resource.server";
import {
  upvoteProject,
  unvoteProject,
  checkUserVote,
} from "~/models/votes.server";
import { requireProfile, requireUser } from "~/session.server";
import { validateNavigationRedirect } from "~/utils";

export function links() {
  return [
    { rel: "stylesheet", href: MDEditorStyles },
    { rel: "stylesheet", href: MarkdownStyles },
  ];
}

interface voteProject {
  projectId: string;
  profileId: string;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.projectId, "projectId not found");

  const project = await getProject({ id: params.projectId });
  if (!project.id) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await requireUser(request);
  const profile = await requireProfile(request);
  const projectMembers = await getProjectTeamMembers(project.id);
  const isTeamMember = isProjectTeamMember(profile.id, project);
  const projectsList = await getProjects({});
  const membership = getProjectTeamMember(profile.id, projectMembers);
  const profileId = profile.id;
  const isVote = await checkUserVote(project.id, profileId);
  const canEditProject = checkPermission(
    profileId,
    user.role as Roles,
    "edit",
    "project",
    project
  );
  const comments = await getComments(params.projectId);
  // Resources data
  const projectResources = await getProjectResources(params.projectId);
  const resourceData = await getDistinctResources();
  const applicant = await searchApplicants();

  return typedjson({
    canEditProject,
    isTeamMember,
    isVote,
    membership,
    profile,
    project,
    projectsList,
    projectMembers,
    profileId,
    projectId: params.projectId,
    comments,
    projectResources,
    resourceData,
    applicant,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const subaction = form.get("subaction");
  invariant(params.projectId, "projectId could not be found");
  const projectId = params.projectId;
  if (subaction === "POST_VOTE") {
    const profileId = form.get("profileId") as string;
    const isVote = await checkUserVote(projectId, profileId);
    const haveIVoted = isVote > 0 ? true : false;
    if (!haveIVoted) {
      await upvoteProject(projectId, profileId);
    } else {
      await unvoteProject(projectId, profileId);
    }
    return typedjson({ error: "" }, { status: 200 });
  } else if (subaction === "UPDATE_RESOURCES") {
    const profile = await requireProfile(request);
    const user = await requireUser(request);
    const project = await getProject({ id: params.projectId });
    const canEditProject = checkPermission(
      profile.id,
      user.role as Roles,
      "edit",
      "project",
      project
    );

    if (!canEditProject) {
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
      return validationError({
        fieldErrors: {
          formError: "Server failed",
        },
      });
    }
  } else {
    throw new Error("Something went wrong");
  }
};

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data) {
    return [
      {
        title: "Missing Project",
      },
      {
        name: "description",
        content: `There is no Project with the ID of ${params.projectId}. 😢`,
      },
    ];
  }

  const { project } = data;
  return [
    { title: project?.name },
    { name: "description", content: project?.description },
  ];
};

function filterApplicantsByProject(
  applicants: (Omit<Prisma.ApplicantUncheckedCreateInput, "id"> & {
    id: number;
  })[],
  projectId: string
) {
  return applicants.filter((applicant) =>
    applicant.appliedProjectsId?.split(",").includes(projectId)
  );
}

export default function ProjectDetailsPage() {
  const {
    canEditProject,
    isTeamMember,
    isVote,
    membership,
    project,
    projectsList,
    projectMembers,
    profileId,
    projectId,
    comments,
    projectResources,
    resourceData,
    applicant,
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

  const applicantsForCurrentProject = filterApplicantsByProject(
    applicant,
    projectId
  );

  const fetcher = useFetcher();
  const voteForProject = async (values: voteProject) => {
    const body = {
      ...values,
      subaction: "POST_VOTE",
    };
    fetcher.submit(body, { method: "post" });
  };

  const navigation = useNavigation();
  useEffect(() => {
    const isActionRedirect = validateNavigationRedirect(navigation);
    if (isActionRedirect) {
      setShowJoinModal(false);
      setShowMembershipModal(false);
    }
  }, [navigation]);

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
                {project.updatedAt
                  ? formatDistance(new Date(project.updatedAt), new Date(), {
                      addSuffix: true,
                    })
                  : null}
              </Typography>
            </Grid>
            <Grid item>
              {canEditProject ? (
                <IconButton
                  aria-label="Edit"
                  href={`/projects/${projectId}/edit`}
                >
                  <EditSharp />
                </IconButton>
              ) : null}
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
              sx={{ minHeight: 48 }}
            >
              <Grid item>
                <div className="itemHeadName">Owner:</div>
              </Grid>
              <Grid item>
                <div className="itemHeadValue">{`${project.preferredName} ${project.lastName}`}</div>
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
              sx={{ minHeight: 48 }}
            >
              <Grid item>
                <div className="itemHeadName">Status:</div>
              </Grid>
              <Grid item>
                <Chip
                  className="itemHeadValue"
                  component="a"
                  href={`/projects?status=${project.status}`}
                  clickable
                  label={project.status}
                />
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
              sx={{ minHeight: 48 }}
            >
              <Grid item>
                <Link
                  className="itemHeadName"
                  target="_blank"
                  rel="noreferrer"
                  href="https://wizeline.atlassian.net/wiki/spaces/wiki/pages/3075342381/Innovation+Tiers"
                >
                  <b>Innovation Tier</b>
                  <sup>
                    <OpenInNew style={{ fontSize: 10 }} />
                  </sup>
                </Link>
                :
              </Grid>
              <Grid item>
                <Chip
                  component="a"
                  href={`/projects?tier=${project.tierName}`}
                  clickable
                  rel="noreferrer"
                  label={project.tierName}
                />
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
              sx={{ minHeight: 48 }}
            >
              <Grid item>
                <div className="itemHeadName">Labels:</div>
              </Grid>
              <Grid item>
                {project.labels
                  ? project.labels.map((item, index) => (
                      <Chip
                        key={index}
                        component="a"
                        href={`/projects?label=${item.name}`}
                        clickable
                        label={item.name}
                        sx={{ marginRight: 1, marginBottom: 1 }}
                      />
                    ))
                  : null}
              </Grid>
            </Grid>
            {project.slackChannel ? (
              <Grid
                item
                container
                sm={6}
                xs={12}
                spacing={1}
                alignItems="center"
                justifyContent="flex-start"
                direction={{ xs: "column", md: "row" }}
                sx={{ minHeight: 48 }}
              >
                <Grid item>
                  <div className="itemHeadName">Slack Channel:</div>
                </Grid>
                <Grid item>
                  <Link
                    target="_blank"
                    href={`https://wizeline.slack.com/channels/${project.slackChannel.replace(
                      "#",
                      ""
                    )}`}
                  >
                    {project.slackChannel}
                  </Link>
                </Grid>
              </Grid>
            ) : null}
            {project.projectBoard ? (
              <Grid
                item
                container
                sm={6}
                xs={12}
                spacing={1}
                alignItems="center"
                justifyContent="flex-start"
                direction={{ xs: "column", md: "row" }}
                sx={{ minHeight: 48 }}
              >
                <Grid item>
                  <div className="itemHeadName">Project Board:</div>
                </Grid>
                <Grid item>
                  <Link target="_blank" href={project.projectBoard}>
                    {project.projectBoard}
                  </Link>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Paper>
      </Container>
      {isTeamMember ? (
        <div className="wrapper">
          {/* <Stages path={project.stages} project={project} /> */}
        </div>
      ) : null}
      <Container>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader
                title="Description"
                action={
                  <Box sx={{ float: "right" }}>
                    <Button variant="outlined">{project?.votesCount}</Button>
                    &nbsp;
                    <Button
                      variant="contained"
                      onClick={() => handleVote(projectId)}
                      endIcon={isVote ? <ThumbDownSharp /> : <ThumbUpSharp />}
                    >
                      {isVote ? "Unlike" : "Like"}
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

            <Card>
              <CardHeader
                title="GitHub Statistics"
                action={
                  <Button
                    variant="contained"
                    href={`/projects/${project.id}/github-info`}
                    endIcon={<GitHub />}
                  >
                    See Info
                  </Button>
                }
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack direction="column" spacing={1}>
              {project.disciplines && project.disciplines.length > 0 ? (
                <Card>
                  <CardHeader title="Looking for:" />
                  <CardContent>
                    {project.disciplines
                      ? project.disciplines.map((item, index) => (
                          <Chip
                            key={index}
                            component="a"
                            href={`/projects?discipline=${item.name}`}
                            clickable
                            label={item.name}
                            sx={{ marginRight: 1, marginBottom: 1 }}
                          />
                        ))
                      : null}
                  </CardContent>
                </Card>
              ) : null}
              {project.repoUrls ? (
                <Card>
                  <CardHeader title="Repos URLs:" />
                  <CardContent>
                    <ul>
                      {project.repoUrls.map((item, index) => (
                        <li key={index}>
                          <Link target="_blank" href={item.url}>
                            {item.url}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : null}
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

      {project.skills && project.skills.length > 0 ? (
        <Container sx={{ marginBottom: 2 }}>
          <Card>
            <CardHeader title="Skills:" />
            <CardContent>
              {project.skills.map((item, index) => (
                <Chip
                  key={index}
                  component="a"
                  href={`/projects?skill=${item.name}`}
                  clickable
                  label={item.name}
                  sx={{ marginRight: 1, marginBottom: 1 }}
                />
              ))}
            </CardContent>
          </Card>
        </Container>
      ) : null}
      <Container sx={{ marginBottom: 2 }}>
        <RelatedProjectsSection
          allowEdit={canEditProject}
          relatedProjects={project.relatedProjects}
          projectsList={projectsList}
          projectId={projectId}
        />
      </Container>

      <Container sx={{ marginBottom: 2 }}>
        <Resources
          allowEdit={canEditProject}
          projectResources={projectResources}
          resourceData={resourceData}
        />
      </Container>

      <Container sx={{ marginBottom: 2 }}>
        <ContributorPathReport
          project={project}
          projectMembers={projectMembers}
          canEditProject={canEditProject}
        />
      </Container>
      <JoinProjectModal
        projectId={projectId}
        open={showJoinModal}
        handleCloseModal={() => setShowJoinModal(false)}
      />

      <ApplicantsSection
        applicantsForCurrentProject={applicantsForCurrentProject}
      />

      <Container>
        <Comments
          comments={comments}
          projectId={projectId}
          profileId={profileId}
        />
      </Container>

      {membership ? (
        <MembershipStatusModal
          close={() => setShowMembershipModal(false)}
          member={membership}
          open={showMembershipModal}
          project={project}
          projectMembers={projectMembers}
        />
      ) : null}
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError() as Error;

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <div>Project not found</div>;
  }

  return <div>An unexpected error occurred: {error.message}</div>;
}
