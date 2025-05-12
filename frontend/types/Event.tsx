import { ImageSourcePropType } from "react-native";

export type EventResponse = {
    id : string,
    nom: string,
    description: string,
    photoCouverturePath: string,
    debut: string,
    fin: string,
    lieuId: string,
    organismeId: string,
    tags: string[]
};

export type SoireeParams = {
    from?: Date;
    to?: Date;
    isStrictTag: boolean;
    tags: string[];
}

export type EventCardProps = {
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
};