import {
  Autocomplete,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  type AutocompleteChangeReason,
  Grid,
  Typography,
  TextField,
  debounce,
} from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  type SubmitOptions,
  useLoaderData,
  useFetcher,
} from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import SelectField from "~/core/components/FormFields/SelectField";
import LabeledTextField from "~/core/components/LabeledTextField";
import RegularSelect from "~/core/components/RegularSelect";
import { geActivetUniversities } from "~/models/university.server";
import { requireProfile } from "~/session.server";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export const validator = withZod(
  zfd.formData({
    personalEmail: z
      .string()
      .email({ message: "This field is Required" })
      .min(1),
    fullName: z
      .string()
      .min(1, { message: "This field is required" })
      .refine((value) => {
        return !/\d/.test(value);
      }, "Name cannot contain numbers"),
    nationality: z
      .string()
      .min(1, { message: "This field is required" })
      .refine((value) => {
        return !/\d/.test(value);
      }, "Nationality cannot contain numbers"),
    country: z.string().min(1, { message: "This field is Required" }),
    dayOfBirth: z.string().min(1, { message: "This field is Required" }),
    homeAddress: z.string().min(1, { message: "This field is Required" }),
    phone: z
      .string()
      .regex(
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im,
        "Invalid phone number"
      ),
    universityEmail: z.string().email().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    emergencyRelationship: z.string().optional(),
    gender: z.string().min(1, { message: "This field is Required" }),
    englishLevel: z.string().min(1, { message: "This field is Required" }),
    university: z
      .object({
        id: z.string(),
        name: z.string().min(1, { message: "This field is Required" }),
      })
      .required(),
    universityContactId: z
      .string()
      .min(1, { message: "This field is Required" }),
    major: z.string().min(1, { message: "This field is Required" }),
    semester: z.string().min(1, { message: "This field is Required" }),
    graduationDate: z.string().min(1, { message: "This field is Required" }),
    interest: z.string().min(1, { message: "This field is Required" }),
    experience: z.string().min(1, { message: "This field is Required" }),
    cvLink: z
      .string()
      .refine((value) => value.length > 0, "This field is required")
      .refine((value) => {
        const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
        return urlPattern.test(value);
      }, "The URL has an invalid format. It must begin with 'http://' or 'https://'.")
      .refine(
        (value) => value.length >= 10,
        "The url must have at least 10 characters"
      ),
    interestedRoles: z.string().optional(),
    preferredTools: z.string().optional(),
    startDate: z
      .string()
      .min(1, { message: "This field is Required" })
      .refine((value) => {
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().split("T")[0];
        return value >= currentDateString;
      }, "Start date cannot be in the past"),
    endDate: z
      .string()
      .min(1, { message: "This field is Required" })
      .refine((value) => {
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().split("T")[0];
        return value >= currentDateString;
      }, "End date cannot be in the past"),
    hoursPerWeek: z.string().min(1, { message: "This field is Required" }),
    howDidYouHearAboutUs: z
      .string()
      .min(1, { message: "This field is Required" }),
    participatedAtWizeline: z
      .string()
      .min(1, { message: "This field is Required" }),
    wizelinePrograms: z.string().optional(),
    comments: z
      .string()
      .max(500, { message: "The comment cannot be longer than 500 characters" })
      .optional(),
  })
);

function getCurrentDate(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface UserProfile {
  email: string;
  name: string;
}

interface LoaderData {
  universities: Awaited<ReturnType<typeof geActivetUniversities>>;
  profile: UserProfile;
}

interface UniversityValue {
  id: string;
  name: string;
}

const profileFetcherOptions: SubmitOptions = {
  method: "get",
  action: "/api/contact-search",
};

export const loader: LoaderFunction = async ({ request }) => {
  const universities = await geActivetUniversities();
  const profile = await requireProfile(request);

  return json<LoaderData>({
    universities,
    profile,
  });
};

export default function FormPage() {
  const { universities, profile } = useLoaderData() as LoaderData;

  const [selectedUniversity, setSelectedUniversity] =
    useState<UniversityValue | null>({
      id: "",
      name: "",
    });
  const [selectedContact, setSelectedContact] =
    useState<UniversityValue | null>();

  const searchContacts = (value: string, university: string | null = null) => {
    const queryUniversity = university ?? selectedUniversity?.id;
    contactFetcher.submit(
      {
        q: value,
        ...(queryUniversity ? { universityId: queryUniversity } : null),
      },
      profileFetcherOptions
    );
  };

  const handleSelectUniversity = (university: UniversityValue) => {
    setSelectedUniversity(university);
    searchContacts("", university.id);
    setSelectedContact({ id: "", name: "" });
  };
  const contactFetcher = useFetcher<UniversityValue[]>();
  const searchContactsDebounced = debounce(searchContacts, 50);

  const [startDate, setStartDate] = useState(getCurrentDate());

  return (
    <Container>
      <img src="/HeaderImage.png" alt="Wizeline" style={{ width: "100%" }} />
      <Typography component="div" variant="h2">
        Application Form
      </Typography>
      <Typography
        component="div"
        variant="body1"
        style={{ paddingBottom: "2rem" }}
      >
        Wizeline&rsquo;s Innovation Experience Program is a 3-6 month program
        designed to help students transition from the theoretical to the
        practical and step into technical specialties. In this program,
        participants will immerse in innovation projects with Wizeline industry
        experts, where they can make an impact and begin a successful career in
        technology.
      </Typography>

      <ThemeProvider theme={lightTheme}>
        <ValidatedForm
          validator={validator}
          action="./createapplicant"
          method="post"
        >
          <Grid container spacing={10}>
            <Grid item xs={6}>
              <LabeledTextField
                label="Personal email"
                placeholder="Personal email"
                name="personalEmail"
                fullWidth
                type="email"
                style={{ marginBottom: "20px", color: "black" }}
                defaultValue={profile.email}
              />
              <SelectField
                name="gender"
                label="I identify as:"
                options={["Male", "Female", "Non-binary", "Prefer not to say"]}
                style={{ width: "100%", marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Full Name"
                placeholder="Full Name"
                name="fullName"
                fullWidth
                type="text"
                style={{ marginBottom: "20px" }}
                defaultValue={profile.name}
              />
              <LabeledTextField
                label="Nationality"
                placeholder="Full Name"
                name="nationality"
                fullWidth
                type="text"
                style={{ marginBottom: "20px" }}
              />
              <SelectField
                name="country"
                label="Country of residence:"
                options={[
                  "Canada",
                  "Colombia",
                  "Mexico",
                  "Spain",
                  "United States",
                  "Vietnam",
                ]}
                style={{ width: "100%", marginBottom: "20px" }}
              />
              <LabeledTextField
                name="dayOfBirth"
                label="Date of birth"
                fullWidth
                type="date"
                style={{ marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Home adress"
                placeholder="Home adress"
                name="homeAddress"
                fullWidth
                type="text"
                style={{ marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Phone number"
                placeholder="Phone number"
                name="phone"
                fullWidth
                type="text"
                style={{ marginBottom: "20px" }}
              />
              <Typography
                component="div"
                variant="body2"
                style={{ marginBottom: "20px" }}
              >
                If your university is not listed here, please contact us at
                internships@wizeline.com to work it out.
              </Typography>

              <RegularSelect
                valuesList={universities}
                name="university"
                label="University or organization you belong to"
                onChange={handleSelectUniversity}
                style={{ width: "100%", marginBottom: "20px" }}
              />

              <input
                type="hidden"
                name="universityContactId"
                value={selectedContact?.id}
              />
              <Autocomplete
                multiple={false}
                style={{ width: "100%", marginBottom: "20px" }}
                options={contactFetcher.data ?? []}
                value={selectedContact?.id ? selectedContact : null}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                id="contact"
                getOptionLabel={(option) => option.name}
                onInputChange={(_, value) => searchContactsDebounced(value)}
                renderTags={() => null}
                onChange={(
                  event,
                  value: { id: string; name: string } | null,
                  reason: AutocompleteChangeReason
                ) =>
                  reason === "clear"
                    ? setSelectedContact({ id: "", name: "" })
                    : setSelectedContact(value)
                }
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    name="universityContact"
                    label="Select a university point of contact"
                    {...params}
                    placeholder="Select a university point of contact..."
                    value={selectedContact?.name}
                  />
                )}
              />

              <LabeledTextField
                label="Organization or University Email"
                placeholder="Organization or University Email"
                name="universityEmail"
                fullWidth
                type="email"
                style={{ marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Name of contact in case of emergency"
                placeholder="Name of contact in case of emergency"
                name="emergencyContactName"
                fullWidth
                type="text"
                style={{ marginBottom: "20px" }}
              />
              <SelectField
                name="emergencyRelationship"
                label="Relationship"
                options={[
                  "Brother",
                  "Daughter",
                  "Father",
                  "Friend",
                  "Husband",
                  "Mother",
                  "Partner",
                  "Sister",
                  "Son",
                  "Wife",
                ]}
                style={{ width: "100%", marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Emergency phone number"
                placeholder="Name of contact in case of emergency"
                name="emergencyContactPhone"
                fullWidth
                type="text"
                style={{ marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Professional Experience"
                placeholder="Professional Experience"
                name="experience"
                fullWidth
                type="text"
                multiline
                rows={2}
                style={{ marginBottom: "20px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectField
                name="englishLevel"
                label="English Level"
                options={[
                  "English Basic User (A1, A2)",
                  "Intermediate (B1)",
                  "Upper intermediate (B2)",
                  "Proficient (C1,C2)",
                ]}
                style={{ width: "100%", marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Degree and field you are studying"
                placeholder="Degree and field you are studying"
                name="major"
                fullWidth
                type="text"
                style={{ marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Semester or period you will be studying while this program runs"
                placeholder="Degree and field you are studying"
                name="semester"
                fullWidth
                type="text"
                style={{ marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Graduation date"
                name="graduationDate"
                fullWidth
                type="date"
                style={{ marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Describe why you are interested in applying for a program at Wizeline"
                placeholder="Describe why you are interested in applying for a program at Wizeline"
                name="interest"
                fullWidth
                type="text"
                multiline
                rows={2}
                style={{ marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Link to your CV or LinkedIn profile"
                placeholder="Link to your CV or LinkedIn profile"
                name="cvLink"
                fullWidth
                type="text"
                style={{ marginBottom: "20px" }}
              />
              <SelectField
                name="interestedRoles"
                label="Roles im more interested in growing"
                options={[
                  "Software Development",
                  "Data Engineering",
                  "Mobile Development",
                  "QA Engineering",
                  "Site Reliability Engineering (DevOps)",
                  "UX Design",
                  "Visual Design",
                  "Project Management",
                ]}
                style={{ width: "100%", marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Preferred tools, programs, frameworks, programming languages or libraries"
                placeholder="Preferred tools, programs, frameworks, programming languages or libraries"
                name="preferredTools"
                fullWidth
                type="text"
                multiline
                rows={2}
                style={{ marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Preferred start date"
                name="startDate"
                fullWidth
                type="date"
                style={{ marginBottom: "20px" }}
                inputProps={{
                  min: getCurrentDate(),
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setStartDate(e.target.value)
                }
              />
              <LabeledTextField
                label="Preferred end date"
                name="endDate"
                fullWidth
                type="date"
                style={{ marginBottom: "20px" }}
                inputProps={{
                  min: startDate,
                }}
                disabled={startDate === getCurrentDate()}
              />
              <LabeledTextField
                label="How many hours a week could you provide"
                placeholder="How many hours a week could you provide"
                name="hoursPerWeek"
                fullWidth
                type="number"
                style={{ marginBottom: "20px" }}
              />
              <SelectField
                name="howDidYouHearAboutUs"
                label="How did you hear about this program"
                options={[
                  "Friend recommendation",
                  "Teacher recommendation",
                  "University media",
                  "University talk",
                ]}
                style={{ width: "100%", marginBottom: "20px" }}
              />
              <SelectField
                name="participatedAtWizeline"
                label="Have you participated in any program at Wizeline before?"
                options={["Yes", "No"]}
                style={{ width: "100%", marginBottom: "20px" }}
              />
              <SelectField
                name="wizelinePrograms"
                label="Wich Wizeline program"
                options={[
                  "Socio Formador 2023",
                  "Socio Formador 2022",
                  "Wizeline Experience Program (Intership)",
                  "Wizeline Academy Bootcamp or Course",
                  "Does not apply",
                ]}
                style={{ width: "100%", marginBottom: "20px" }}
              />
              <LabeledTextField
                label="Any additional comments?"
                placeholder="Any additional comments?"
                name="comments"
                fullWidth
                multiline
                rows={2}
                style={{ marginBottom: "20px" }}
              />
              <FormControlLabel
                control={<Checkbox name="confirmRegistration" required />}
                label="I agree to finish the program and devote time to improving my skillset by confirming my registration."
                style={{ marginBottom: "20px" }}
              />
              <FormControlLabel
                control={<Checkbox name="acceptPrivacy" required />}
                label={
                  <span>
                    I have read, understand, and accept Wizeline&apos;s{" "}
                    <a href="https://www.wizeline.com/privacy-policy/">
                      privacy notice
                    </a>
                  </span>
                }
                style={{ marginBottom: "20px" }}
              />
              <Button
                type="submit"
                id="Form-Button"
                style={{ marginBottom: "20px" }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </ValidatedForm>
      </ThemeProvider>
    </Container>
  );
}
