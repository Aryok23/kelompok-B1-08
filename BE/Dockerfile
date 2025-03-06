FROM golang:1.24-alpine as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o InfoLoker-BE main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/InfoLoker-BE .

EXPOSE 8080

CMD ["./InfoLoker-BE"]