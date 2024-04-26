FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm install react-facebook-login --save --force
RUN npm install --force

COPY . .

EXPOSE 8000

CMD ["npm","run","dev"]