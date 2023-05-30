FROM alpine

RUN apk add --no-cache nodejs npm

COPY . /app

WORKDIR /app

RUN npm i

CMD ["node", "index.js"]
