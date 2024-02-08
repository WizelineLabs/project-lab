import invariant from "tiny-invariant";
import Header from "~/core/layouts/Header";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { requireProfile } from "~/session.server";
import { Button, Grid, Paper } from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import LabeledTextField from "~/core/components/LabeledTextField";
import { formatDate, getCurrentDate } from "~/utils";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from '@remix-validated-form/with-zod';
import { z } from "zod";
import { zfd } from "zod-form-data";
import { getApplicantByEmail } from "~/models/applicant.server";


export const loader = async ({ request, params }: LoaderArgs) => {
    invariant(params.internId, "internId not found");
    const profile = await requireProfile(request);
    const applicant = await getApplicantByEmail(profile.email);
    return {
        applicant,
     };
}

export const validatorInterInfo = withZod(
    zfd.formData({
        applicantId: z.string().min(0),
        universityEmail: z.string().email().optional(),
        startDate: z
            .string()
            .min(1, { message: "This field is Required" })
            .refine((value:string) => {
            const currentDate = new Date();
            const currentDateString = currentDate.toISOString().split("T")[0];
            return value >= currentDateString;
            }, "Start date cannot be in the past"), 
        endDate: z
            .string()
            .min(1, { message: "This field is Required" })
            .refine((value: string) => {
                const currentDate = new Date();
                const currentDateString = currentDate.toISOString().split("T")[0];
                return value >= currentDateString;
            }, "End date cannot be in the past"), 
        phone: z.string().regex(
            /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im, 
            'Invalid phone number',
            ),
        emergencyContactPhone: z.string().optional(),
        cvLink: z.string()
            .refine(value => value.length > 0, "This field is required")
            .refine(value => {
            const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
            return urlPattern.test(value);
            }, "The URL has an invalid format. It must begin with 'http://' or 'https://'.")
            .refine(value => value.length >= 10, "The url must have at least 10 characters"),
    })
);
    

export default function InterInformation() {

    const { applicant } = useLoaderData();
    const [startDate, setStartDate] = useState(getCurrentDate());
    return (

        <>
            <Header 
            title="Internship Projects"
            existApplicant={true} 
            />

            <Grid item xs={12} md={9}>
                <Paper elevation={0} sx={{ padding: 2, margin: 2 }}>
                
                <ValidatedForm 
                    validator={validatorInterInfo}
                    action='./updateApplicant'
                    method='post'
                    defaultValues={
                        {
                            universityEmail: applicant.email as string,
                            startDate: formatDate(new Date(applicant.startDate)),
                            endDate: formatDate(new Date(applicant.endDate)),
                            phone: applicant.phone,
                            emergencyContactPhone: applicant.emergencyContactPhone,
                            cvLink: applicant.cvLink,
                        }
                    }
                >

                    <input type="hidden" name="applicantId" value={applicant.id} />

                    <LabeledTextField
                        label="Organization or University Email"
                        placeholder='Organization or University Email'
                        name='universityEmail'
                        fullWidth
                        type='email'
                        style={{marginBottom: '20px'}}
                    />

                    <LabeledTextField
                        label="Preferred start date"
                        name='startDate'
                        fullWidth
                        type='date'
                        style={{marginBottom: '20px'}}
                        inputProps={{
                            min: getCurrentDate(), 
                        }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                    />
                    <LabeledTextField
                        label="Preferred end date"
                        name='endDate'
                        fullWidth
                        type='date'
                        style={{marginBottom: '20px'}}
                        inputProps={{
                            min: startDate, 
                        }}
                       
                    />

                    <LabeledTextField
                        label="Phone number"
                        placeholder='Phone number'
                        name="phone"
                        fullWidth
                        type='text'
                        style={{marginBottom: '20px'}}
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
                        label="Link to your CV or LinkedIn profile"
                        placeholder='Link to your CV or LinkedIn profile'
                        name='cvLink'
                        fullWidth
                        type='text'
                        style={{marginBottom: '20px'}}
                    />
                    <Button type='submit' id='Form-Button' style={{marginBottom: '20px'}}>
                        Submit
                    </Button>
                </ValidatedForm>
                </Paper>
            </Grid>
        </>
    )
}