package main

import (
	"database/sql"
	"log"

	"github.com/simplebank/util"
	//"github.com/go-delve/delve/pkg/config"
	_ "github.com/lib/pq"
	"github.com/simplebank/api"
	db "github.com/simplebank/db/sqlc"
	
)

func main() {
	config, err := util.LoadConfig(".")
	if err != nil {
		log.Fatal("cannot load config:", err)
	}
	// Application entry point
	conn, err := sql.Open(config.DBDriver, config.DBSource)
	if err != nil {
		log.Fatal("cannot connect to db:", err)
	}
	store := db.NewStore(conn)
	server, err := api.NewServer(config, store)
	if err != nil {
		log.Fatal("cannot create server", err)
	}

	err = server.Start(config.ServerAddress)
	if err != nil {
		log.Fatal("cannot start server:", err)
	}
}
