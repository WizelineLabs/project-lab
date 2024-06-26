import {
  HomePageContainer,
  HomeHeader,
  SecondaryHeader,
  HomeTitle,
  PageContainerTitle,
  StackContainer,
  IconButton,
  MiddleHomePageContainer,
  Logo,
} from "./index.styles";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CloseIcon from "@mui/icons-material/Close";
import DehazeIcon from "@mui/icons-material/Dehaze";
import EditNoteIcon from "@mui/icons-material/EditNote";
import GroupsIcon from "@mui/icons-material/Groups";
import TerminalIcon from "@mui/icons-material/Terminal";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import { Button, Stack } from "@mui/material";
import { useState } from "react";
import HomeInfo from "~/core/components/HomeInfo";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const [menu, setMenu] = useState(false);
  const user = useOptionalUser();

  const handleMenu = () => {
    setMenu(!menu);
  };

  let navigate;
  if (user) {
    if (user.role === "APPLICANT") {
      navigate = "/internshipProjects";
    } else {
      navigate = "/projects";
    }
  }

  return (
    <main>
      <HomeHeader>
        <img
          src="/wizeletters.png"
          alt="Wizeline letters for homepage header"
          width={190}
        />
      </HomeHeader>
      <IconButton>
        {menu ? (
          <CloseIcon onClick={handleMenu} style={{ fontSize: "35px" }} />
        ) : (
          <DehazeIcon onClick={handleMenu} style={{ fontSize: "35px" }} />
        )}
      </IconButton>
      <SecondaryHeader open={menu}>
        <Logo>
          <img
            src="/wizeline.png"
            alt="Wizeline logo for homepage header"
            width={70}
          />
        </Logo>

        <a href="https://www.wizeline.com/contact/">
          <HomeTitle>Contact</HomeTitle>
        </a>
        <a href=" https://www.wizeline.com/about-us/">
          <HomeTitle>About</HomeTitle>
        </a>
        <a href="https://www.wizeline.com/offerings/">
          <HomeTitle>Work</HomeTitle>
        </a>
        <a href="https://academy.wizeline.com/">
          <HomeTitle>Academy</HomeTitle>
        </a>

        <StackContainer>
          {!user ? (
            <>
              <Button
                href="/login/wizeline"
                className="contained"
                sx={{
                  width: "180px",
                  height: "40px",
                  fontSize: "1em",
                  margin: "8px",
                }}
              >
                Wizeline Log In
              </Button>
              <Button
                href="/login/linkedin"
                className="contained"
                sx={{
                  width: "180px",
                  height: "40px",
                  fontSize: "1em",
                  margin: "8px",
                }}
              >
                Applicant Log In
              </Button>
            </>
          ) : null}
        </StackContainer>
      </SecondaryHeader>
      <HomePageContainer>
        <img
          src="HomeBg.jpg"
          alt="Background fo the homepage"
          style={{ width: "100%" }}
        />
      </HomePageContainer>
      <MiddleHomePageContainer>
        <PageContainerTitle style={{ textAlign: "right" }}>
          What you’ll get if you join?
        </PageContainerTitle>
        <Stack direction={{ xs: "column", sm: "row" }}>
          <HomeInfo
            icon={
              <TerminalIcon style={{ fontSize: "150px", color: "black" }} />
            }
            title="Projects"
            description="At Wizelabs you will have the opportunity to see multiple projects of the company which you can explore and apply to participate in."
          />
          <HomeInfo
            icon={
              <AutoStoriesIcon style={{ fontSize: "150px", color: "black" }} />
            }
            title="Learning"
            description="You will have the opportunity to learn new tools and technologies with the support of your mentor."
          />
          <HomeInfo
            icon={
              <TipsAndUpdatesIcon
                style={{ fontSize: "150px", color: "black" }}
              />
            }
            title="Innovation"
            description="You will be able to explore a diversity of projects that are guided by best practices, which make use of a wide variety of innovative technologies."
          />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }}>
          <HomeInfo
            icon={<GroupsIcon style={{ fontSize: "150px", color: "black" }} />}
            title="Teamwork"
            description="Large projects in which teamwork and a good working environment are encouraged."
          />
          <HomeInfo
            icon={
              <WorkspacesIcon style={{ fontSize: "150px", color: "black" }} />
            }
            title="Collaboration"
            description="Our development teams are composed of passionate and committed professionals who work hand in hand helping each other."
          />
          <HomeInfo
            icon={
              <EditNoteIcon style={{ fontSize: "150px", color: "black" }} />
            }
            title="Recruitment"
            description="Explore the different projects, fill out the form with your information and apply to the projects you are interested in."
          />
        </Stack>
      </MiddleHomePageContainer>
      <HomePageContainer>
        <Stack alignItems="center" spacing={2} sx={{ margin: "20px" }}>
          <h2 style={{ textAlign: "center" }}>Join us</h2>
          {!user ? (
            <>
              <Button
                href="/login/wizeline"
                className="contained"
                sx={{
                  width: "300px",
                  height: "60px",
                  fontSize: "1.5em",
                }}
              >
                Wizeline Log In
              </Button>
              <Button
                href="/login/linkedin"
                className="contained"
                sx={{
                  width: "300px",
                  height: "60px",
                  fontSize: "1.5em",
                }}
              >
                Applicant Log In
              </Button>
            </>
          ) : null}
          {user ? (
            <Button
              href={navigate}
              variant="contained"
              sx={{
                width: "300px",
                height: "60px",
                fontSize: "1.5em",
              }}
            >
              View Projects
            </Button>
          ) : null}
          {!user ? (
            <Button
              href="/internshipProjects"
              variant="contained"
              sx={{
                width: "300px",
                height: "60px",
                fontSize: "1.5em",
              }}
            >
              View Projects
            </Button>
          ) : null}
        </Stack>
      </HomePageContainer>
    </main>
  );
}
