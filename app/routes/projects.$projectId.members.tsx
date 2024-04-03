import {
  Autocomplete,
  CircularProgress,
  Chip,
  Grid,
  TextField,
  debounce,
  Box,
  Container,
  Paper,
  Button,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { SubmitOptions } from "@remix-run/react";
import { useNavigation, useLoaderData, useFetcher } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import GoBack from "app/core/components/GoBack";
import { SkillsSelect } from "app/core/components/SkillsSelect";
import Header from "app/core/layouts/Header";
import { Fragment, useEffect } from "react";
import {
  validationError,
  ValidatedForm,
  useFieldArray,
} from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { adminRoleName } from "~/constants";
import { DisciplinesSelect } from "~/core/components/DisciplinesSelect";
import { LabeledCheckbox } from "~/core/components/LabeledCheckbox";
import LabeledTextField from "~/core/components/LabeledTextField";
import {
  getProject,
  getProjectTeamMembers,
  updateMembers,
} from "~/models/project.server";
import { requireProfile, requireUser } from "~/session.server";
import { isProjectMemberOrOwner } from "~/utils";

interface ProfileValue {
  id: string;
  name: string;
}

const profileFetcherOptions: SubmitOptions = {
  method: "get",
  action: "/api/profiles-search",
};

export const validator = withZod(
  zfd.formData({
    projectMembers: z.array(
      z.object({
        profileId: zfd.text(),
        role: z.array(
          z.object({
            id: z.string(),
            name: z.string().optional(),
          })
        ),
        practicedSkills: z
          .array(
            z.object({
              id: z.string(),
              name: z.string().optional(),
            })
          )
          .optional(),
        hoursPerWeek: zfd
          .numeric(z.number().nullish())
          .transform((v) => (v === undefined ? null : v)),
        active: zfd.checkbox(),
      })
    ),
  })
);

export const action: ActionFunction = async ({ request, params }) => {
  const projectId = params.projectId;
  invariant(projectId, "projectId could not be found");

  // Validate permissions
  const user = await requireUser(request);
  const isAdmin = user.role == adminRoleName;
  if (!isAdmin) {
    const profile = await requireProfile(request);
    const currentProject = await getProject({ id: projectId });
    const currentMembers = await getProjectTeamMembers(projectId);
    isProjectMemberOrOwner(profile.id, currentMembers, currentProject.ownerId);
  }

  const result = await validator.validate(await request.formData());
  if (result.error != undefined) return validationError(result.error);

  try {
    await updateMembers(projectId, result.data.projectMembers);
    return redirect(`/projects/${projectId}`);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      return validationError({
        fieldErrors: {
          formError: "Server failed",
        },
      });
    }
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.projectId, "projectId could not be found");
  const projectId = params.projectId;
  const profile = await requireProfile(request);
  const projectMembers = await getProjectTeamMembers(projectId);
  console.log(projectMembers);
  return json({ profile, projectMembers, projectId });
};

const EditMembersPage = () => {
  const { profile, projectMembers, projectId } = useLoaderData<typeof loader>();
  const profileFetcher = useFetcher<ProfileValue[]>();
  const navigation = useNavigation();
  const [items, { push, remove }] = useFieldArray("projectMembers", {
    formId: "profileMembersForm",
  });

  const searchProfiles = (value: string) => {
    profileFetcher.submit({ q: value }, profileFetcherOptions);
  };
  const searchProfilesDebounced = debounce(searchProfiles, 500);

  useEffect(() => {
    if (profileFetcher.state === "idle" && profileFetcher.data == null) {
      profileFetcher.submit({}, profileFetcherOptions);
    }
  }, [profileFetcher]);

  return (
    <>
      <Header title="Project Members" />
      <Container>
        <Paper
          elevation={0}
          sx={{
            paddingLeft: 2,
            paddingRight: 2,
          }}
        >
          <h1>Project Members</h1>
        </Paper>
      </Container>
      <Container>
        <Paper
          elevation={0}
          sx={{ paddingLeft: 2, paddingRight: 2, paddingBottom: 2 }}
        >
          <GoBack title="Back to project" href={`/projects/${projectId}`} />
          <ValidatedForm
            validator={validator}
            defaultValues={{
              projectMembers,
            }}
            method="post"
            id="profileMembersForm"
          >
            <>
              <Autocomplete
                multiple
                style={{ margin: "1em 0" }}
                options={profileFetcher.data ?? []}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.name}
                onInputChange={(_, value) => searchProfilesDebounced(value)}
                disableClearable
                onChange={(_event, _newValue, reason, details) => {
                  if (reason === "selectOption") {
                    push({
                      profileId: details?.option.id,
                      hoursPerWeek: "",
                      practicedSkills: [],
                      role: [],
                      profile: { preferredName: details?.option.name },
                      active: true,
                    });
                  }
                  if (
                    reason === "removeOption" &&
                    profile.name !== details?.option.name
                  ) {
                    remove(
                      items.findIndex(
                        (item) =>
                          item.defaultValue.profileId !== details?.option.id
                      )
                    );
                  }
                }}
                renderTags={() => null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add a contributor"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Fragment>
                          {profileFetcher.state === "submitting" ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </Fragment>
                      ),
                    }}
                  />
                )}
              />

              <Grid
                container
                spacing={1}
                alignItems="baseline"
                rowSpacing={{ xs: 2, sm: 1 }}
                style={{ paddingTop: 20 }}
              >
                {items?.map((item, i) => (
                  <Fragment key={i}>
                    <Grid item xs={12} sm={2}>
                      <>
                        <input
                          type="hidden"
                          name={`projectMembers[${i}].profileId`}
                          value={item.defaultValue.profileId}
                        />
                        <Chip
                          label={`${item.defaultValue.preferredName} ${item.defaultValue.lastName}`}
                          onDelete={() => {
                            if (item.defaultValue.profileId !== profile.id) {
                              remove(i);
                            }
                          }}
                        />
                      </>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DisciplinesSelect //still uses constant values instead of values taken from the db
                        name={`projectMembers[${i}].role`}
                        label="Role(s)"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <SkillsSelect //still uses constant values instead of values taken from the db
                        name={`projectMembers[${i}].practicedSkills`}
                        label="Skills"
                      />
                    </Grid>
                    <Grid item xs={6} sm={1}>
                      <LabeledTextField
                        label="Hours"
                        helperText="H. per week"
                        name={`projectMembers[${i}].hoursPerWeek`}
                        size="small"
                        type="number"
                        sx={{
                          "& .MuiFormHelperText-root": {
                            marginLeft: 0,
                            marginRight: 0,
                            textAlign: "center",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={2} sm={1} style={{ textAlign: "center" }}>
                      <LabeledCheckbox
                        name={`projectMembers[${i}].active`}
                        label="Active"
                      />
                    </Grid>
                    <hr className="rows__separator" />
                  </Fragment>
                ))}
              </Grid>
            </>
            <Box textAlign="center">
              <Button
                disabled={navigation.state === "submitting"}
                variant="contained"
                type="submit"
              >
                {navigation.state === "submitting" ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </ValidatedForm>
        </Paper>
      </Container>
    </>
  );
};

export default EditMembersPage;
