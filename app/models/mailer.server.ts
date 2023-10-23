import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "carlos.milanoduarte@in.wizeline.com",
    pass: "ylnp vzxp ssmr oiyy",
  },
});

export const sendEmail = (
  email: string[],
  projectName: string,
  applicantName: string
) => {
  return transporter
    .sendMail({
      subject: "New Applicant",
      bcc: email,
      text: `Hello,

I hope this message finds you well. We wanted to inform you that a new applicant has expressed interest in joining the project "${projectName}" The applicant's name is ${applicantName}. Before we proceed, we kindly request your expertise in reviewing their qualifications and suitability for the project.

Please take some time to evaluate ${applicantName}'s credentials and assess whether they align with the project's requirements and goals. Your feedback and decision will be valuable in ensuring that we have the right team for this endeavor.

To review ${applicantName}'s profile and make your decision, please visit the project dashboard.

Your prompt attention to this matter is greatly appreciated. If you have any questions or need further information, please don't hesitate to reach out.

Thank you for your continued support in making this project a success.

Best regards.`,
    })
    .then((e) => e)
    .catch((e) => e);
};
