FROM node:20-alpine

RUN npm i -g @11ty/eleventy

WORKDIR /app

ENTRYPOINT ["eleventy"]