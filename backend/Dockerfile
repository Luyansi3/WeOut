FROM node:18

WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
# Normalement elles sont toutes installées 
COPY package*.json ./
RUN npm install


# Copier tous les autres fichiers du projet
COPY . .

# Copier le dossier Prisma
# génère le client pour interroger prisma avec node.js
COPY prisma ./prisma
RUN npx prisma generate


# on expose le port 3000
EXPOSE ${NODE_PORT}

#Run the dev version
# CMD ["npm", "run", "dev"] 
CMD /bin/sh start.sh