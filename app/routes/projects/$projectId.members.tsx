import { Fragment, useEffect } from "react";
import Header from "app/core/layouts/Header";
import GoBack from "app/core/components/GoBack";
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
import { SkillsSelect } from "app/core/components/SkillsSelect";
import { DisciplinesSelect } from "~/core/components/DisciplinesSelect";

import {
  validationError,
  ValidatedForm,
  FieldArray,
} from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { SubmitOptions } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useTransition, useLoaderData, useFetcher } from "@remix-run/react";
import { requireProfile, requireUser } from "~/session.server";
import { getProject, getProjectTeamMembers, updateMembers } from "~/models/project.server";
import invariant from "tiny-invariant";
import { adminRoleName } from "~/constants";
import LabeledTextField from "~/core/components/LabeledTextField";
import { LabeledCheckbox } from "~/core/components/LabeledCheckbox";
import { isProjectMemberOrOwner } from "~/utils";

type ProfileValue = {
  id: string;
  name: string;
};

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
    const {
      projectMembers: currentMembers = [],
      ownerId: currentOwnerId = null
    } = currentProject;
    isProjectMemberOrOwner(profile.id, currentMembers, currentOwnerId);
  }
  
  const result = await validator.validate(await request.formData());
  if (result.error != undefined) return validationError(result.error);

  try {
    await updateMembers(
      projectId,
      result.data.projectMembers
    );
    return redirect(`/projects/${projectId}`);
  } catch (e) {
    if (
      e instanceof PrismaClientKnownRequestError ||
      e instanceof PrismaClientValidationError
    ) {
      console.log(e.message);
      return validationError({
        fieldErrors: {
          formError: "Server failed",
        },
      });
    }
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.projectId, "projectId could not be found");
  const projectId = params.projectId;
  const profile = await requireProfile(request);
  const projectMembers = await getProjectTeamMembers(projectId);
  return json({ profile, projectMembers, projectId });
};

const EditMembersPage = () => {
  const { profile, projectMembers, projectId } = useLoaderData();
  const profileFetcher = useFetcher<ProfileValue[]>();
  const transition = useTransition();

  const searchProfiles = (value: string) => {
    profileFetcher.submit({ q: value }, profileFetcherOptions);
  };
  const searchProfilesDebounced = debounce(searchProfiles, 500);

  useEffect(() => {
    if (profileFetcher.type === "init") {
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
            <FieldArray name="projectMembers">
              {(items, { push, remove }) => (
                <>
                  <Autocomplete
                    multiple
                    style={{ margin: "1em 0" }}
                    options={profileFetcher.data ?? []}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
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
                          profile: { firstName: details?.option.name },
                          active: true,
                        });
                      }
                      if (
                        reason === "removeOption" &&
                        profile.name !== details?.option.name
                      ) {
                        remove(
                          items.findIndex(
                            (item) => item.profileId !== details?.option.id
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
                              value={item.profileId}
                            />
                            <Chip
                              label={`${item.profile?.firstName} ${item.profile?.lastName}`}
                              onDelete={() => {
                                if (item.profileId !== profile.id) {
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
                        <Grid
                          item
                          xs={2}
                          sm={1}
                          style={{ textAlign: "center" }}
                        >
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
              )}
            </FieldArray>
            <Box textAlign="center">
              <Button
                disabled={transition.state === "submitting"}
                variant="contained"
                type="submit"
              >
                {transition.state === "submitting" ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </ValidatedForm>
        </Paper>
      </Container>
    </>
  );
};

export default EditMembersPage;
