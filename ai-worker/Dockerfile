FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

RUN rm -rf generated/prisma

RUN npx prisma generate

EXPOSE 3343

CMD ["npm", "run", "start:dev"]
