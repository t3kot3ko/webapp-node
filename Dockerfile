FROM node:12.18.1
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
COPY ["*.js", "public/", "routes/", "views/", "./"]

EXPOSE 3000

RUN npm install --production

COPY . .

CMD [ "npm", "start" ]
