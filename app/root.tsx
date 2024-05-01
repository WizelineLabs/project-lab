import ClientStyleContext from "./core/ClientStyleContext";
import { getUser } from "./session.server";
import stylesheet from "./styles/style.css";
import { createTheme } from "./theme";
// or cloudflare/deno
import { ThemeProvider, withEmotionCache } from "@emotion/react";
import {
  unstable_useEnhancedEffect as useEnhancedEffect,
  CssBaseline,
} from "@mui/material";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import React from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader: LoaderFunction = async ({ request }) => {
  return { user: await getUser(request) };
};

interface IDocumentProps {
  children: React.ReactNode;
  title?: string;
}

export default function App() {
  const theme = createTheme({ prefersDarkMode: false });

  return (
    <ThemeProvider theme={theme}>
      <Document>
        <Outlet />
      </Document>
    </ThemeProvider>
  );
}

const Document = withEmotionCache(
  ({ children, title }: IDocumentProps, emotionCache) => {
    const clientStyleData = React.useContext(ClientStyleContext);
    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <html lang="en" className="h-full">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="description" content="Wizeline's innovation hub" />
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
          <CssBaseline />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          />
          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />
        </head>
        <body className="h-full">
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);
