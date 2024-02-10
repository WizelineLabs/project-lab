import HomeIcon from "@mui/icons-material/Home";
import { Typography, Grid } from "@mui/material";

function HomeInfo({
  icon = <HomeIcon />,
  title = "Information",
  description = "Description",
}: {
  icon?: JSX.Element;
  title?: string;
  description?: string;
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
      {icon}
      <Typography variant="h5" component="p" color="black" fontWeight="600">
        {title}
      </Typography>
      <Typography variant="body1" component="p" mt={3} color="black">
        {description}
      </Typography>
    </Grid>
  );
}

export default HomeInfo;
