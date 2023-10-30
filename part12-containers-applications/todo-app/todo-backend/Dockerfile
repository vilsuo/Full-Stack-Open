FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

USER node

RUN npm ci --only=production
CMD npm run start
