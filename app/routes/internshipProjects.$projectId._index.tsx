import Header from "../core/layouts/Header";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { formatDistance } from "date-fns";
import Markdown from "marked-react";
import { useState } from "react";
import invariant from "tiny-invariant";
import {
  getApplicantByEmail,
  getAppliedProjectsByEmail,
} from "~/models/applicant.server";
import { getProjectById } from "~/models/project.server";
import { requireProfile } from "~/session.server";
import { useOptionalUser } from "~/utils";

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.projectId, "projectId not found");

  const profile = await requireProfile(request);
  const projects = await getProjectById(params.projectId);
  const appliedProjects = await getAppliedProjectsByEmail(profile.email);
  const existApplicant = await getApplicantByEmail(profile.email);

  if (!projects.id) {
    throw new Error("project not found");
  }

  return {
    projects,
    appliedProjects,
    existApplicant,
    profile,
  };
};

export default function ProjectDetail() {
  const { projects, appliedProjects, profile, existApplicant } =
    useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const [isApplying, setIsApplying] = useState(false);

  const skills = projects.searchSkills
    ? projects.searchSkills
        .trim()
        .split(",")
        .map((skill: string) => ({ name: skill }))
    : [];

  const user = useOptionalUser();

  const handleApply = async () => {
    const body = {
      profileEmail: profile.email as string,
      projectName: projects.name as string,
      projectId: projects.id as string,
    };

    try {
      setIsApplying(true);
      await submit(body, { method: "put", action: "./appliedproject" });
    } catch (error) {
      console.error("Error processing the application:", error);
    }
  };

  return (
    <>
      <Header title={projects.name || ""} existApplicant={existApplicant} />

      <Container sx={{ marginBottom: 2 }}>
        <Paper
          sx={{
            paddingLeft: 2,
            paddingRight: 2,
            paddingBottom: 2,
            position: "relative",
          }}
        >
          <Grid container justifyContent="space-between">
            <Grid item>
              <h1 style={{ marginBottom: 0 }}>{projects.name}</h1>
              <Typography color="text.secondary">
                Last update:{" "}
                {projects.updatedAt &&
                  formatDistance(new Date(projects.updatedAt), new Date(), {
                    addSuffix: true,
                  })}
              </Typography>
            </Grid>
          </Grid>
          <p className="descriptionProposal">{projects.description}</p>
          {user && existApplicant && (
            <Grid style={{ position: "absolute", top: 0, right: 0 }}>
              <Form method="put" action="./appliedproject">
                <Button
                  className="contained"
                  type="submit"
                  sx={{
                    width: "200px",
                    height: "40px",
                    fontSize: "1em",
                    margin: 2,
                    "&:disabled": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                  onClick={handleApply}
                  disabled={
                    navigation.state === "loading" ||
                    appliedProjects.includes(projects.name) ||
                    isApplying
                  }
                >
                  {appliedProjects.includes(projects.name) &&
                  navigation.state != "loading"
                    ? "APPLIED"
                    : "APPLY"}
                </Button>
              </Form>
            </Grid>
          )}
          {user && !existApplicant && (
            <Grid style={{ position: "absolute", top: 0, right: 0 }}>
              <Button
                href="/login/linkedin"
                className="contained"
                sx={{
                  width: "200px",
                  height: "40px",
                  fontSize: "1em",
                  margin: 2,
                }}
              >
                Complete the form
              </Button>
            </Grid>
          )}
        </Paper>
      </Container>
      <Container>
        <Grid spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="Description" />
              <CardContent>
                <div>
                  <Markdown>
                    {projects.valueStatement ? projects.valueStatement : ""}
                  </Markdown>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ marginBottom: 2, marginTop: 2 }}>
        <Card>
          <CardHeader title="Skills:" />
          <CardContent>
            {skills.map((skill: any) => (
              <Chip
                key={skill.name}
                label={skill.name}
                sx={{ marginRight: 1, marginBottom: 1 }}
              />
            ))}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
