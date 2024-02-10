import {
  Container,
  Typography,
  Grid,
  Card,
  CardHeader,
  Avatar,
  Link,
  CardContent,
} from "@mui/material";

interface Applicant {
  id: string;
  fullName: string;
  avatarApplicant: string;
  personalEmail: string;
  experience: string;
  cvLink: string;
}

interface Props {
  applicantsForCurrentProject: Applicant[];
}

const ApplicantsComponent = ({ applicantsForCurrentProject }: Props) => {
  return (
    <Container sx={{ marginBottom: 2 }}>
      {applicantsForCurrentProject.length > 0 && (
        <Typography variant="h5" gutterBottom>
          Applicants
        </Typography>
      )}
      <Grid container spacing={2}>
        {applicantsForCurrentProject.map((applicantData) => (
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} key={applicantData.id}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardHeader
                avatar={
                  <Avatar
                    alt={applicantData.fullName}
                    src={applicantData.avatarApplicant}
                  />
                }
                title={
                  <Link
                    href={`/applicants/${applicantData.id}`}
                    underline="none"
                  >
                    <Typography variant="h6" component="div">
                      {applicantData.fullName}
                    </Typography>
                  </Link>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    {applicantData.personalEmail}
                  </Typography>
                }
              />
              <CardContent>
                <Typography
                  sx={{
                    textAlign: "justify",
                    marginBottom: "15px",
                    marginX: "5px",
                  }}
                >
                  {applicantData.experience}
                </Typography>
                <Typography sx={{ textAlign: "center" }}>
                  <Link href={applicantData.cvLink} underline="none">
                    {applicantData.cvLink}
                  </Link>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ApplicantsComponent;
