FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN yarn
COPY . /app
EXPOSE 3000
