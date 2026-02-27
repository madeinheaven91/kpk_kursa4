package services

import (
	"slices"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/madeinheaven91/anim-crm-api/internal/domains/account"
)

type AuthService struct {
	jwtSecret string
}

func NewService(jwtSecret string) AuthService {
	return AuthService{
		jwtSecret: jwtSecret,
	}
}

func (s *AuthService) ValidateToken(tokenString string) (*account.CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &account.CustomClaims{}, func(token *jwt.Token) (any, error) {
		return []byte(s.jwtSecret), nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	claims, ok := token.Claims.(*account.CustomClaims)
	if !ok {
		return nil, jwt.ErrInvalidKeyType
	}

	return claims, nil
}

func (s *AuthService) Authorized() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(401, gin.H{"error": "no authorization header"})
			return
		}

		// Extract Bearer token
		const bearerPrefix = "Bearer "
		if len(authHeader) <= len(bearerPrefix) || authHeader[:len(bearerPrefix)] != bearerPrefix {
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid authorization header format"})
			return
		}
		tokenString := authHeader[len(bearerPrefix):]

		// Validate token
		claims, err := s.ValidateToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
			return
		}

		// Set claims in context
		c.Set("claims", claims)
		c.Next()
	}
}

func (s *AuthService) RequireRoles(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, exists := c.Get("claims")
		if !exists {
			c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})
			return
		}

		userClaims := claims.(*account.CustomClaims)
		if !slices.Contains(allowedRoles, userClaims.Role) {
			c.AbortWithStatusJSON(403, gin.H{"error": "forbidden"})
			return
		}

		c.Next()
	}
}
