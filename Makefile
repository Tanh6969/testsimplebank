migrateup:
	migrate -path db/migration -database "postgresql://root:Megake123@localhost:5432/simple_bank?sslmode=disable" -verbose up

migratedown:
	migrate -path db/migration -database "postgresql://root:Megake123@localhost:5432/simple_bank?sslmode=disable" -verbose down

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

.PHONY: postgres created dropdb migrateup migratedown sqlc test server mock