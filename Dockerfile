FROM alpine:edge

ENV LOGGER=false

COPY dist /app
WORKDIR /app

RUN apk --no-cache add nodejs npm

RUN mkdir /app/data \
    && npm install --production \
    && npm cache clean --force \
    && apk del npm

VOLUME [ "/app/data" ]
EXPOSE 3000

CMD [ "node", "./ssh-api.js" ]
