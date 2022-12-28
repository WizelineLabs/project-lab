import { Link, useSubmit } from "@remix-run/react";
import { useUser } from "~/utils";
import DropDownButton from "../components/DropDownButton";
import Search from "../components/Search";
import { Button, Container, Grid, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";

interface IProps {
  title: String;
}
export interface MenuItemArgs {
  text: string;
  "data-testid"?: string;
  onClick?: () => void;
  to: string;
}

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
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          marginBottom: 2,
        }}
      >
        <Container>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            padding={2}
          >
            <Grid item xs>
              <Link to="/">
                <Button
                  size="large"
                  startIcon={
                    <img
                      src="/wizeline.png"
                      alt="Wizeline"
                      height={30}
                      width={50}
                    />
                  }
                >
                  Wizelabs
                </Button>
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
              <Link to="/projects/create">
                <Button startIcon={<AddIcon />}>New Proposal</Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Header;
