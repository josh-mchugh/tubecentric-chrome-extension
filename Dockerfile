FROM node:lts-alpine

LABEL maintainer="Josh McHugh"
LABEL description="TubeCentric Browser Extension"

COPY / /
WORKDIR /

RUN node -v
RUN npm -v

RUN npm install
RUN npm install -g gulp

RUN gulp init
RUN gulp build