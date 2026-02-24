package transport

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/madeinheaven91/anim-crm-api/internal/domains/account"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/errors"
)

func (h Handler) AuthMW(c *gin.Context) {
	// Get authorization header
	header := c.GetHeader("Authorization")
	if header == "" {
		c.AbortWithStatusJSON(401, errors.NewError(account.UnauthorizedError))
		return
	}

	// Get access token
	words := strings.Split(header, " ")
	if len(words) != 2 || words[0] != "Bearer" {
		c.AbortWithStatusJSON(401, errors.NewError(account.UnauthorizedError))
		return
	}
	tokenString := words[1]

	// Check if claims are valid
	claims, err := h.authUC.ValidateAccessToken(tokenString)
	if err != nil {
		c.AbortWithStatusJSON(401, errors.NewError(account.UnauthorizedError))
		return
	}

	// FIXME: don't know if it is needed
	// if claims.ExpiresAt < time.Now().Unix() {
	//        c.AbortWithStatusJSON(401, errors.NewError(account.AccessExpiredError))
	//        return
	//    }

	c.Set("claims", claims)

	c.Next()
}

func (h Handler) CheckRoleMW(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		cl, exists := c.Get("claims")
		if !exists {
			c.AbortWithStatusJSON(401, errors.NewError(account.UnauthorizedError))
			return
		}

		claims := cl.(*account.CustomClaims)

		// bad code but whatever
		if claims.Role == "employee" {
			c.AbortWithStatusJSON(403, errors.NewError(account.ForbiddenError))
			return
		}

		c.Next()
	}
}
