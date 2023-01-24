import { createTheme as createMuiTheme } from "@mui/material/styles";

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
  });
}
