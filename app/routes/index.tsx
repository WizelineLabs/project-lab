import { useLoaderData } from "@remix-run/react";
import {
  HomePageContainer,
  HomeHeader,
  SecondaryHeader,
  HomeTitle,
  PageContainerTitle,
  StackContainer,
  IconButton,
  MiddleHomePageContainer,
} from "./index.styles";
import { useOptionalUser } from "~/utils";
import { Button, Stack } from "@mui/material";
import ExperienceArea from "~/core/components/ExperienceComments";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { getExperience } from "~/models/experience.server";
import HomeInfo from "~/core/components/HomeInfo";
import TerminalIcon from "@mui/icons-material/Terminal";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DehazeIcon from "@mui/icons-material/Dehaze";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const info = await getExperience();

  return {
    info,
  };
};

type experienceInfo = {
  comentario: string | null;
  id: number;
  profile: { avatarUrl: string | null } | null;
};

export default function Index() {
  const [menu, setMenu] = useState(false);
  const user = useOptionalUser();

  const { info } = useLoaderData();

  const shuffledInfo = info ? [...info].sort(() => Math.random() - 0.5) : [];

  const justFour = shuffledInfo.slice(0, 4);

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
        <img
          src="/wizeline.png"
          alt="Wizeline logo for homepage header"
          width={70}
        />
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
          {!user && (
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
          )}
        </StackContainer>
      </SecondaryHeader>
      <HomePageContainer>
        <img
          src="HomeBg.jpg"
          alt="Background fo the homepage"
          style={{ width: "100%" }}
        />
        <PageContainerTitle>Our personal experience</PageContainerTitle>
        <Stack direction={{ xs: "column", sm: "row" }}>
          {!info && <p>No experience</p>}
          {info && (
            <>
              {justFour.map((experience: experienceInfo) => (
                <ExperienceArea
                  key={experience.id}
                  imag={experience.profile?.avatarUrl || ""}
                  text={experience.comentario || ""}
                />
              ))}
            </>
          )}
        </Stack>
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
          <PageContainerTitle style={{ textAlign: "center" }}>
            Join us
          </PageContainerTitle>
          {!user && (
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
          )}
          {user && (
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
          )}
          {!user && (
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
          )}
        </Stack>
      </HomePageContainer>
    </main>
  );
}
