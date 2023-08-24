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
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  getGitHubProfileByEmail,
  getGitHubProjectsByEmail,
} from "../../../models/profile.server";
import { useLoaderData } from "@remix-run/react";
import { ActionFunction,
  type LoaderArgs,
  type LoaderFunction,
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

    const [githubProfileData, githubProjects] = await Promise.all([
      getGitHubProfileByEmail(email),
      getGitHubProjectsByEmail(email),
    ]);
    return {
      githubProfileData,
      githubProjects,
    };
  } catch (Error) {
    console.error("Error al cargar los datos de GitHub:", Error);

    return {
      error: "Ocurrió un error al cargar los datos de GitHub",
    };
  }
};

export const validator = withZod(zfd.formData({
  comentario: z.string().min(10),
}));

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
  const { githubProfileData, githubProjects } = useLoaderData<LoaderData>();
  const theme = useTheme();
  const lessThanMd = useMediaQuery(theme.breakpoints.down("md"));

  if (
    githubProfileData === undefined ||
    githubProjects === undefined ||
    githubProfileData === null
  ) {
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
  } else {
    let username = githubProfileData?.username;
    let avatarUrl = githubProfileData?.avatarUrl;
    let firstName = githubProfileData?.firstName;
    let lastName = githubProfileData?.lastName;
    let githubProjectsLink = githubProjects;
    return (
      <>
        <Header title="Projects" />
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
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      alt="profile-user"
                      width="100px"
                      height="100px"
                      src={avatarUrl}
                      style={{ cursor: "pointer", borderRadius: "50%" }}
                    />
                  </Box>
                  <Box textAlign="center">
                    <h1> {firstName + " " + lastName}</h1>
                    <h4 style={{ margin: 0 }}>{username}</h4>
                  </Box>
                </Box>
              </Paper>
            </Grid>
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
                    ></TextField>
                    <Grid sx={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        type="submit"
                        className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-1a9vgbr-MuiButtonBase-root-MuiButton-root"
                        sx={{
                          width: "220px",
                          height: "50px",
                          fontSize: "1em",
                          marginTop: "15px",
                        }}
                      >
                        Add Experience
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
  }
};

export default ProfileInfo;
