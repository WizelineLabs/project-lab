import ArrowBack from "@mui/icons-material/ArrowBack";
import EditSharp from "@mui/icons-material/EditSharp";
import LinkedIn from "@mui/icons-material/LinkedIn";
import {
  Container,
  Paper,
  Link as ExternalLink,
  Button,
  Stack,
  IconButton,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  type SubmitOptions,
  useFetcher,
  useNavigation,
} from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import MarkdownStyles from "@uiw/react-markdown-preview/markdown.css";
import MDEditorStyles from "@uiw/react-md-editor/markdown-editor.css";
import { useEffect, useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ValidatedForm } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zfd } from "zod-form-data";
import AplicantComments from "~/core/components/ApplicantComments";
import Link from "~/core/components/Link";
import ModalBox from "~/core/components/ModalBox";
import RegularSelect from "~/core/components/RegularSelect";
import WhatsAppLink from "~/core/components/WhatsAppLink";
import Header from "~/core/layouts/Header";
import { getApplicantById } from "~/models/applicant.server";
import { getCommentsApplicant } from "~/models/applicantComment.server";
import { checkPermission } from "~/models/authorization.server";
import type { Roles } from "~/models/authorization.server";
import { getProjectsList } from "~/models/project.server";
import { requireProfile, requireUser } from "~/session.server";
import { validateNavigationRedirect } from "~/utils";

export function links() {
  return [
    { rel: "stylesheet", href: MDEditorStyles },
    { rel: "stylesheet", href: MarkdownStyles },
  ];
}

interface ProfileValue {
  id: string;
  name: string;
}

interface ProjectValue {
  id: string;
  name: string;
}

const profileFetcherOptions: SubmitOptions = {
  method: "get",
  action: "/api/profiles-search",
};

export const validator = withZod(
  zfd.formData({
    applicantId: z.string().min(1),
    project: z
      .object({
        id: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
    mentor: z
      .object({
        id: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
    status: z.string(),
  })
);

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
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

  return typedjson({
    applicant,
    projects,
    canEditProject,
    applicantId,
    profileId,
    comments,
  });
};

export default function Applicant() {
  const {
    applicant,
    projects,
    canEditProject,
    applicantId,
    profileId,
    comments,
  } = useTypedLoaderData<typeof loader>();
  const [openManageModal, setOpenManageModal] = useState(false);
  const [projectSelected, setProjectSelected] = useState<ProjectValue | null>();

  const navigation = useNavigation();

  useEffect(() => {
    const isActionRedirect = validateNavigationRedirect(navigation);
    if (isActionRedirect) {
      setOpenManageModal(false);
    }
  }, [navigation]);

  const appliedIdProjects = applicant.appliedProjectsId?.split(",");
  const appliedNameProjects = applicant.appliedProjects?.split(",");

  if (appliedIdProjects && appliedNameProjects) {
    const projectMap: Record<string, string> = {};

    for (let i = 0; i < appliedNameProjects.length; i++) {
      const projectName = appliedNameProjects[i];
      const projectId = appliedIdProjects[i];
      if (projectId) {
        projectMap[projectName] = projectId;
      }
    }
  }

  const profileFetcher = useFetcher<ProfileValue[]>();

  const searchProfiles = (value: string, project: string | null = null) => {
    const queryProject = project ?? projectSelected?.id;
    profileFetcher.submit(
      {
        q: value,
        ...(queryProject ? { projectId: queryProject } : null),
      },
      profileFetcherOptions
    );
  };

  useEffect(() => {
    if (profileFetcher.state === "idle" && profileFetcher.data == null) {
      profileFetcher.submit(
        { q: "", projectId: applicant.projectId },
        profileFetcherOptions
      );
    }
  }, [applicant.projectId, profileFetcher]);

  const handleSelectProject = (project: ProjectValue) => {
    setProjectSelected(project);
    searchProfiles("", project.id);
  };

  const handleCloseModal = () => {
    setOpenManageModal(false);
    setProjectSelected(null);
    searchProfiles("", "");
  };

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
              {canEditProject ? (
                <IconButton
                  aria-label="Edit"
                  onClick={() => setOpenManageModal(true)}
                >
                  <EditSharp />
                </IconButton>
              ) : null}
              <Stack direction="column" spacing={1}>
                <Paper>
                  <Typography
                    variant="h6"
                    alignContent="center"
                    alignItems="left"
                  >
                    Status: {applicant.status}
                  </Typography>
                </Paper>
                {applicant.projectName ? (
                  <Paper>
                    <Typography
                      variant="h6"
                      alignContent="center"
                      alignItems="left"
                    >
                      Project: {applicant.projectName}
                    </Typography>
                  </Paper>
                ) : null}
                {applicant.mentorPreferredName ? (
                  <Paper>
                    <Typography
                      variant="h6"
                      alignContent="center"
                      alignItems="left"
                    >
                      Mentor: {applicant.mentorPreferredName}{" "}
                      {applicant.mentorLastName}{" "}
                    </Typography>
                  </Paper>
                ) : null}
              </Stack>
            </Grid>
          </Grid>
          <div>
            {applicant.avatarApplicant ? (
              <Avatar
                alt={applicant.fullName}
                src={applicant.avatarApplicant}
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  margin: "15px",
                }}
              />
            ) : null}
          </div>
          <div>
            {applicant.universityName} / <strong>{applicant.major}</strong> /{" "}
            {applicant.semester} / {applicant.englishLevel}
          </div>
          <div>
            <ExternalLink href={`mailto:${applicant.email}`}>
              {applicant.email}
            </ExternalLink>{" "}
            {applicant.phone ? (
              <WhatsAppLink phoneNumber={applicant.phone} />
            ) : null}
            {applicant.pocName
              ? " / University contact: " + applicant.pocName
              : null}
            <hr />
            <div>
              <h3>Applied Projects</h3>
              {appliedNameProjects &&
              appliedNameProjects.length > 0 &&
              appliedIdProjects ? (
                <ul>
                  {appliedNameProjects.map(
                    (projectName: any, index: number) => {
                      // Explicitly specify the type of index as number
                      const projectId = appliedIdProjects[index];
                      return (
                        <li key={index}>
                          <a href={`/projects/${projectId}`}>
                            {projectName.trim()}
                          </a>
                        </li>
                      );
                    }
                  )}
                </ul>
              ) : null}
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
          {applicant.interestedRoles ? (
            <div>
              <strong>Roles I&apos;m interested in</strong>{" "}
              {applicant.interestedRoles}
            </div>
          ) : null}
          {applicant.participatedAtWizeline ? (
            <div>
              <strong>I previously participated with Wizeline in:</strong>{" "}
              {applicant.wizelinePrograms}
            </div>
          ) : null}
          {applicant.preferredTools ? (
            <div>
              <strong>Preferred tools</strong> {applicant.preferredTools}
            </div>
          ) : null}
          {applicant.experience ? (
            <div>
              <strong>Relevant experience:</strong> {applicant.experience}
            </div>
          ) : null}
          {applicant.interest ? (
            <div>
              <h3 style={{ marginBottom: 0 }}>Interest</h3> {applicant.interest}
            </div>
          ) : null}
          {applicant.comments ? (
            <div>
              <h3 style={{ marginBottom: 0 }}>Comments</h3> {applicant.comments}
            </div>
          ) : null}
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
        <h2>Edit internship status</h2>
        <ValidatedForm
          validator={validator}
          method="post"
          action="./status"
          defaultValues={{
            project: {
              id: applicant.projectId || undefined,
              name: applicant.projectName || undefined,
            },
            mentor: {
              id: applicant.mentorId || undefined,
            },
          }}
        >
          <input type="hidden" name="applicantId" value={applicant.id} />

          <FormControl fullWidth size="medium">
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              id="actions-select"
              name="status"
              label="Status"
              defaultValue={applicant.status}
            >
              <MenuItem value="DRAFT">DRAFT</MenuItem>
              <MenuItem value="HOLD">HOLD</MenuItem>
              <MenuItem value="ACCEPTED">ACCEPTED</MenuItem>
              <MenuItem value="REJECTED">REJECTED</MenuItem>
            </Select>
          </FormControl>

          <RegularSelect
            valuesList={projects}
            name="project"
            label="Select a project"
            onChange={handleSelectProject}
          />

          <RegularSelect
            valuesList={profileFetcher.data ?? []}
            name="mentor"
            label="Select a mentor"
          />

          <Grid container justifyContent="end" alignItems="center">
            <Button type="submit">Save Cahnges</Button>
          </Grid>
        </ValidatedForm>
      </ModalBox>
    </>
  );
}
