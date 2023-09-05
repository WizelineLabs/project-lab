import { Button, Checkbox, Container, FormControlLabel, Grid, } from '@mui/material';
import LabeledTextField from '~/core/components/LabeledTextField';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from "zod";
import { ValidatedForm } from "remix-validated-form";
import { zfd } from "zod-form-data";
import SelectField from '~/core/components/FormFields/SelectField';

export const validator = withZod(
  zfd.formData({
    email: z.string().email({message: "This field is Required"}).min(1), //For the moment this is for testing, once the login with LinkdIn is implemented, I will take the email with which you are logged in.
    personalEmail: z.string().email({message: "This field is Required"}).min(1),
    fullName: z.string().min(1,{message: "This field is Required"}),
    nationality: z.string().min(1,{message: "This field is Required"}),
    country: z.string().min(1,{message: "This field is Required"}),
    dayOfBirth: z.string().min(1,{message: "This field is Required"}), 
    homeAddress: z.string().min(1,{message: "This field is Required"}),
    phone: z.string().regex(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im, 
      'Invalid phone number',
    ),
    universityEmail: z.string().email().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    emergencyRelationship: z.string().optional(),
    gender: z.string().min(1,{message: "This field is Required"}),
    englishLevel: z.string().min(1,{message: "This field is Required"}),
    university: z.string().min(1,{message: "This field is Required"}),
    campus: z.string().optional(),
    major: z.string().min(1,{message: "This field is Required"}),
    semester: z.string().min(1,{message: "This field is Required"}),
    graduationDate: z.string().min(1,{message: "This field is Required"}), 
    interest: z.string().min(1,{message: "This field is Required"}),
    experience: z.string().min(1,{message: "This field is Required"}),
    cvLink: z.string().url({message: "This field is Required"}).min(1),
    interestedRoles: z.string().optional(),
    preferredTools: z.string().optional(),
    startDate: z.string().min(1,{message: "This field is Required"}), 
    endDate: z.string().min(1,{message: "This field is Required"}), 
    hoursPerWeek: z.string().min(1,{message: "This field is Required"}), 
    howDidYouHearAboutUs: z.string().min(1,{message: "This field is Required"}),
    participatedAtWizeline: z.string().min(1,{message: "This field is Required"}),
    wizelinePrograms: z.string().optional(),
    comments: z.string().optional(),
  })
);
  
  export default function FormPage() {
    return (
    <Container>
      <img src='/HeaderImage.png' alt='Wizeline' style={{width:"100%"}} />
      <h1>Application Form</h1>
      <h3>
        Wizeline's Innovation Experience Program is a 3-6 month program designed to help students transition 
        from the theoretical to the practical and step into technical specialties.
        In this program, participants will immerse in innovation projects with Wizeline industry experts, 
        where they can make an impact and begin a successful career in technology.
      </h3>
      <ValidatedForm 
        validator={validator}
        action='./createapplicant'
        method='post'
        >
        <Grid container spacing={10}>
          <Grid item xs={6}>
          <LabeledTextField
              label="Email"
              placeholder='Email'
              name="email"
              fullWidth
              type='email'
              style={{marginBottom: '20px'}}
            />
          <LabeledTextField
              label="Personal email"
              placeholder='Personal email'
              name="personalEmail"
              fullWidth
              type='email'
              style={{marginBottom: '20px'}}
            />
            <SelectField
              name="gender"
              label="I identify as:"
              options={[
                "Male", 
                "Female", 
                "Non-binary", 
                "Prefer not to say", 
              ]}
              style={{ width: '100%', marginBottom: '20px' }}
            />
            <LabeledTextField
              label="Full Name"
              placeholder='Full Name'
              name="fullName"
              fullWidth
              type='text'
              style={{marginBottom: '20px'}}
            />
            <LabeledTextField
              label="Nationality"
              placeholder='Full Name'
              name="nationality"
              fullWidth
              type='text'
              style={{marginBottom: '20px'}}
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
              style={{ width: '100%', marginBottom: '20px' }}
            />
            <LabeledTextField
              name="dayOfBirth"
              label="Date of birth"
              fullWidth
              type='date'
              style={{marginBottom: '20px'}}
            />
            <LabeledTextField
              label="Home adress"
              placeholder='Home adress'
              name="homeAddress"
              fullWidth
              type='text'
              style={{marginBottom: '20px'}}
            />
            <LabeledTextField
              label="Phone number"
              placeholder='Phone number'
              name="phone"
              fullWidth
              type='text'
              style={{marginBottom: '20px'}}
            />
            <p>
              If your university is not listed here, 
              please contact us at internships@wizeline.com to work it out.
            </p>
            <SelectField
              name="university"
              label="University or organization you belong to"
              options={[
                "Instituto Tecnológico Superior de Ciudad Hidalgo",
                "Instituto Tecnológico Superior Zacatecas Sur",
                "Tecnológico de Monterrey",
                "UNIVA",
                "Universidad Autónoma de San Luis Potosí",
                "Universidad de Guadalajara (CUNORTE)",
                "Universidad Politécnica de Quintana Roo",
              ]}
              style={{ width: '100%', marginBottom: '20px' }}
            />
            <LabeledTextField
              label="Campus"
              placeholder='Campus, if applicable'
              name='campus'
              fullWidth
              type='text'
              style={{marginBottom: '20px'}}
            />
            <LabeledTextField
              label="Organization or University Email"
              placeholder='Organization or University Email'
              name='universityEmail'
              fullWidth
              type='email'
              style={{marginBottom: '20px'}}
            />
            <LabeledTextField
              label="Name of contact in case of emergency"
              placeholder='Name of contact in case of emergency'
              name='emergencyContactName'
              fullWidth
              type='text'
              style={{marginBottom: '20px'}}
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
                "Wife"
              ]}
              style={{ width: '100%', marginBottom: '20px' }}
            />
            <LabeledTextField
              label="Emergency phone number"
              placeholder='Name of contact in case of emergency'
              name='emergencyContactPhone'
              fullWidth
              type='text'
              style={{marginBottom: '20px'}}
            />
            <LabeledTextField
              label="Professional Experience"
              placeholder='Professional Experience'
              name='experience'
              fullWidth
              type='text'
              multiline
              rows={2}
              style={{marginBottom: '20px'}}
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
                "Proficient (C1,C2)"
              ]}
              style={{ width: '100%', marginBottom: '20px' }}
            />
            <LabeledTextField
              label="Degree and field you are studying"
              placeholder='Degree and field you are studying'
              name='major'
              fullWidth
              type='text'
              style={{marginBottom: '20px'}}
            />
            <LabeledTextField
              label="Semester or period you will be studying while this program runs"
              placeholder='Degree and field you are studying'
              name='semester'
              fullWidth
              type='text'
              style={{marginBottom: '20px'}}
            />
            <LabeledTextField
              label="Graduation date"
              name='graduationDate'
              fullWidth
              type='date'
              style={{marginBottom: '20px'}}
            />
            <LabeledTextField
              label="Describe why you are interested in applying for a program at Wizeline"
              placeholder='Describe why you are interested in applying for a program at Wizeline'
              name='interest'
              fullWidth
              type='text'
              multiline
              rows={2}
              style={{marginBottom: '20px'}}
            />
            <LabeledTextField
              label="Link to your CV or LinkedIn profile"
              placeholder='Link to your CV or LinkedIn profile'
              name='cvLink'
              fullWidth
              type='text'
              style={{marginBottom: '20px'}}
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
                "Project Management"
              ]}
              style={{ width: '100%', marginBottom: '20px' }}
            />
            <LabeledTextField
              label="Preferred tools, programs, frameworks, programming languages or libraries"
              placeholder='Preferred tools, programs, frameworks, programming languages or libraries'
              name='preferredTools'
              fullWidth
              type='text'
              multiline
              rows={2}
              style={{marginBottom: '20px'}}
            />
            <LabeledTextField
              label="Preferred start date"
              name='startDate'
              fullWidth
              type='date'
              style={{marginBottom: '20px'}}
            />
            <LabeledTextField
              label="Preferred end date"
              name='endDate'
              fullWidth
              type='date'
              style={{marginBottom: '20px'}}
            />
            <LabeledTextField
              label="How many hours a week could you provide"
              placeholder='How many hours a week could you provide'
              name="hoursPerWeek"
              fullWidth
              type="number" 
              style={{marginBottom: '20px'}}
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
              style={{ width: '100%', marginBottom: '20px' }}
            />
            <SelectField
              name="participatedAtWizeline"
              label="Have you participated in any program at Wizeline before?"
              options={[
                "Yes",
                "No"
              ]}
              style={{ width: '100%', marginBottom: '20px' }}
            />
            <SelectField
              name="wizelinePrograms"
              label="Wich Wizeline program"
              options={[
                "Socio Formador 2023",
                "Socio Formador 2022",
                "Wizeline Experience Program (Intership)",
                "Wizeline Academy Bootcamp or Course",
                "Does not apply"
              ]}
              style={{ width: '100%', marginBottom: '20px' }}
            />
            <LabeledTextField
              label="Any additional comments?"
              placeholder='Any additional comments?'
              name='comments'
              fullWidth
              multiline
              rows={2}
              style={{marginBottom: '20px'}}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="confirmRegistration"
                  required
                />
              }
              label="I agree to finish the program and devote time to improving my skillset by confirming my registration."
              style={{ marginBottom: '20px' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="acceptPrivacy"
                  required
                />
              }
              label={
                <span>
                  I have read, understand, and accept Wizeline's{' '}
                  <a href="https://www.wizeline.com/privacy-policy/">privacy notice</a>
                </span>
              }
              style={{ marginBottom: '20px' }}
            />
            <Button type='submit' id='Form-Button' style={{marginBottom: '20px'}}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </ValidatedForm>
    </Container>
  );
}
