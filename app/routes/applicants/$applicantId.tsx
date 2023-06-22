import LinkedIn from "@mui/icons-material/LinkedIn";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Container, Paper, Link as ExternalLink } from "@mui/material";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import Link from "~/core/components/Link";
import Header from "~/core/layouts/Header";
import { getApplicantById } from "~/models/applicant.server";
import Grid from "@mui/material/Unstable_Grid2";

// loader function
export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.applicantId, "projectId not found");

  const applicant = await getApplicantById(params.applicantId);
  if (!applicant) {
    throw new Response("Not Found", { status: 404 });
  }

  return typedjson({ applicant });
};

export default function Applicant() {
  const { applicant } = useTypedLoaderData<typeof loader>();
  return (
    <>
      <Header title="Applicants" />
      <Container>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid xs={8}>
              <h1 style={{ marginTop: 0, marginBottom: 0 }}>
                <Link to="/applicants">
                  <ArrowBack />
                </Link>{" "}
                {applicant.fullName}{" "}
                <ExternalLink
                  sx={{ color: "blue" }}
                  href={applicant.cvLink}
                  title="cv"
                  target="_blank"
                >
                  <LinkedIn />
                </ExternalLink>
              </h1>{" "}
            </Grid>
            <Grid xs={4} sx={{ textAlign: "right" }}>
              <h3 style={{ margin: 0 }}>{applicant.status}</h3>
              {applicant.project && (
                <>
                  <div>{applicant.project.name}</div>
                  <div>{applicant.mentor?.preferredName}</div>
                </>
              )}
            </Grid>
          </Grid>
          <div>
            {applicant.university} / <strong>{applicant.major}</strong> /{" "}
            {applicant.semester} / {applicant.englishLevel}
          </div>
          <div>
            <ExternalLink href={`mailto:${applicant.email}`}>
              {applicant.email}
            </ExternalLink>{" "}
            / t.
            <ExternalLink href={`tel:${applicant.phone}`}>
              {applicant.phone}
            </ExternalLink>
          </div>
          <hr />
          <div>
            <strong>Start Date:</strong>{" "}
            {applicant.startDate.toLocaleDateString()}
          </div>
          <div>
            <strong>End Date:</strong> {applicant.endDate.toLocaleDateString()}
          </div>
          <div>
            <strong>Hours per week:</strong> {applicant.hoursPerWeek}
          </div>
          <hr />
          {applicant.interestedRoles && (
            <div>
              <strong>Roles I'm interested in</strong>{" "}
              {applicant.interestedRoles}
            </div>
          )}
          {applicant.participatedAtWizeline && (
            <div>
              <strong>I previously participated with Wizeline in:</strong>{" "}
              {applicant.wizelinePrograms}
            </div>
          )}
          {applicant.preferredTools && (
            <div>
              <strong>Preferred tools</strong> {applicant.preferredTools}
            </div>
          )}
          {applicant.experience && (
            <div>
              <strong>Relevant experience:</strong> {applicant.experience}
            </div>
          )}
          {applicant.interest && (
            <div>
              <h3 style={{ marginBottom: 0 }}>Interest</h3> {applicant.interest}
            </div>
          )}
          {applicant.comments && (
            <div>
              <h3 style={{ marginBottom: 0 }}>Comments</h3> {applicant.comments}
            </div>
          )}
        </Paper>
      </Container>
    </>
  );
}
