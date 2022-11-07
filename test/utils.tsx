import { RemixBrowser } from "@remix-run/react"

// This function allow the test to use the Link component
export function RemixStub({ children }: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any
  win.__remixManifest = {
    routes: {
      "routes/$": {
        id: "routes/$",
        path: "*",
      },
    },
  }
  win.__remixRouteModules = {
    "routes/$": {
      default: () => children,
    },
  }
  win.__remixContext = {
    appState: {},
    matches: [],
    routeData: {},
  }

  return <RemixBrowser />
}