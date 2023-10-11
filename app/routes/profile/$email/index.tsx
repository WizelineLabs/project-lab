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
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import EmailIcon from "@mui/icons-material/Email";
import GroupsIcon from "@mui/icons-material/Groups";
import BusinessIcon from "@mui/icons-material/Business";
import PlaceIcon from "@mui/icons-material/Place";
import WorkIcon from "@mui/icons-material/Work";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  getGitHubProfileByEmail,
  getGitHubProjectsByEmail,
  getProfileByEmail,
} from "../../../models/profile.server";
import { useLoaderData, useTransition } from "@remix-run/react";
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
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";

type LoaderData = {
  profileData: Awaited<ReturnType<typeof getProfileByEmail>>;
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
      getProfileByEmail(email),
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

export const action: ActionFunction = async ({ request }) => {
  const profile = await requireProfile(request);
  const result = await validator.validate(await request.formData());

  if (!result) {
    throw new Response("Error", {
      status: 400,
    });
  }
  await createExperience(result?.data?.comentario as string, profile.id);
  return redirect(`/profile/${profile.email}`);
};

export const ProfileInfo = () => {
  const { profileData, githubProfileData, githubProjects } =
    useLoaderData<LoaderData>();
  const theme = useTheme();
  const lessThanMd = useMediaQuery(theme.breakpoints.down("md"));
  const trasition = useTransition();

  /*
  githubProfileData === undefined ||
    githubProjects === undefined ||
    githubProfileData === null
  */
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

  // Work with Github data
  // let username = githubProfileData?.username;
  // let avatarUrl = githubProfileData?.avatarUrl;
  // let firstName = githubProfileData?.firstName;
  // let lastName = githubProfileData?.lastName;
  let githubProjectsLink = githubProjects;
  return (
    <>
      <Header title="Profile" />
      <Container>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid
            item
            xs={12}
            md={3}
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
                  <h1> {profileData.firstName + " " + profileData.lastName}</h1>
                </Box>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "row", gap: "8px" }}
                  >
                    <EmailIcon />
                    <Typography>{profileData.email}</Typography>
                  </Box>
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
                      {profileData.githubUser || "<Not Set>"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
          {githubProjects && githubProjects.length > 0 && (
            <Grid item xs={12} md={9}>
              <Paper elevation={0} sx={{ padding: 2 }}>
                <h2 style={{ marginTop: 0, paddingLeft: 20 }}>
                  Active Projects
                </h2>
                <Grid container sx={{ p: 2 }}>
                  {githubProjectsLink.map((project) => (
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
              <Grid sx={{ paddingTop: 2, paddingBottom: 2 }}>
                <Paper elevation={0} sx={{ padding: 2 }}>
                  <h2 style={{ marginTop: 0, paddingLeft: 20 }}>Experience</h2>
                  <ValidatedForm
                    validator={validator}
                    defaultValues={{
                      comentario: "",
                    }}
                    method="POST"
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
                          ? "Addign experience..."
                          : "Add experience"}
                      </Button>
                    </Grid>
                  </ValidatedForm>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default ProfileInfo;
