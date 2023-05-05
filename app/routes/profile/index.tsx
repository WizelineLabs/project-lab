import Header from "app/core/layouts/Header";
import {
  Box,
  Container,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { getGitHubProfileByEmail } from "../../models/profile.server";
import { useUser } from "~/utils";
import {  useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { requireUser } from "~/session.server";

type LoaderData = {
  data: Awaited<ReturnType<typeof getGitHubProfileByEmail>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const userEmail = user.email;
  const githubProfileData = await getGitHubProfileByEmail( userEmail );
  return { data: {githubProfileData} };
};

export const ProfileInfo = () => {
  const currentUser = useUser();
  const {data}  = useLoaderData() as LoaderData;
  let username = data?.username;

  const theme = useTheme();
  const lessThanMd = useMediaQuery(theme.breakpoints.down("md"));  
  
  return (
    <>
      <Header title="Projects" />
      <Container>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid
            item
            xs={8}
            md={3}
            sx={{
              position: { xs: "absolute", md: "inherit" },
              left: { xs: 0, md: undefined },
              zIndex: { xs: 2, md: undefined },
              display: {
                md: "inherit",
              },
            }}
          >
            <Paper elevation={lessThanMd ? 5 : 0}>
           {/*  <Paper >  */}

             {/*  <Box  sx={{ minWidth:200}}> */}
              <Box sx={{ paddingTop: 1, paddingLeft: 2, paddingRight: 2, minWidth:200 }}>
            {/*   <Box > */}


               
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`https://avatars.githubusercontent.com/u/583231?v=4`}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>
                <Box textAlign="center">
                  <h1> { currentUser?.name }</h1>
                  <h4 style={{margin:0}}>{ username }</h4>
                </Box>
            </Box>
            </Paper>



          </Grid>
          <Grid item xs={12} md={9}>
            <Paper elevation={0} sx={{ padding: 2 }}>
              <h2 style={{ marginTop: 0 }}>
                Active Projects
              </h2>

              <Grid
                container
                sx={{ p:2}}
              >
              <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Project Name
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Project Description: Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Project Name
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Project Description: Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Project Name
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Project Description: Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </Card>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProfileInfo;
