import LinkedIn from "@mui/icons-material/LinkedIn";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Container, Paper, Link as ExternalLink, Button, TextField, Autocomplete, debounce, Stack, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent, Typography } from "@mui/material";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import Link from "~/core/components/Link";
import Header from "~/core/layouts/Header";
import { getApplicantById } from "~/models/applicant.server";
import Grid from "@mui/material/Unstable_Grid2";
import { checkPermission } from "~/models/authorization.server";
import type { Roles } from "~/models/authorization.server";
import { requireProfile, requireUser } from "~/session.server";

import ModalBox from "~/core/components/ModalBox";
import { useEffect, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { getProjectsList } from "~/models/project.server";
import { type SubmitOptions, useFetcher, useTransition } from "@remix-run/react";
import RegularSelect from "~/core/components/RegularSelect";

type ProfileValue = {
  id: string;
  name: string;
};

type ApplicantValue ={
  applicantId: string,
  projectId: string,
  mentorId: string,
  status: string,
}

const profileFetcherOptions: SubmitOptions = {
  method: "get",
  action: "/api/profiles-search",
};

export const validator = withZod(
  zfd.formData({
      applicantId: z.string().min(1),
      project:
        z.object({
          id: z.string().optional(),
          name: z.string().optional(),
        }).optional(),
      mentorId: z.string(),
      mentorName: z.string().optional(),
      status: z.string(),
      projectId: z.string().optional(),
    })
);

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.applicantId, "projectId not found");
  const projects = await getProjectsList();
  const applicant = await getApplicantById(params.applicantId);
  if (!applicant) {
    throw new Response("Not Found", { status: 404 });
  }

  const profile = await requireProfile(request);
  const user = await requireUser(request);
  const canEditProject = checkPermission(
    profile.id,
    user.role as Roles,
    "edit.project",
    "applicant",
    applicant
  );

  return typedjson({ applicant, projects, canEditProject });
};

export default function Applicant() {
  const { applicant, projects, canEditProject } = useTypedLoaderData<typeof loader>();
  const [openManageModal, setOpenManageModal] = useState(false);
  const [mentorSelected, setMentorSelected] = useState<ProfileValue | null>();

  const fetcher = useFetcher<ApplicantValue>();

  const transition = useTransition();

  useEffect(() => {
    if (transition.type == "actionReload" || transition.type == "actionSubmission") {
      setOpenManageModal(false);
    }
  }, [transition]);

  const profileFetcher = useFetcher<ProfileValue[]>();

  const searchProfiles = (value: string) => {
    profileFetcher.submit({ q: value }, profileFetcherOptions);
  };

  const changeStatus = (event: SelectChangeEvent) => {
    const body= {
      applicantId: applicant.id as unknown as string,
      projectId: applicant.projectId as string,
      mentorId: applicant.mentorId as string,
      status: event.target.value
    };
   
     fetcher.submit(body, { method: "post", action: `/applicants/${applicant.id}/hold`})
  }

  const searchProfilesDebounced = debounce(searchProfiles, 500);

  useEffect(() => {
    if (profileFetcher.type === "init") {
      profileFetcher.submit({}, profileFetcherOptions);
    }
  }, [profileFetcher]);

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
              {
                canEditProject && applicant.status === 'DRAFT' && (
                  <>
                    <Button onClick={() => setOpenManageModal(true)} variant="contained">Hold intern</Button>
                  </>
                )
              }
              {
                canEditProject && applicant.status === 'HOLD' && (
                  <Stack direction="column" spacing={1}>
                    <FormControl fullWidth size="medium">
                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                      <Select
                        id="actions-select"
                        label="Status"
                        onChange={changeStatus}
                        value={applicant.status}
                      >
                        <MenuItem value="HOLD">HOLD</MenuItem>
                        <MenuItem value="DRAFT">DRAFT</MenuItem>
                        <MenuItem value="ACCEPTED">ACCEPTED</MenuItem>
                        <MenuItem value="REJECTED">REJECTED</MenuItem>
                      </Select>
                    </FormControl>
                    <Paper >
                      <Typography variant="h6" alignContent="center" alignItems="left">Project:  {applicant.project?.name}</Typography>
                    </Paper>
                    <Paper>
                    <Typography variant="h6" alignContent="center" alignItems="left">Mentor: {applicant.mentor?.preferredName} {applicant.mentor?.lastName} </Typography>
                    </Paper>
                  </Stack>
                )
              }
              
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
            {
              applicant.phone && (
                <>
                / t.
                <ExternalLink href={`tel:${applicant.phone}`}>
                  {applicant.phone}
                </ExternalLink>
                </>
              )
            }
            
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
      <ModalBox close={() => setOpenManageModal(false)} open={openManageModal}>
        <h2>Select project and mentor</h2>
            <ValidatedForm validator={validator} method="post" action="./hold">
                <input type="hidden" name="applicantId" value={applicant.id} />
                <input type="hidden" name="status" value="HOLD" />

                <RegularSelect
                  valuesList={projects}
                  name="project"
                  label="Select a project"
                />

                <input type="hidden" name="mentorId" value={mentorSelected?.id} />
                <Autocomplete
                    multiple = {false}
                    style={{ margin: "1em 0" }}
                    options={profileFetcher.data ?? []}
                    value={mentorSelected}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    id="mentor"
                    getOptionLabel={(option) => option.name}
                    onInputChange={(_, value) => searchProfilesDebounced(value)}
                    renderTags={() => null}
                    onChange={(
                      event,
                      value: { id: string; name: string } | null
                    ) => setMentorSelected(value)}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        name="mentorName"
                        label="Select a mentor"
                        {...params}
                        placeholder="Select a mentor..."
                      />
                    )}
                  />

                  <Grid container justifyContent="end" alignItems="center">
                      <Button type="submit">Hold Intern</Button>
                  </Grid>

                
            </ValidatedForm>
            
      </ModalBox>
    </>
  );
}
