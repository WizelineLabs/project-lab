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

import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node";
import StylesheetUrl from "./styles/style.css";
import quillCss from "quill/dist/quill.snow.css";

import { getUser } from "./session.server";
//import { createPost } from "./models/project.server";

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
  return {user: await getUser(request)}
};


export const action: ActionFunction = async ({ request }) => {

  console.log(Object.fromEntries(await request.formData()))
/*
  const formData = (Object.fromEntries(await request.formData()))
  
  const name = formData.name
  const description = formData.description
  const helpWanted = formData.helpWanted
  const disciplines = formData.disciplines -
  const target = formData.target
  const repoUrls = formData.repoUrls
  const slackChannel = formData.SlackeChannel
  const skills = formData.skills -
  const labels = formData.labels -
  const relatedProjects = formData.relatedProjects -
  const innovationTiers = formData.innovationTiers -
  const projectMembers = formData.projectMembers -

  await createPost({name,
                    description,
                    helpWanted,
                    disciplines,
                    target,
                    repoUrls,
                    slackChannel,
                    skills,
                    labels,
                    relatedProjects,
                    innovationTiers,
                    projectMembers})*/
  return redirect("/projects");
}


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
