
export interface Company {
    name: string
    legalName: string
    slogan: string
    description: string
    logo: Logo
    contact: Contact
}

export interface Logo{
    light: string
    dark: string
}

export interface Contact{
    email: string
    phone: string
    address: string
}

