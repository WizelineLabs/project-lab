import Header from "app/core/layouts/Header";
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
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import GroupsIcon from "@mui/icons-material/Groups";
import BusinessIcon from "@mui/icons-material/Business";
import PlaceIcon from "@mui/icons-material/Place";
import WorkIcon from "@mui/icons-material/Work";
import GitHubIcon from "@mui/icons-material/GitHub";
import EditSharp from "@mui/icons-material/EditSharp";
import SaveIcon from "@mui/icons-material/Save";
import {
  getGitHubProfileByEmail,
  getGitHubProjectsByEmail,
  getFullProfileByEmail,
  updateGithubUser,
} from "../../../models/profile.server";
import { useLoaderData, useSubmit, useTransition } from "@remix-run/react";
import type {
  LoaderArgs,
  LoaderFunction,
  ActionFunction,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { z } from "zod";
import { requireProfile } from "~/session.server";
import { createExperience } from "~/models/experience.server";
import { redirect } from "remix-typedjson";
import { ValidatedForm, useField, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { useState } from "react";

type LoaderData = {
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
};

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  try {
    invariant(params.email, "email could not be found");
    const email = params.email;

    const [profileData, githubProfileData, githubProjects] = await Promise.all([
      getFullProfileByEmail(email),
      getGitHubProfileByEmail(email),
      getGitHubProjectsByEmail(email),
    ]);
    return {
      profileData,
      githubProfileData,
      githubProjects,
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
        /^(^$)|[a-zA-Z0-9]{1}[a-zA-Z0-9\-]{0,37}[a-zA-Z0-9]{1}$/,
        "Github username is invalid"
      ),
  })
);

export const action: ActionFunction = async ({ request }) => {
  const profile = await requireProfile(request);
  const form = await request.formData();
  const subaction = form.get("subaction");

  switch (subaction) {
    case "CREATE_EXPERIENCE":
      const result = await validator.validate(form);
      if (!result) {
        throw new Response("Error", {
          status: 400,
        });
      }
      await createExperience(result?.data?.comentario as string, profile.id);
      return redirect(`/profile/${profile.email}`);
    case "UPDATE_GITHUB_USER":
      const githubUserResult = await githubUserValidator.validate(form);
      if (githubUserResult?.error) {
        return validationError(githubUserResult.error);
      }
      await updateGithubUser(profile, githubUserResult.data?.githubUser);
      return redirect(`/profile/${profile.email}`);
    default: {
      throw new Error("Something went wrong");
    }
  }
};

export const ProfileInfo = () => {
  const { profileData, githubProjects } = useLoaderData<LoaderData>();
  const theme = useTheme();
  const lessThanMd = useMediaQuery(theme.breakpoints.down("md"));
  const trasition = useTransition();
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
                        <IconButton
                          type="submit"
                          onClick={() => {
                            handleUpdateGithubUser();
                          }}
                        >
                          <SaveIcon />
                        </IconButton>
                      </Box>
                      {githubUsererror && (
                        <p style={{ color: "red" }}>{githubUsererror}</p>
                      )}
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
                      <IconButton
                        type="button"
                        onClick={() => {
                          setIsEditGithubUserActive(true);
                        }}
                      >
                        <EditSharp />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            {profileData.projectMembers?.length > 0 && (
              <Paper elevation={0} sx={{ padding: 2 }}>
                <h2 style={{ marginTop: 0, paddingLeft: 20 }}>Projects</h2>
                <Grid container sx={{ p: 2 }}>
                  {profileData.projectMembers.map((projectMember) => (
                    <Grid item xs={12} key={projectMember.id}>
                      <Card
                        key={projectMember.id}
                        sx={{ marginBottom: 3, display: "block" }}
                      >
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
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
                          {projectMember.practicedSkills?.length > 0 && (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "8px",
                                marginTop: "1rem",
                              }}
                            >
                              {projectMember.practicedSkills.map((skill) => (
                                <Chip label={skill.name} key={skill.id}></Chip>
                              ))}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
            {githubProjects && githubProjects.length > 0 && (
              <Paper elevation={0} sx={{ padding: 2 }}>
                <h2 style={{ marginTop: 0, paddingLeft: 20 }}>
                  Github Active Projects
                </h2>
                <Grid container sx={{ p: 2 }}>
                  {githubProjects.map((project) => (
                    <Grid item xs={12} key={project.id}>
                      <Card
                        key={project.id}
                        sx={{ marginBottom: 3, display: "block" }}
                      >
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {project.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {project.description}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {project.updated_at}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
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
                      disabled={!!trasition.submission}
                    >
                      {trasition.submission
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
