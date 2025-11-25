package token

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

var (
	ErrInvalidToken = errors.New("token is invalid")
	ErrExpiredToken = errors.New("token has expired")
)

// Payload is the JWT payload
type Payload struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"username"`
	//IssuedAt  time.Time `json:"issued_at"`  // Issued at time
	//ExpiredAt time.Time `json:"expired_at"` // Expiration time

	jwt.RegisteredClaims
}

// NewPayload creates a new JWT payload
func NewPayload(username string, duration time.Duration) (*Payload, error) {
	tokenID, err := uuid.NewRandom()
	if err != nil {
		return nil, err
	}

	now := time.Now()
	return &Payload{
		ID:       tokenID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(duration)),
		},
	}, nil
}
