FROM node:20-slim
WORKDIR /app

RUN apt update && apt upgrade && apt install -y python3
RUN apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

COPY ./package.json .

RUN npm install --omit-dev

COPY . .

EXPOSE 4001
CMD node ./src/index.js