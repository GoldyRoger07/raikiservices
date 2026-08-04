export interface SocialLink {

    name: string;

    url: string;

    icon: string;

    enabled: boolean;

}


export interface Social {

    networks: SocialLink[];

}