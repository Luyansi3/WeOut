import { Tag, TypeLieux } from "@prisma/client";
import {
    generateRandomString,
    createUser,
    makeUsersFriends,
    sendRequest,
    createMultipleUsersRandomly,
    createLieu,
    createOrganisme,
    createEvent,
    createEventWithLieuAndOrganisme,
} from "./seed"
 
const userData = {
    hashedMdp: 'hashedPassword123',
    nom: 'Doe',
    prenom: 'John',
    email: 'bCg6f@example.com',
};
 
const lieuData = {
    nom: 'Le Club Paris',
    type: 'BAR',
    note: 4.2,
    adresse: '12 Rue de Paris, 75001 Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    tags: ['ELECTRO', 'HOUSE'],
};
 
const organismeData = {
    nom: 'Techno Nights',
    compteId: '1234567890abcdef', // Replace with a valid compteId
    note: 4.5,
    tags: ['TECHNO', 'COMMERCIAL'],
};
 
 
 
const eventData = {
  nomEvent: 'Techno Party',
  descriptionEvent: 'The best techno party in town!',
  photoCouverturePath: 'image.jpg',
  debut: new Date('2025-06-01T20:00:00'),
  fin: new Date('2025-06-01T23:59:59'),
  compteData: {
    hashedMdp: 'hashedPassword123',
    email: 'user@example.com',
  },
  lieuData: {
    nom: 'Night Club',
    type: TypeLieux.BAR,  // Enum TypeLieux
    adresse: '123 Party St, Berlin',
    note: 4.5,
    longitude: 13.4050,
    latitude: 52.5200,
    tags: [Tag.ELECTRO, Tag.HOUSE],  // Array of Tag objects
  },
  organismeData: {
    nom: 'Party Organizers Inc.',
    note: 4.7,
    tags: [Tag.ELECTRO, Tag.HOUSE],
  },
  tagList: [Tag.ELECTRO, Tag.HOUSE],
};
 
createEventWithLieuAndOrganisme(eventData)
  .then(event => {
    console.log('Event successfully created:', event);
  })
  .catch(error => {
    console.error('Error creating event:', error);
  });