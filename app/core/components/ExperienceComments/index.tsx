import { Avatar, Typography, Grid } from "@mui/material";

function ExperienceArea({
  imag = "/wizeline.png",
  text = "Comentario",
}: {
  imag?: string;
  text?: string;
}) {
  return (
    <Grid
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      margin={{ xs: "20px", sm: "17px", md: "50px" }}
    >
      <Avatar alt="Profile Photo" src={imag} sx={{ width: 155, height: 155 }} />
      <Typography variant="h6" component="p" mt={3} color="black">
        {text}
      </Typography>
    </Grid>
  );
}

export default ExperienceArea;
