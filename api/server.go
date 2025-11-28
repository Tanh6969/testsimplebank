package api

import (
	"fmt"
	"time" // Cần thiết cho cấu hình CORS MaxAge

	"github.com/gin-contrib/cors" // IMPORT THƯ VIỆN CORS
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	db "github.com/simplebank/db/sqlc"
	"github.com/simplebank/token"
	"github.com/simplebank/util"
)

// Server serves HTTP requests for our banking service
type Server struct {
	config     util.Config
	store      db.Store
	tokenMaker token.Maker
	router     *gin.Engine
}

// creates a new HTTP server and setup routing
func NewServer(config util.Config, store db.Store) (*Server, error) {
	tokenMaker, err := token.NewPasetoMaker(config.TokenSymmetricKey)
	if err != nil {
		return nil, fmt.Errorf("cannot create token maker: %w", err)
	}
	server := &Server{
		config:     config,
		store:      store,
		tokenMaker: tokenMaker,
	}

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("currency", validateCurrency)
	}

	server.setupRouter()
	return server, nil
}

func (server *Server) setupRouter() {

	router := gin.Default()

	// 🌟 CẤU HÌNH VÀ ÁP DỤNG MIDDLEWARE CORS
	// Giải pháp 1B: Sử dụng cấu hình Default và chỉ định Origin của Frontend
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"} // Cho phép frontend truy cập
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization", "Accept"}
	config.AllowCredentials = true
	config.MaxAge = 12 * time.Hour

	router.Use(cors.New(config))
	// Dòng này tự động xử lý request OPTIONS (trả về 200 OK) cho các route được định nghĩa bên dưới.
	// ----------------------------------------------------

	router.POST("/users", server.createUser)
	router.POST("/users/login", server.loginUser)

	authRoutes := router.Group("/").Use(authMiddleware(server.tokenMaker))
	authRoutes.POST("/accounts", server.createAccount)
	authRoutes.GET("/accounts/:id", server.getAccount)
	authRoutes.GET("/accounts", server.listAccounts)

	authRoutes.POST("/transfers", server.createTransfer)

	server.router = router
}

// Start runs the HTTP server on a specific address
func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
