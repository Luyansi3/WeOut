import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WeOut API',
      version: '1.0.0',
      description: 'Documentation Swagger générée à partir des commentaires @openapi',
    },
    components: {
      schemas: {
        Soiree: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nom: { type: 'string' },
            description: { type: 'string' },
            photoCouverturePath: { type: 'string' },
            debut: { type: 'string', format: 'date-time' },
            fin: { type: 'string', format: 'date-time' },
            lieuId: { type: 'string' },
            organismeId: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' }, nullable:true },
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nom: { type: 'string' },
            prenom: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            description: { type: 'string', nullable: true },
            photoProfilPath: { type: 'string', nullable: true }
          }
        },
        Commentaire: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            contenu: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            soireeId: { type: 'integer' },
            createurId: { type: 'string' }
          }
        },
        Compte: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nom: { type: 'string' },
            organisme: { type: 'string', nullable: true },
            userId: { type: 'string' }
          }
        },
        Organisme: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nom: { type: 'string' }
          }
        },
        Photo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            url: { type: 'string' },
            soireeId: { type: 'integer' }
          }
        },
        Lieu: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nom: { type: 'string' },
            adresse: { type: 'string' },
            latitude: { type: 'float' },
            longitude: { type: 'float' }
          }
        },
        Groupe: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nom: { type: 'string' },
            createurId: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'], // adapte si tes routes sont ailleurs
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Application) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
