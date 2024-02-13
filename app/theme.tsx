import { createTheme as createMuiTheme } from "@mui/material";

interface CreateThemeOptions {
  prefersDarkMode: boolean;
}

// Create a theme instance.
export function createTheme({ prefersDarkMode }: CreateThemeOptions) {
  return createMuiTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
      primary: {
        main: prefersDarkMode ? "#3B72A4" : "#4E90B9",
      },
      background: {
        default: prefersDarkMode ? "#333" : "#f2f4f4",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: "#AF2E33",
            },
            backgroundColor: "#701D21",
            color: "#fff",
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: "#AF2E33",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: "#4E90B9",
            color: "#fff",
          },
        },
      },
    },
  });
}
