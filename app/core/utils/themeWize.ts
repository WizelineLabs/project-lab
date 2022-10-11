import { createTheme } from "@mui/material/styles"
const themeWize = createTheme({
  palette: {
    primary: {
      main: "#E94D44",
    },
    secondary: { main: "#3B72A4" },
    secondaryB: { main: "#00A7E5" },
    secondaryC: { main: "#E5C8A6" },
  },
})
declare module "@mui/material/styles" {
  interface Palette {
    secondaryB: Palette["primary"]
    secondaryC: Palette["primary"]
  }

  interface PaletteOptions {
    secondaryB?: PaletteOptions["primary"]
    secondaryC?: PaletteOptions["primary"]
  }
}
export default themeWize
