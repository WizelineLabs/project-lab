import LinkedIn from "@mui/icons-material/LinkedIn";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Container, Paper, Link as ExternalLink, Button, TextField, Autocomplete, debounce, Stack, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent, Typography, type AutocompleteChangeReason, Avatar } from "@mui/material";
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
import MDEditorStyles from "@uiw/react-md-editor/markdown-editor.css";
import MarkdownStyles from "@uiw/react-markdown-preview/markdown.css";
import ModalBox from "~/core/components/ModalBox";
import { Key, useEffect, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { getProjectsList } from "~/models/project.server";
import { type SubmitOptions, useFetcher, useNavigation } from "@remix-run/react";
import RegularSelect from "~/core/components/RegularSelect";
import { validateNavigationRedirect } from '~/utils'
import AplicantComments from "~/core/components/ApplicantComments";
import { getCommentsApplicant } from "~/models/applicantComment.server";

export function links() {
  return [
    { rel: "stylesheet", href: MDEditorStyles },
    { rel: "stylesheet", href: MarkdownStyles },
  ];
}


type ProfileValue = {
  id: string;
  name: string;
};

type ProjectValue = {
  id: string;
  name: string;
};

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
  const applicantId = params.applicantId;
  const comments = await getCommentsApplicant(parseInt(applicantId as string));
  const applicant = await getApplicantById(params.applicantId);
  if (!applicant) {
    throw new Response("Not Found", { status: 404 });
  }

  const profile = await requireProfile(request);
  const profileId = profile.id;

  const user = await requireUser(request);
  const canEditProject = checkPermission(
    profile.id,
    user.role as Roles,
    "edit.project",
    "applicant",
    applicant
  );

  return typedjson({ applicant, projects, canEditProject, applicantId, profileId, comments });
};

export default function Applicant() {
  const { applicant, projects, canEditProject, applicantId, profileId, comments } = useTypedLoaderData<typeof loader>();
  const [openManageModal, setOpenManageModal] = useState(false);
  const [mentorSelected, setMentorSelected] = useState<ProfileValue | null>({
    id: "",
    name: "",
  });
  const [projectSelected, setProjectSelected] = useState<ProjectValue | null>();

  const fetcher = useFetcher();        
  
  const navigation = useNavigation();

  useEffect(() => {
    const isActionRedirect = validateNavigationRedirect(navigation)
    if (isActionRedirect) {
      setOpenManageModal(false);
    }
  }, [navigation]);

const appliedIdProjects = applicant.appliedProjectsId?.split(',');
const appliedNameProjects = applicant.appliedProjects?.split(',');

if (appliedIdProjects && appliedNameProjects) {
  const projectMap: { [key: string]: string } = {};
  
  for (let i = 0; i < appliedNameProjects.length; i++) {
    const projectName = appliedNameProjects[i];
    const projectId = appliedIdProjects[i];
    if (projectId) {
      projectMap[projectName] = projectId;
    }
  }
}

  const profileFetcher = useFetcher<ProfileValue[]>();

  const searchProfiles = (value: string, project:string | null = null) => {
    const queryProject = project ?? projectSelected?.id
    profileFetcher.submit(
      {
        q: value,
        ...(queryProject ? { projectId: queryProject } : null),
      },
      profileFetcherOptions
    );
  };

  const changeStatus = async (event: SelectChangeEvent) => {
    const body= {
      applicantId: applicant.id as unknown as string,
      projectId: applicant.projectId as string,
      mentorId: applicant.mentorId as string,
      status: event.target.value
    };
   
    await fetcher.submit(body, { method: "post", action: `/applicants/${applicant.id}/status`})
  }

  const searchProfilesDebounced = debounce(searchProfiles, 500);

  useEffect(() => {
    if (profileFetcher.type === "init") {
      profileFetcher.submit({}, profileFetcherOptions);
    }
  }, [profileFetcher]);

  const handleSelectProject = (project: ProjectValue) => {
    setProjectSelected(project)
    searchProfiles("", project.id)
    setMentorSelected({id: "", name: ""})
  }

  const handleCloseModal = () => {
    setOpenManageModal(false)
    setProjectSelected(null)
    setMentorSelected({id: "", name: ""})
    searchProfiles("", "")
  }

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
              {navigation.state != "loading" && canEditProject && applicant.status === "DRAFT" && (
                <>
                  <Button
                    onClick={() => setOpenManageModal(true)}
                    variant="contained"
                  >
                    Hold intern
                  </Button>
                </>
              )}
              {(canEditProject) && (applicant.status != "DRAFT") && (
                <Stack direction="column" spacing={1}>
                  <FormControl fullWidth size="medium">
                    <InputLabel id="demo-simple-select-label">
                      Status
                    </InputLabel>
                    <Select
                      id="actions-select"
                      label="Status"
                      onChange={changeStatus}
                      value={applicant.status}
                      disabled={fetcher.state === 'loading'}
                    >
                      <MenuItem value="DRAFT">DRAFT</MenuItem>
                      <MenuItem value="HOLD">HOLD</MenuItem>
                      <MenuItem value="ACCEPTED">ACCEPTED</MenuItem>
                      <MenuItem value="REJECTED">REJECTED</MenuItem>
                    </Select>
                  </FormControl>
                  <Paper>
                    <Typography
                      variant="h6"
                      alignContent="center"
                      alignItems="left"
                    >
                      Project: {applicant.project?.name}
                    </Typography>
                  </Paper>
                  <Paper>
                    <Typography
                      variant="h6"
                      alignContent="center"
                      alignItems="left"
                    >
                      Mentor: {applicant.mentor?.preferredName}{" "}
                      {applicant.mentor?.lastName}{" "}
                    </Typography>
                  </Paper>
                </Stack>
              )}
            </Grid>
          </Grid>
          <div>
          {applicant.avatarApplicant && (
            <Avatar
              alt={applicant.fullName}
              src={applicant.avatarApplicant}
              sx={{ width: 150, height: 150, borderRadius: '50%', margin: '15px' }}
            />
          )}
          </div>
          <div>
            {applicant.university?.name} / <strong>{applicant.major}</strong> /{" "}
            {applicant.semester} / {applicant.englishLevel}
          </div>
          <div>
            <ExternalLink href={`mailto:${applicant.email}`}>
              {applicant.email}
            </ExternalLink>{" "}
            {applicant.phone && (
              <>
                / t.
                <ExternalLink href={`tel:${applicant.phone}`}>
                  {applicant.phone}
                </ExternalLink>
              </>
            )}
            {applicant.universityPointOfContact && " / University contact: " + applicant.universityPointOfContact.fullName }
            <hr />
            <div>
              <h3>Applied Projects</h3>
              {appliedNameProjects && appliedNameProjects.length > 0 && appliedIdProjects && (
                <ul>
                  {appliedNameProjects.map((projectName: any, index: number) => { // Explicitly specify the type of index as number
                    const projectId = appliedIdProjects[index];
                    return (
                      <li key={index}>
                        <a href={`/projects/${projectId}`}>{projectName.trim()}</a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
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
    
      <Container>
        <AplicantComments
            comments={comments}
            applicantId={applicantId}
            profileId={profileId}
          />
      </Container>
      
      <ModalBox close={handleCloseModal} open={openManageModal}>
        <h2>Select project and mentor</h2>
        <ValidatedForm validator={validator} method="post" action="./status" defaultValues={{project: {id: "", name: ""}}}>
          <input type="hidden" name="applicantId" value={applicant.id} />
          <input type="hidden" name="status" value="HOLD" />

          <RegularSelect
            valuesList={projects}
            name="project"
            label="Select a project"
            onChange={handleSelectProject}
          />

          <input type="hidden" name="mentorId" value={mentorSelected?.id} />
          <Autocomplete
            multiple={false}
            style={{ margin: "1em 0" }}
            options={profileFetcher.data ?? []}
            value={mentorSelected?.id ? mentorSelected : null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            id="mentor"
            getOptionLabel={(option) => option.name}
            onInputChange={(_, value) => searchProfilesDebounced(value)}
            renderTags={() => null}
            onChange={(
              event,
              value: { id: string; name: string } | null,
              reason: AutocompleteChangeReason
            ) =>
              reason === "clear"
                ? setMentorSelected({ id: "", name: "" })
                : setMentorSelected(value)
            }
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                name="mentorName"
                label="Select a mentor"
                {...params}
                placeholder="Select a mentor..."
                value={mentorSelected?.name}
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
