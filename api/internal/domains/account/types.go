package account

import "github.com/golang-jwt/jwt/v5"

type CustomClaims struct {
	Subject   string `json:"sub"`
	Role      string `json:"role"`
	ExpiresAt int64  `json:"exp"`
	IssuedAt  int64  `json:"iat"`
	jwt.RegisteredClaims
}

const (
	UnauthorizedError   = "Unauthorized"
	ForbiddenError      = "Forbidden"
	AccessExpiredError  = "Access token expired"
	RefreshExpiredError = "Refresh token expired"
	AccountNotFound = "Account not found"
)
