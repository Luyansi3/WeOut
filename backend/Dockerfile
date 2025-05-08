FROM node:18

WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
# Normalement elles sont toutes installées 
COPY package*.json .
RUN npm install


# Copier tous les autres fichiers du projet
COPY . .

# Copier le dossier Prisma
# génère le client pour interroger prisma avec node.js
COPY prisma ./prisma
RUN npx prisma generate

#Compile les fichiers TS 
RUN npm run build

#Fait la migration initiale de la base pg (construit la base)
# RUN npx prisma migrate dev --name init

#Ouvre le port 5553 pour observer la bd
# RUN npx prisma studio -p 5553 &

# on expose le port 3000
EXPOSE ${NODE_PORT}

#Run the dev version
# CMD ["npm", "run", "dev"] 
CMD npx prisma migrate dev --name init && npx prisma studio -p 5553 & npm run dev