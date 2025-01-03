FROM node:22-alpine AS node
WORKDIR /app

# Download the node dependencies first before adding the rest for caching
COPY ./net/web/package.json ./net/web/yarn.lock ./
RUN yarn --frozen-lockfile

COPY ./net/web/ ./
RUN yarn run build

FROM golang:alpine AS go
EXPOSE 7000
WORKDIR /app/databag

RUN apk add build-base imagemagick sqlite ffmpeg curl

RUN mkdir -p /opt/databag
RUN mkdir -p /var/lib/databag
RUN mkdir -p /app/databag/net

COPY ./net/server /app/databag/net/server
COPY ./net/transform /opt/databag/transform

WORKDIR /app/databag/net/server
RUN go mod download
RUN CGO_ENABLED=1 go build -o databag .

COPY --from=node /app/build /app/databag/net/web/build

ENV DEV=0
ENV ADMIN=password

ENTRYPOINT /app/databag/net/server/entrypoint.sh
