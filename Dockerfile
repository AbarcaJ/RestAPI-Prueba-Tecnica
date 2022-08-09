FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY ["package*.json", "./"]

#RUN npm install
RUN npm ci --only=production
# En Produccion utilizar -->  RUN npm ci --only=production

COPY . .
# Puertos a Exponer
EXPOSE 8080
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
