import { Theme } from "../../models/theme.model";


export const themeConfig: Theme = {

  colors: {

    primary: "#C89A2D",

    primaryDark: "#A67612",

    secondary: "#111827",

    background: "#FFFFFF",

    surface: "#F7F7F7",

    foreground: "#111111",

    foregroundMuted: "#6B7280"

  },

  typography: {
    fontFamily:{
      heading:"Manrope",

      body:"Inter",

      accent:"Playfair Display"

    },

    weights:{
      light: 300,

        regular: 400,

        medium: 500,

        semibold: 600,

        bold: 700
    },

    sizes: {
              xs: "0.75rem",

        sm: "0.875rem",

        base: "1rem",

        lg: "1.125rem",

        xl: "1.25rem",

        "2xl": "1.5rem",

        "3xl": "1.875rem",

        "4xl": "2.25rem",

        "5xl": "3rem",
    },

    lineHeights:{
       tight: "1.2",

        normal: "1.5",

        relaxed: "1.75"
    }
    

  },

  radius: {

    sm: "8px",

    md: "16px",

    lg: "24px"

  }

};