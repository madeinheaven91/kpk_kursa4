package services

import (
	"time"

	"github.com/gin-gonic/gin"
)

func Throttling() gin.HandlerFunc {
    return func(c *gin.Context) {
		time.Sleep(3 * time.Second)
        c.Next()
    }
}
