FROM golang:1.25.7-bookworm

ENV GOPROXY=direct

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

WORKDIR /app/cmd/api
RUN CGO_ENABLED=0 GOOS=linux go build -o main

EXPOSE 3000
WORKDIR /app
CMD ["./cmd/api/main"]
