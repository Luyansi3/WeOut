// types/Event.ts
export type EventResponse = {
    id : number,
    nom: string,
    description: string,
    photoCouverturePath: string,
    debut: string,
    fin: string,
    lieuId: string,
    organismeId: string,
    tags: string[]
    dancing: number,
    talking: number,
    alcohool: number
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
  
  