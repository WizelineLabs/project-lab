import { formatDistance } from "date-fns";
import Markdown from "marked-react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData, useFetcher } from "@remix-run/react";
import invariant from "tiny-invariant";
import { requireProfile, requireUser } from "~/session.server";
import {
  getProjectTeamMember,
  isProjectTeamMember,
  getProject,
} from "~/models/project.server";
import type { ProjectComplete } from "~/models/project.server";

import {
  Card,
  CardContent,
  Chip,
  Stack,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { EditSharp, ThumbUpSharp, ThumbDownSharp } from "@mui/icons-material";
import {
  HeaderInfo,
  DetailMoreHead,
  Like,
  LikeBox,
  EditButton,
} from "./$projectId.styles";
import { adminRoleName } from "app/constants";
import type { Profiles, ProjectMembers } from "@prisma/client";
import ContributorPathReport from "../../core/components/ContributorPathReport/index";
import { useState } from "react";
import JoinProjectModal from "~/core/components/JoinProjectModal";
import {
  upvoteProject,
  unvoteProject,
  checkUserVote,
} from "~/models/votes.server";
import RelatedProjectsSection from "~/core/components/RelatedProjectsSection";

type LoaderData = {
  isAdmin: boolean;
  isTeamMember: boolean;
  membership: ProjectMembers | undefined;
  profile: Profiles;
  project: ProjectComplete;
  profileId: string;
};

type voteProject = {
  projectId: string;
  profileId: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.projectId, "projectId not found");

  const project = await getProject({ id: params.projectId });
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await requireUser(request);
  const profile = await requireProfile(request);
  const isTeamMember = isProjectTeamMember(profile.id, project);

  const membership = getProjectTeamMember(profile.id, project);
  const isAdmin = user.role == adminRoleName;
  const profileId = profile.id;
  return json<LoaderData>({
    isAdmin,
    isTeamMember,
    membership,
    profile,
    project,
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
        return json({ error: "" }, { status: 200 });
      default: {
        throw new Error("Something went wrong");
      }
    }
  } catch (error: any) {
    throw error;
  }
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: "Missing Project",
      description: `There is no Project with the ID of ${params.projectId}. 😢`,
    };
  }

  const { project } = data as LoaderData;
  return {
    title: `${project?.name} milkshake`,
    description: project?.description,
  };
};

export default function ProjectDetailsPage() {
  const handleJoinProject = () => {
    setShowJoinModal(true);
  };

  const handleCloseModal = () => {
    setShowJoinModal(false);
  };

  const { isAdmin, isTeamMember, profile, membership, project, profileId } =
    useLoaderData() as LoaderData;
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);

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

  return (
    <>
      <div className="wrapper">
        <HeaderInfo>
          <div className="headerInfo--action">
            <div className="headerInfo--edit">
              {(isTeamMember || isAdmin) && (
                <Link to={`/projects/edit/${project.id}`}>
                  <EditButton>
                    <EditSharp />
                  </EditButton>
                </Link>
              )}
            </div>
          </div>
          <Grid container justifyContent="space-between">
            <Grid item xs={12} className="">
              <div className="titleProposal">
                <h1>{project.name}</h1>
              </div>
              <div className="descriptionProposal">{project.description}</div>
              <div className="lastUpdateProposal">
                Last update:{" "}
                {project.updatedAt && formatDistance(new Date(project.updatedAt), new Date(), {
                  addSuffix: true,
                })}
              </div>
            </Grid>
          </Grid>
        </HeaderInfo>
      </div>
      <div className="wrapper">
        <DetailMoreHead>
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
                <Stack direction="row" spacing={1}>
                  {project.labels && project.labels.map((item, index) => (
                    <Chip key={index} label={item.name} />
                  ))}
                </Stack>
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
        </DetailMoreHead>
      </div>
      {isTeamMember && (
        <div className="wrapper">
          {/* <Stages path={project.stages} project={project} /> */}
        </div>
      )}
      <div className="wrapper">
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <LikeBox>
                  <Like>
                    <div className="like-bubble">
                      <span>{project?.votes?.length}</span>
                    </div>
                    <Button
                      className="primary"
                      onClick={() => handleVote(project.id || "")}
                    >
                      {project.votes && project.votes.filter((vote) => {
                        return vote.profileId === profile.id;
                      }).length > 0 ? (
                        <>
                          {"Unlike"}&nbsp;
                          <ThumbDownSharp />
                        </>
                      ) : (
                        <>
                          {"Like"}&nbsp;
                          <ThumbUpSharp />
                        </>
                      )}
                    </Button>
                  </Like>
                </LikeBox>
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
                <Card variant="outlined">
                  <CardContent>
                    <big>Slack Channel:</big>
                    <Stack direction="row" spacing={1}>
                      {project.slackChannel}
                    </Stack>
                  </CardContent>
                </Card>
              )}
              {project.repoUrls && (
                <Card variant="outlined">
                  <CardContent>
                    <big>Repos URLs:</big>
                    <Box
                      component="form"
                      sx={{
                        "& .MuiTextField-root": { width: "100%" },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      {project.repoUrls.map((item, index) => (
                        <Stack spacing={2} key={index}>
                          <a href={item.url} target="_blank" rel="noreferrer">
                            {item.url}
                          </a>
                        </Stack>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}
              {project.skills && project.skills.length > 0 && (
                <Card variant="outlined">
                  <CardContent>
                    <big>Skills:</big>
                    <Stack direction="row" spacing={1}>
                      {project.skills.map((item, index) => (
                        <Chip key={index} label={item.name} />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
              {project.disciplines && project.disciplines.length > 0 && (
                <Card variant="outlined">
                  <CardContent>
                    <big>Looking for:</big>
                    <Stack direction="row" spacing={1}>
                      {project.disciplines && project.disciplines.map((item, index) => (
                        <Chip key={index} label={item.name} />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
              {isTeamMember ? (
                <Button
                  className="primary large"
                  // disabled={joinProjectButton}
                  // onClick={() => setShowModal(true)}
                >
                  {membership?.active
                    ? "Suspend my Membership"
                    : "Join Project Again"}
                </Button>
              ) : (
                project.helpWanted && (
                  <Button className="primary large" onClick={handleJoinProject}>
                    Want to Join?
                  </Button>
                )
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </div>
      <div className="wrapper">
        <ContributorPathReport project={project} />
      </div>
      <JoinProjectModal
        projectId={project.id || ""}
        open={showJoinModal}
        handleCloseModal={handleCloseModal}
      />
      <div className="wrapper">
        <RelatedProjectsSection allowEdit={true} relatedProjects={project.relatedProjects}/>
      </div>
      {/*
      <div className="wrapper">
        <Comments projectId={project.id} />
      </div>
     
      {membership && (
        <ProjectConfirmationModal
          close={() => setShowModal(false)}
          handleClose={() => setShowModal(false)}
          label={"confirm"}
          member={member}
          onClick={updateProjectMemberHandle}
          open={showModal}
          project={project}
        />
      )} */}
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
