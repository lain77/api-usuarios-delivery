FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
COPY entrypoint.sh ./

RUN npm install
COPY . .

RUN npx prisma generate
RUN chmod +x entrypoint.sh

EXPOSE 9525
CMD ["./entrypoint.sh"]
