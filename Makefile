migrateup:
	migrate -path db/migration -database "postgresql://root:Megake123@localhost:5432/simple_bank?sslmode=disable" -verbose up

migrateup1:
	migrate -path db/migration -database "postgresql://root:Megake123@localhost:5432/simple_bank?sslmode=disable" -verbose up 1

migratedown:
	migrate -path db/migration -database "postgresql://root:Megake123@localhost:5432/simple_bank?sslmode=disable" -verbose down

migratedown1:
	migrate -path db/migration -database "postgresql://root:Megake123@localhost:5432/simple_bank?sslmode=disable" -verbose down 1

postgres:
	docker run --name postgres12 -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=Megake123 -d postgres:12-alpine

createdb:
	docker exec -it postgres12 createdb --username=root --owner=root simple_bank

dropdb: 
	docker exec -it postgres12 dropdb simple_bank

sqlc:
	sqlc generate
test:
	go test -v -cover ./...

server:
	go run main.go

mock:
	mockgen -package mockdb -destination db/mock/store.go github.com/simplebank/db/sqlc Store

.PHONY: postgres created dropdb migrateup migratedown migrateup1 migratedown1 sqlc test server mock