import {
  getGitHubProfileByEmail,
  getGitHubProjectsByEmail,
  getFullProfileByEmail,
  updateGithubUser,
} from "../models/profile.server";
import BusinessIcon from "@mui/icons-material/Business";
import EditSharp from "@mui/icons-material/EditSharp";
import GitHubIcon from "@mui/icons-material/GitHub";
import GroupsIcon from "@mui/icons-material/Groups";
import PlaceIcon from "@mui/icons-material/Place";
import SaveIcon from "@mui/icons-material/Save";
import WorkIcon from "@mui/icons-material/Work";
import {
  Box,
  Container,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
  Typography,
  Alert,
  AlertTitle,
  TextField,
  Button,
  Avatar,
  Link,
  Chip,
  IconButton,
  CardActionArea,
  CardActions,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { adminRoleName } from "app/constants";
import Header from "app/core/layouts/Header";
import { useState } from "react";
import { redirect } from "remix-typedjson";
import { ValidatedForm, useField, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { createExperience } from "~/models/experience.server";
import { requireProfile, requireUser } from "~/session.server";

interface LoaderData {
  profileData: Awaited<ReturnType<typeof getFullProfileByEmail>>;
  githubProfileData: Awaited<ReturnType<typeof getGitHubProfileByEmail>> & {
    githubProfileData?: {
      username: string;
      avatarUrl: string;
      firstName: string;
      lastName: string;
    };
  };
  githubProjects: Awaited<ReturnType<typeof getGitHubProjectsByEmail>>;
  canEdit: boolean;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    invariant(params.email, "email could not be found");
    const email = params.email;
    const profile = await requireProfile(request);
    const user = await requireUser(request);
    const isAdmin = user.role == adminRoleName;

    const [profileData, githubProfileData, githubProjects] = await Promise.all([
      getFullProfileByEmail(email),
      getGitHubProfileByEmail(email),
      getGitHubProjectsByEmail(email),
    ]);
    const canEdit = isAdmin || profileData?.id.toString() === profile.id;
    return {
      profileData,
      githubProfileData,
      githubProjects,
      canEdit,
    };
  } catch (Error) {
    console.error("Error loading Github data:", Error);

    return {
      error: "Error loading Github data",
    };
  }
};

export const validator = withZod(
  zfd.formData({
    comentario: z.string().min(10),
  })
);

const githubUserValidator = withZod(
  zfd.formData({
    githubUser: z
      .string()
      .regex(
        /^(^$)|[a-zA-Z0-9]{1}[a-zA-Z0-9-]{0,37}[a-zA-Z0-9]{1}$/,
        "Github username is invalid"
      ),
    profileId: z.string().min(1),
  })
);

export const action: ActionFunction = async ({ request }) => {
  const profile = await requireProfile(request);
  const user = await requireUser(request);
  const isAdmin = user.role == adminRoleName;
  const form = await request.formData();
  const subaction = form.get("subaction");
  const canPerformAction =
    isAdmin || form.get("profileId")?.toString() === profile.id;

  const email = (form.get("profileEmail") as string) || profile.email;

  if (!canPerformAction)
    throw new Response("Not authorized", {
      status: 403,
    });

  if (subaction === "CREATE_EXPERIENCE") {
    const result = await validator.validate(form);
    if (!result) {
      throw new Response("Error", {
        status: 400,
      });
    }
    await createExperience(result?.data?.comentario as string, profile.id);
    return redirect(`/profile/${email}`);
  } else if (subaction === "UPDATE_GITHUB_USER") {
    const githubUserResult = await githubUserValidator.validate(form);
    if (githubUserResult?.error) {
      return validationError(githubUserResult.error);
    }
    await updateGithubUser(
      githubUserResult.data.profileId,
      githubUserResult.data?.githubUser
    );
    return redirect(`/profile/${email}`);
  } else {
    throw new Error("Something went wrong");
  }
};

export const ProfileInfo = () => {
  const { profileData, githubProjects, canEdit } = useLoaderData<LoaderData>();
  const theme = useTheme();
  const lessThanMd = useMediaQuery(theme.breakpoints.down("md"));
  const navigation = useNavigation();
  const submit = useSubmit();
  const { error: githubUsererror, getInputProps } = useField("githubUser", {
    formId: "updateGithubUserForm",
  });
  const [isEditGithubUserActive, setIsEditGithubUserActive] = useState(false);

  const handleUpdateGithubUser = async () => {
    const form = document.getElementById(
      "updateGithubUserForm"
    ) as HTMLFormElement;
    const result = await githubUserValidator.validate(new FormData(form));
    if (result.error != undefined) {
      setIsEditGithubUserActive(true);
      return validationError(result.error);
    }
    setIsEditGithubUserActive(false);
    submit(form);
  };

  if (profileData === null) {
    return (
      <>
        <Header title="Projects" />
        <Container>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={12}>
              <Paper elevation={0} sx={{ padding: 2 }}>
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  There is no information to display
                </Alert>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header title="Profile" />
      <Container>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              position: { xs: "inherit", md: "inherit" },
              left: { xs: 0, md: undefined },
              zIndex: { xs: 2, md: undefined },
              display: {
                md: "inherit",
              },
            }}
          >
            <Paper elevation={lessThanMd ? 5 : 0}>
              <Box
                sx={{
                  paddingTop: 1,
                  paddingLeft: 2,
                  paddingRight: 2,
                  minWidth: 200,
                  p: 3,
                }}
              >
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Avatar
                    alt="profile-user"
                    sx={{ width: 150, height: 150 }}
                    src={profileData.avatarUrl || ""}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography variant="h5">
                    {profileData.firstName + " " + profileData.lastName}
                  </Typography>
                  <Link variant="body2" href={`mailto:${profileData.email}`}>
                    {profileData.email}
                  </Link>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "2rem",
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "row", gap: "8px" }}
                  >
                    <WorkIcon />
                    <Typography>{profileData.employeeStatus}</Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "row", gap: "8px" }}
                  >
                    <GroupsIcon />
                    <Typography>{profileData.department}</Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "row", gap: "8px" }}
                  >
                    <BusinessIcon />
                    <Typography>{profileData.businessUnit}</Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "row", gap: "8px" }}
                  >
                    <PlaceIcon />
                    <Typography>{profileData.location}</Typography>
                  </Box>
                  {isEditGithubUserActive ? (
                    <ValidatedForm
                      id="updateGithubUserForm"
                      method="post"
                      subaction="UPDATE_GITHUB_USER"
                      validator={githubUserValidator}
                      defaultValues={{
                        githubUser: profileData.githubUser || "",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <GitHubIcon />
                        <TextField
                          variant="outlined"
                          name="githubUser"
                          size="small"
                          defaultValue={profileData.githubUser}
                          {...getInputProps({ id: "githubUser" })}
                        />
                        <input
                          type="hidden"
                          name="profileId"
                          value={profileData.id}
                        />
                        <input
                          type="hidden"
                          name="profileEmail"
                          value={profileData.email}
                        />
                        <IconButton
                          type="submit"
                          onClick={() => {
                            handleUpdateGithubUser();
                          }}
                        >
                          <SaveIcon />
                        </IconButton>
                      </Box>
                      {githubUsererror ? (
                        <p style={{ color: "red" }}>{githubUsererror}</p>
                      ) : null}
                    </ValidatedForm>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <GitHubIcon />
                      <Typography>
                        {profileData.githubUser?.length
                          ? profileData.githubUser
                          : "<Not specified>"}
                      </Typography>
                      {canEdit ? (
                        <IconButton
                          type="button"
                          onClick={() => {
                            setIsEditGithubUserActive(true);
                          }}
                        >
                          <EditSharp />
                        </IconButton>
                      ) : null}
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            {profileData.projectMembers?.length > 0 ? (
              <Paper elevation={0} sx={{ padding: 2 }}>
                <h2 style={{ marginTop: 0, paddingLeft: 20 }}>Projects</h2>
                <Grid container sx={{ p: 2 }}>
                  {profileData.projectMembers.map((projectMember: any) => (
                    <Grid item xs={12} key={projectMember.id}>
                      <Card
                        key={projectMember.id}
                        sx={{ marginBottom: 3, display: "block" }}
                      >
                        <CardActionArea
                          href={`/projects/${projectMember.projectId}`}
                        >
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {projectMember.project.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {projectMember.project.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {projectMember.role
                                .map((role: { name: string }) => role.name)
                                .join("/")}
                              {" - "}
                              {projectMember.hoursPerWeek} hours per week
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        {projectMember.practicedSkills?.length > 0 ? (
                          <CardActions
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              marginLeft: "0.5rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {projectMember.practicedSkills.map((skill: any) => (
                              <Chip
                                label={skill.name}
                                key={skill.id}
                                component="a"
                                clickable
                                href={`/projects?&skill=${skill.name}`}
                              />
                            ))}
                          </CardActions>
                        ) : null}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            ) : null}
            {githubProjects && githubProjects.length > 0 ? (
              <Paper elevation={0} sx={{ padding: 2 }}>
                <h2 style={{ marginTop: 0, paddingLeft: 20 }}>
                  Github Active Projects
                </h2>
                <Grid container sx={{ p: 2 }}>
                  {githubProjects.map((project: any) => (
                    <Grid item xs={12} key={project.id}>
                      <Card
                        key={project.id}
                        sx={{ marginBottom: 3, display: "block" }}
                      >
                        <CardActionArea
                          href={`https://github.com/${profileData.githubUser}/${project.name}`}
                          target="_blank"
                        >
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {project.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {project.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {project.updated_at}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            ) : null}
            <Grid sx={{ paddingTop: 2, paddingBottom: 2 }}>
              <Paper elevation={0} sx={{ padding: 2 }}>
                <h2 style={{ marginTop: 0, paddingLeft: 20 }}>Experience</h2>
                <ValidatedForm
                  validator={validator}
                  defaultValues={{
                    comentario: "",
                  }}
                  subaction="CREATE_EXPERIENCE"
                  method="post"
                >
                  <TextField
                    id="outlined-basic"
                    label="Your Experience"
                    variant="outlined"
                    style={{ width: "100%" }}
                    name={"comentario"}
                    multiline
                    rows={4}
                  ></TextField>
                  <Grid sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      type="submit"
                      className="contained"
                      sx={{
                        width: "220px",
                        height: "50px",
                        fontSize: "1em",
                        marginTop: "15px",
                      }}
                      disabled={navigation.state !== "idle"}
                    >
                      {navigation.state !== "idle"
                        ? "Saving experience..."
                        : "Save experience"}
                    </Button>
                  </Grid>
                </ValidatedForm>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProfileInfo;
