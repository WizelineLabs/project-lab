import React from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Radio, RadioGroup} from '@mui/material';
import TextInput from '../../../core/components/FormFields/TextInput';
import DatePickerInput from '~/core/components/FormFields/DatePicker';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from "zod";
import { createForm } from '~/models/applicant.server';
import { ValidatedForm } from "remix-validated-form";
import { redirect } from 'remix-typedjson';
import { zfd } from "zod-form-data";
import type { ActionFunction,} from "@remix-run/node";
import { requireProfile } from '~/session.server';
//import Projects from '../projects';

export const validator = withZod(
  zfd.formData({
    email: z.string(),
    personalEmail: z.string(),
    fullName: z.string(),
    nationality: z.string(),
    country: z.string(),
    dayOfBirth: z.date(),
    homeAddress: z.string(),
    phone: z.string(),
    universityEmail: z.string(),
    emergencyContactName: z.string(),
    emergencyContactPhone: z.string(),
    emergencyRelationship: z.string(),
    gender: z.string(),
    englishLevel: z.string(),
    university: z.string(),
    campus: z.string(),
    major: z.string(),
    semester: z.string(),
    graduationDate: z.date(),
    interest: z.string(),
    experience: z.string(),
    cvLink: z.string(),
    interestedRoles: z.string(),
    preferredTools: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    hoursPerWeek: z.number(),
    howDidYouHearAboutUs: z.string(),
    participatedAtWizeline: z.boolean(),
    wizelinePrograms: z.string(),
    comments: z.string(),
  })
);

export const action: ActionFunction = async ({ request }) => {
    const profile = await requireProfile(request);
    //const project = await requireProject(request);
    const result = await validator.validate(await request.formData());
    

    if (!result) {
      throw new Response("Error", {
        status: 400,
      });
    }
    await createForm(
      result?.data?.email as string,
      result?.data?.personalEmail as string,
      result?.data?.fullName as string,
      result?.data?.nationality as string,
      result?.data?.country as string,
      result?.data?.dayOfBirth as Date,
      result?.data?.homeAddress as string,
      result?.data?.phone as string,
      result?.data?.universityEmail as string,
      result?.data?.emergencyContactName as string,
      result?.data?.emergencyContactPhone as string,
      result?.data?.emergencyRelationship as string,
      result?.data?.gender as string,
      result?.data?.englishLevel as string,
      result?.data?.university as string,
      result?.data?.campus as string,
      result?.data?.major as string,
      result?.data?.semester as string,
      result?.data?.graduationDate as Date,
      result?.data?.interest as string,
      result?.data?.experience as string,
      result?.data?.cvLink as string,
      result?.data?.interestedRoles as string,
      result?.data?.preferredTools as string,
      result?.data?.startDate as Date,
      result?.data?.endDate as Date,
      result?.data?.hoursPerWeek as number,
      result?.data?.howDidYouHearAboutUs as string,
      result?.data?.participatedAtWizeline as boolean,
      result?.data?.wizelinePrograms as string,
      result?.data?.comments as string,
      profile.id
    );
    return redirect('/projects/');
  };
  
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
        action='./hold'
        defaultValues={{
          email: "",
          personalEmail: "",
          gender: "",
          fullName: "",
          nationality: "",
          country: "",
          dayOfBirth: new Date(),
          homeAddress: "",
          phone: "",
          university: "",
          campus: "",
          universityEmail: "",
          emergencyContactName: "",
          emergencyRelationship: "",
          emergencyContactPhone: "",
          experience: "",
          englishLevel: "",
          major: "",
          semester: "",
          graduationDate: new Date(),
          interest: "",
          cvLink: "",
          interestedRoles: "",
          preferredTools: "",
          startDate: new Date(),
          endDate: new Date(),
          hoursPerWeek: 1,
          howDidYouHearAboutUs: "",
          participatedAtWizeline: false,
          wizelinePrograms: "",
          comments: "",
        }} 
        method='post'
        >
        <Grid container spacing={10}>
          <Grid item xs={6}>
          <TextInput
              label="Email"
              id='outlined-basic-email'
              name="email"
            />
          <TextInput
              label="Personal email"
              id='outlined-basic-personalEmail'
              name="personalEmail"
            />
            <RadioGroup name='gender' id='radio-buttons-group-gender'>
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
            <FormControlLabel value="Non-binary" control={<Radio />} label="Non-binary" />
            <FormControlLabel value="Prefer not to say" control={<Radio />} label="Prefer not to say" />
            <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>

            <TextInput
              label="Full Name"
              name="fullName"
              id="outlined-basic-fullName"
            />
            <TextInput
              label="Nationality"
              name="nationality"
              id='outlined-basic-nationality'
            />
            <RadioGroup name="country" id='radio-buttons-group-country'>
              <FormControlLabel value="Canada" control={<Radio />} label="Canada" />
              <FormControlLabel value="Colombia" control={<Radio />} label="Colombia" />
              <FormControlLabel value="Mexico" control={<Radio />} label="Mexico" />
              <FormControlLabel value="Spain" control={<Radio />} label="Spain" />
              <FormControlLabel value="United States" control={<Radio />} label="United States" />
              <FormControlLabel value="Vietnam" control={<Radio />} label="Vietnam" />
              <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>

            <DatePickerInput
              label="Date of birth"
            />
            <TextInput
              label="Home adress"
              name="homeAddress"
              id='outlined-basic-homeAdress'
            />
            <TextInput
              label="Phone number"
              name="phone"
              id='outlined-basic-phone'
            />
            <RadioGroup name="university" id='radio-buttons-group-university'>
              <FormControlLabel value="Instituto Tecnológico Superior de Ciudad Hidalgo" control={<Radio />} label="Instituto Tecnológico Superior de Ciudad Hidalgo" />
              <FormControlLabel value="Instituto Tecnológico Superior Zacatecas Sur" control={<Radio />} label="Instituto Tecnológico Superior Zacatecas Sur" />
              <FormControlLabel value="Tecnológico de Monterrey" control={<Radio />} label="Tecnológico de Monterrey" />
              <FormControlLabel value="UNIVA" control={<Radio />} label="UNIVA" />
              <FormControlLabel value="Universidad Autónoma de San Luis Potosí" control={<Radio />} label="Universidad Autónoma de San Luis Potosí" />
              <FormControlLabel value="Universidad de Guadalajara (CUNORTE)" control={<Radio />} label="Universidad de Guadalajara (CUNORTE)" />
              <FormControlLabel value="Universidad Politécnica de Quintana Roo" control={<Radio />} label="Universidad Politécnica de Quintana Roo" />
              <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>

            <TextInput
              label="Campus, if applicable"
              name='campus'
              id='outlined-basic-campus'
            />
            <TextInput
              label="Organization or University Email"
              name='universityEmail'
              id='outlined-basic-universityEmail'
            />
            <TextInput
              label="Name of contact in case of emergency"
              name='emergencyContactName'
              id='outlined-basic-emergencyContactName'
            />
            <RadioGroup name="emergencyRelationship" id='radio-buttons-group-emergencyRelationship'>
              <FormControlLabel value="Brother" control={<Radio />} label="Brother" />
              <FormControlLabel value="Daughter" control={<Radio />} label="Daughter" />
              <FormControlLabel value="Father" control={<Radio />} label="Father" />
              <FormControlLabel value="Friend" control={<Radio />} label="Friend" />
              <FormControlLabel value="Husband" control={<Radio />} label="Husband" />
              <FormControlLabel value="Mother" control={<Radio />} label="Mother" />
              <FormControlLabel value="Partner" control={<Radio />} label="Partner" />
              <FormControlLabel value="Sister" control={<Radio />} label="Sister" />
              <FormControlLabel value="Son" control={<Radio />} label="Son" />
              <FormControlLabel value="Wife" control={<Radio />} label="Wife" />
            </RadioGroup>

            <TextInput
              label="Emergency phone number"
              name='emergencyContactPhone'
              id='emergencyContactPhone'
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              label="Professional Experience"
              name='experience'
              id='outlined-basic-experience'
            />
            <RadioGroup name="englishLevel" id='radio-buttons-group-englishLevel'>
              <FormControlLabel value="English Basic User (A1, A2)" control={<Radio />} label="English Basic User (A1, A2)" />
              <FormControlLabel value="Intermediate (B1)" control={<Radio />} label="Intermediate (B1)" />
              <FormControlLabel value="Upper intermediate (B2)" control={<Radio />} label="Upper intermediate (B2)" />
              <FormControlLabel value="Proficient (C1,C2)" control={<Radio />} label="Proficient (C1,C2)" />
            </RadioGroup>

            <TextInput
              label="Degree and field you are studying"
              name='major'
              id='outlined-basic-major'
            />
            <TextInput
              label="Semester or period you will be studying while this program runs"
              name='semester'
              id='outlined-basic-semester'
            />
            <DatePickerInput
              label="Graduation date"
            />
            <TextInput
              label="Describe why you are interested in applying for a program at Wizeline"
              name='interest'
              id='outlined-basic-interest'
            />
            <TextInput
              label="Link to your CV or LinkedIn profile"
              name='cvLink'
              id='outlined-basic-cvLink'
            />
            <RadioGroup name="interestedRoles" id='radio-buttons-group-interestedRoles'>
              <FormControlLabel value="Software Development" control={<Radio />} label="Software Development" />
              <FormControlLabel value="Data Engineering" control={<Radio />} label="Data Engineering" />
              <FormControlLabel value="Mobile Development" control={<Radio />} label="Mobile Development" />
              <FormControlLabel value="QA Engineering" control={<Radio />} label="QA Engineering" />
              <FormControlLabel value="Site Reliability Engineering (DevOps)" control={<Radio />} label="Site Reliability Engineering (DevOps)" />
              <FormControlLabel value="UX Design" control={<Radio />} label="UX Design" />
              <FormControlLabel value="Visual Design" control={<Radio />} label="Visual Design" />
              <FormControlLabel value="Project Management" control={<Radio />} label="Project Management" />
            </RadioGroup>

            <TextInput
              label="Preferred tools, programs, frameworks, programming languages or libraries"
              name='preferredTools'
              id='outlined-basic-preferredTools'
            />
            <DatePickerInput
              label="Preferred start date"
            />
            <DatePickerInput
              label="Preferred end date"
            />
            <TextInput
              label="How many hours a week could you provide"
              name="hoursPerWeek"
              id="outlined-basic-hoursPerWeek"
            />
            <RadioGroup name="howDidYouHearAboutUs" id='radio-buttons-group-howDidYouHearAboutUs'>
              <FormControlLabel value="Friend recommendation" control={<Radio />} label="Friend recommendation" />
              <FormControlLabel value="Teacher recommendation" control={<Radio />} label="Teacher recommendation" />
              <FormControlLabel value="University media" control={<Radio />} label="University media" />
              <FormControlLabel value="University talk" control={<Radio />} label="University talk" />
              <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>

            <FormControlLabel
            control={<Checkbox name="participatedAtWizeline" id='checkbox-button-participatedAtWizeline' />}
            label="Have you participated in any program at Wizeline before?"
            />
            <RadioGroup name="wizelinePrograms" id='radio-buttons-group-wizelinePrograms'>
              <FormControlLabel value="Socio Formador 2023" control={<Radio />} label="Socio Formador 2023" />
              <FormControlLabel value="Socio Formador 2022" control={<Radio />} label="Socio Formador 2022" />
              <FormControlLabel value="Wizeline Experience Program (Intership)" control={<Radio />} label="Wizeline Experience Program (Intership)" />
              <FormControlLabel value="Wizeline Academy Bootcamp or Course" control={<Radio />} label="Wizeline Academy Bootcamp or Course" />
              <FormControlLabel value="Does not apply" control={<Radio />} label="Does not apply" />
            </RadioGroup>

            <TextInput
              label="Any additional comments?"
              name='comments'
              id='outlined-basic-comments'
            />
            <Button type='submit'>
              Submit
            </Button>
          </Grid>
        </Grid>
      </ValidatedForm>
    </Container>
  );
}
        
