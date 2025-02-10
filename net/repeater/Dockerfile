FROM golang:alpine

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o repeater .
EXPOSE 7878
ENTRYPOINT ["./repeater"]
