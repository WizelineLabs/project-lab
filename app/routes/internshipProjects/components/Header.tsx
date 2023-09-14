import { Button, Container, Grid, Paper, styled } from "@mui/material";
import { Link } from "@remix-run/react";

const StyledHeaderButton = styled(Button)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  background:
    theme.palette.mode === "dark" ? "#121212" : theme.palette.common.white,
  "&:hover": {
    background:
      theme.palette.mode === "dark" ? "#121212" : theme.palette.common.white,
  },
}));

const Header = () => {
  return (
    <>
      <Paper elevation={0} sx={{ marginBottom: 2 }}>
        <Container>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            padding={2}
          >
            <Grid item xs>
              <Link to="/internshipProjects">
                <StyledHeaderButton
                  size="large"
                  startIcon={
                    <img
                      src="/wizeline.png"
                      alt="Wizeline"
                      height={30}
                      width={50}
                    />
                  }
                  className="header_button_link"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "1.5em",
                  }}
                >
                  Wizelabs
                </StyledHeaderButton>
              </Link>
            </Grid>
            <>
              <Button
                href="/login"
                className="contained"
                sx={{
                  width: "200px",
                  height: "40px",
                  fontSize: "1em",
                }}
              >
                Log In
              </Button>
            </>
          </Grid>
        </Container>
      </Paper>
    </>
  );
};

export default Header;
