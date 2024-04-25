import DropDownButton from "../components/DropDownButton";
import Link from "../components/Link";
import Search from "../components/Search";
import AddIcon from "@mui/icons-material/Add";
import { Button, Container, Grid, Paper, styled } from "@mui/material";
import { useLocation, useSubmit } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

interface IProps {
  title: string;
  existApplicant?: boolean;
  applicantId?: string;
}
export interface MenuItemArgs {
  text: string;
  "data-testid"?: string;
  onClick?: () => void;
  to: string;
}

const StyledHeaderButton = styled(Button)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  background:
    theme.palette.mode === "dark" ? "#121212" : theme.palette.common.white,
  "&:hover": {
    background:
      theme.palette.mode === "dark" ? "#121212" : theme.palette.common.white,
  },
}));


const Header = ({ existApplicant, applicantId }: IProps) => {
  const currentUser = useOptionalUser();
  const submit = useSubmit();
  const location = useLocation();


  const handleClickProfile = async () => {
    if (currentUser) {
      const { email } = currentUser;
      submit(null, {
        method: "get",
        action: `/profile/${encodeURIComponent(email)}`,
      });
    } else {
      return;
    }
  };

  const handleClickProfileApplicant = async () => {
    submit(null, {
      method: "get",
      action: `/applicants/${applicantId}`,
    });
  };

  const handleLogout = async () => {
    await submit(null, { method: "post", action: "/logout" });
  };

  const options: MenuItemArgs[] = [
    ...(currentUser?.role === "ADMIN" || currentUser?.role === "USER"
      ? [
          {
            onClick: handleClickProfile,
            to: "/",
            text: "Profile",
          },
        ]
      : []),
    ...(currentUser?.role === "APPLICANT"
      ? [
          {
            onClick: handleClickProfileApplicant,
            to: "/",
            text: "Profile",
          },
        ]
    :[]),
    {
      to: "/",
      text: "Home",
    },
    {
      onClick: async () => {
        submit(null, { method: "post", action: "/logout" });
      },
      to: "/",
      text: "Sign out",
      "data-testid": "sign-out-button",
    },
    ...(currentUser?.role === "ADMIN"
      ? [
          {
            to: "/manager/filter-tags/labels",
            text: "Manager",
            "data-testid": "go-to-admin",
          },
        ]
      : []),
    
  ];

  let linkTo = "/internshipProjects";
  if (currentUser) {
    if (currentUser?.role === "APPLICANT") {
      linkTo = "/internshipProjects";
    } else {
      linkTo = "/projects";
    }
  }

  const showProposal =
    currentUser?.role === "ADMIN" || currentUser?.role === "USER";

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
              <Link to={linkTo} className="no_decoration">
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
            <Grid item sx={{ order: { md: 3 } }}>
              {currentUser &&
              !location.pathname.includes("/internshipProjects") ? (
                // Logic for any path verifying that it does not interfere with /intershipProject
                <DropDownButton options={options}>
                  {currentUser.email}
                </DropDownButton>
              ) : // Logic for /intershipProjects if form is answered
              location.pathname.includes("/internshipProjects") &&
                currentUser &&
                existApplicant ? (
                <DropDownButton options={options}>
                  {currentUser?.email}
                </DropDownButton>
              ) : // Logic for /intershipProjects if form is not answered
              location.pathname.includes("/internshipProjects") &&
                currentUser &&
                !existApplicant ? (
                <Button
                  className="contained"
                  sx={{
                    width: "200px",
                    height: "40px",
                    fontSize: "1em",
                  }}
                  onClick={handleLogout}
                >
                  Home
                </Button>
              ) : (
                <Button
                  className="contained"
                  sx={{
                    width: "200px",
                    height: "40px",
                    fontSize: "1em",
                  }}
                  onClick={handleLogout}
                >
                  Home
                </Button>
              )}
            </Grid>
            {showProposal ? (
              <Grid item sx={{ marginRight: 2 }}>
                <Search />
                &nbsp;
                <Link to="/projects/create" className="no_decoration">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ fontWeight: "bolder", color: "#fff" }}
                  >
                    New Proposal
                  </Button>
                </Link>
              </Grid>
            ) : null}
          </Grid>
        </Container>
      </Paper>
    </>
  );
};

export default Header;
