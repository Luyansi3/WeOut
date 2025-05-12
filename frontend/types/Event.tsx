import { ImageSourcePropType } from "react-native";

export type EventResponse = {
    nom: string,
    description: string,
    photoCouverturePath: string,
    debut: string,
    fin: string,
    lieuId: string,
    organismeId: string,
    tags: string[]
};

export type AllEventParams = {
    active?: boolean;
}

export type EventCardProps = {
    key: number;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
};