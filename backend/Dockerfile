FROM node:18

WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le dossier Prisma
COPY prisma ./prisma
RUN npx prisma generate


# Copier le script de démarrage après tout pour éviter d'écraser
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Copier tous les autres fichiers du projet
COPY . .

EXPOSE 3000

# Exécution du script de démarrage
CMD ["/bin/bash", "./start.sh"]
