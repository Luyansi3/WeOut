# Dockerfile pour pgAdmin personnalisé

FROM dpage/pgadmin4:latest

# Ajouter le script d'initialisation dans le conteneur
COPY ./pgadmin/init_pgadmin.sh /init_pgadmin.sh

# Donner les droits d'exécution au script
RUN chmod +x /init_pgadmin.sh

# Exécuter le script d'initialisation et ensuite l'entrypoint par défaut de pgAdmin
ENTRYPOINT ["/bin/bash", "-c", "/init_pgadmin.sh && /entrypoint.sh"]
