#build stage
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o main main.go


#run stage
FROM alpine
WORKDIR /app
COPY --from=builder /app/main .
EXPOSE 8080
CMD [ "/app/main" ]