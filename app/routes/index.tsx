import{ useLoaderData } from "@remix-run/react";
import {
  HomePageContainer,
  HomeHeader,
} from "./login.styles";
import { useOptionalUser } from "~/utils";
import { Button, Stack } from "@mui/material";
import ExperienceArea from "~/core/components/ExperienceComments";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { getExperience } from "~/models/experience.server";

export const loader: LoaderFunction = async ({ request }) => {
  const info = await getExperience();

  return ({
     info
  });
};

type experienceInfo = {
  comentario: string | null;
  id: number;
  profile: { avatarUrl: string | null } | null;
};

export default function Index() {
  const user = useOptionalUser();

  const {info} = useLoaderData();

  const shuffledInfo = info ? [...info].sort(() => Math.random() - 0.5) : [];

  const justFour = shuffledInfo.slice(0,4);

  return (
    <article>
      <HomeHeader>
        <img src="/wizeletters.png" alt="Wizeline" width={190} />
      </HomeHeader>
      <HomePageContainer>
        <img src="/background.jpg" alt="Wizeline" style={{ width: "100%" }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          margin={{ xs: "20px", sm: "5px", md: "30px" }}
        >
          {!info && "No hay experiencia"}
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
              className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-1a9vgbr-MuiButtonBase-root-MuiButton-root"
              sx={{
                width: "240px",
                height: "60px",
                fontSize: "1.5em",
              }}
            >
              Log In
            </Button>
          )}
          <Button
            href="/projects"
            className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-1a9vgbr-MuiButtonBase-root-MuiButton-root"
            sx={{
              width: "240px",
              height: "60px",
              fontSize: "1.5em",
            }}
          >
            View Projects
          </Button>
        </Stack>
      </HomePageContainer>
    </article>
  );
}
