import type {
  LinksFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import StylesheetUrl from "./styles/style.css";
import { getUser } from "./session.server";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { createTheme } from "./theme";
import { useMemo } from "react";
import { ThemeProvider } from "@emotion/react";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: StylesheetUrl },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
    },
  ];
};

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: "Wizelabs",
    },
    {
      name: "description",
      content: "Wizeline's innovation hub",
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  return { user: await getUser(request) };
};

interface IDocumentProps {
  children: any;
}

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () => createTheme({ prefersDarkMode }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Document>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </Document>
    </ThemeProvider>
  );
}

function Document({ children }: IDocumentProps) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
