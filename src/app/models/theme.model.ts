
export interface Theme {
    colors: Colors,
    typography: Typography,
    radius: Radius
}

export interface Colors{
    primary: string,
    primaryDark: string,
    secondary: string,
    background: string,
    surface: string,
    foreground: string,
    foregroundMuted: string
}

export interface Typography {

    fontFamily: {
        heading: string;
        body: string;
        accent?: string
    };


    weights: {

        light: number;

        regular: number;

        medium: number;

        semibold: number;

        bold: number;

    };


    sizes: {

        xs: string;

        sm: string;

        base: string;

        lg: string;

        xl: string;

        "2xl": string;

        "3xl": string;

        "4xl": string;

        "5xl": string;

    };


    lineHeights: {

        tight: string;

        normal: string;

        relaxed: string;

    };

}

export interface Radius{
    sm: string,
    md: string,
    lg: string
}