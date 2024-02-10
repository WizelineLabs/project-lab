import {
  AppBar,
  Box,
  Button,
  Toolbar,
  styled,
  useMediaQuery,
} from "@mui/material";
import Link from "~/core/components/Link";

interface Props {
  title: string;
}

const StyledBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    padding: "0 16px",
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.mode === "dark" ? "#AF2E33" : "#701D21",
  background:
    theme.palette.mode === "dark" ? "#121212" : theme.palette.common.white,
}));

const StyledToolbar = styled(Toolbar)(() => ({
  padding: "0 !important",
  minHeight: "30.75px !important",
}));

const StyledTabButton = styled(Button)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.mode === "dark" ? "#AF2E33" : "#701D21",
  background:
    theme.palette.mode === "dark" ? "#121212" : theme.palette.common.white,
  "&:hover": {
    background: theme.palette.mode === "dark" ? "#202020" : "#F5F5F5",
  },
}));

const NavAppBar = ({ title }: Props) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const tabs = [
    {
      title: "Projects",
      link: "/projects",
    },
    {
      title: "Profiles",
      link: "/profiles",
    },
    {
      title: "Internship Applicants",
      link: "/applicants",
    },
  ];

  return (
    <StyledBox
      sx={{
        maxWidth: "1200px",
        height: "62.75px",
        margin: "0 auto",
        mb: 2,
        px: 3,
      }}
    >
      <StyledAppBar
        position="static"
        sx={{
          p: 2,
          display: "block",
          borderRadius: "4px",
          boxShadow: "none",
        }}
      >
        <StyledToolbar
          sx={{ position: "static", pl: 0, height: "30.75px!important" }}
        >
          {tabs.map((tab) => (
            <Link to={tab.link} className="no_decoration" key={tab.title}>
              <StyledTabButton
                size="small"
                disableElevation
                variant={title === tab.title ? "contained" : "text"}
                sx={{
                  color:
                    title === tab.title
                      ? prefersDarkMode
                        ? "#fff"
                        : "#000000"
                      : null,
                }}
              >
                {tab.title}
              </StyledTabButton>
            </Link>
          ))}
        </StyledToolbar>
      </StyledAppBar>
    </StyledBox>
  );
};

export default NavAppBar;
