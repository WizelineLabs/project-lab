import { useSubmit } from "@remix-run/react";
import { useUser } from "~/utils";
import DropDownButton from "../components/DropDownButton";
import Search from "../components/Search";
import { Button, Container, Grid, Paper, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "../components/Link";

interface IProps {
  title: String;
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

const Header = ({ title }: IProps) => {
  const currentUser = useUser();
  const submit = useSubmit();
  const options: MenuItemArgs[] = [
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
              <Link to="/projects" className="no_decoration">
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
              <DropDownButton options={options}>
                {currentUser?.email}
              </DropDownButton>
            </Grid>
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
          </Grid>
        </Container>
      </Paper>
    </>
  );
};

export default Header;
