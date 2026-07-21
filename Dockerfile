FROM node:18-alpine

# Install FFmpeg for server-side video computation
RUN apk update && apk add --no-cache ffmpeg

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
