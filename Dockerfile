FROM node:14.14-alpine as build

WORKDIR /app
COPY ["./package*.json", "/app/"]
RUN npm install --silent
COPY . ./

CMD npm start
