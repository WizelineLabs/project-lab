import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import StylesheetUrl from "./styles/style.css";
import quillCss from "quill/dist/quill.snow.css";

import { getUser } from "./session.server";
import { LensTwoTone } from "@mui/icons-material";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: StylesheetUrl },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
    },
    { rel: "stylesheet", href: quillCss },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Wizelabs",
  viewport: "width=device-width,initial-scale=1",
  description: "Wizeline's innovation hub",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return { user: await getUser(request) };
};

interface IDocumentProps {
  children: any;
}

export default function App() {
  return (
    <Document>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </Document>
  );
}

function Document({ children }: IDocumentProps) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
