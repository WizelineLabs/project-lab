import { Link } from "@remix-run/react";
import {
  Panel,
  Greet,
  StyledLoginForm,
  Footer,
  LoginPageContainer,
} from "./login.styles";

import { useOptionalUser } from "~/utils";
import { Container, Grid } from "@mui/material";

export default function Index() {
  const user = useOptionalUser();
  return (
    <LoginPageContainer>
      <Panel>
        <img src="/wizeletters.png" alt="Wizeline" width={140} />
        <StyledLoginForm>
          <Greet>Welcome back Wizeliner!</Greet>
          {user ? (
            <Link
              to="/projects"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
            >
              Projects
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
            >
              Log In
            </Link>
          )}
          <Footer>
            <h3>Built with</h3>
            <Grid container spacing={2} justifyContent="space-evenly">
              {[
                {
                  src: "https://avatars.githubusercontent.com/u/64235328?s=200&v=4",
                  alt: "Remix.run",
                  href: "https//remix.run/",
                },
                {
                  src: "https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg",
                  alt: "Fly.io",
                  href: "https://fly.io",
                },
                {
                  src: "https://user-images.githubusercontent.com/1500684/157764395-137ec949-382c-43bd-a3c0-0cb8cb22e22d.svg",
                  alt: "SQLite",
                  href: "https://sqlite.org",
                },
                {
                  src: "https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg",
                  alt: "Prisma",
                  href: "https://prisma.io",
                },
                {
                  src: "https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg",
                  alt: "Tailwind",
                  href: "https://tailwindcss.com",
                },
                {
                  src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
                  alt: "Cypress",
                  href: "https://www.cypress.io",
                },
                {
                  src: "https://user-images.githubusercontent.com/1500684/157772386-75444196-0604-4340-af28-53b236faa182.svg",
                  alt: "MSW",
                  href: "https://mswjs.io",
                },
                {
                  src: "https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg",
                  alt: "Vitest",
                  href: "https://vitest.dev",
                },
                {
                  src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
                  alt: "Testing Library",
                  href: "https://testing-library.com",
                },
                {
                  src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
                  alt: "Prettier",
                  href: "https://prettier.io",
                },
                {
                  src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
                  alt: "ESLint",
                  href: "https://eslint.org",
                },
                {
                  src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
                  alt: "TypeScript",
                  href: "https://typescriptlang.org",
                },
              ].map((img) => (
                <Grid item key={img.href}>
                  <a
                    href={img.href}
                    className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
                  >
                    <img
                      height={32}
                      alt={img.alt}
                      src={img.src}
                      className="object-contain"
                    />
                  </a>
                </Grid>
              ))}
            </Grid>
          </Footer>
        </StyledLoginForm>
      </Panel>
    </LoginPageContainer>
  );
}
