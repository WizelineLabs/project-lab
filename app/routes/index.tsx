import { useLoaderData } from "@remix-run/react";
import { HomePageContainer, HomeHeader } from "./index.styles";
import { useOptionalUser } from "~/utils";
import { Button, Stack } from "@mui/material";
import ExperienceArea from "~/core/components/ExperienceComments";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { getExperience } from "~/models/experience.server";

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
  const user = useOptionalUser();

  const { info } = useLoaderData();

  const shuffledInfo = info ? [...info].sort(() => Math.random() - 0.5) : [];

  const justFour = shuffledInfo.slice(0, 4);

  let navigate;
  if (user) {
    if (user.role === "APPLICANT") {
      navigate = "/internshipProjects";
    } else {
      navigate = "/projects";
    }
  }

  return (
    <article>
      <HomeHeader>
        <img
          src="/wizeletters.png"
          alt="Wizeline letters for homepage header"
          width={190}
        />
      </HomeHeader>
      <HomePageContainer>
        <img
          src="/background.jpg"
          alt="Background fo the homepage"
          style={{ width: "100%" }}
        />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          margin={{ xs: "20px", sm: "5px", md: "30px" }}
        >
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
        <Stack alignItems="center" spacing={2} sx={{ margin: "20px" }}>
          {!user && (
            <Button
              href="/login"
              className="contained"
              sx={{
                width: "240px",
                height: "60px",
                fontSize: "1.5em",
              }}
            >
              Log In
            </Button>
          )}
          {user && (
            <Button
              href={navigate}
              variant="contained"
              sx={{
                width: "240px",
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
                width: "240px",
                height: "60px",
                fontSize: "1.5em",
              }}
            >
              View Projects
            </Button>
          )}
        </Stack>
      </HomePageContainer>
    </article>
  );
}
