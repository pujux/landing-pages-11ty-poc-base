FROM nginx:alpine

ARG FOLDER
ENV FOLDER=${FOLDER:-NOT_DEFINED}

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY ./${FOLDER} /usr/share/nginx/html
COPY ./healthcheck.html /usr/share/nginx/html/api/health/index.html

## Copy our default nginx config
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 6789

CMD ["nginx", "-g", "daemon off;"]
