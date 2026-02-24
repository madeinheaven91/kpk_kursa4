package shared

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

func LimitOffset(c *gin.Context) (int, int) {
    var limit, offset int = 10, 0
    if c.Request.URL.Query().Has("limit") {
        limit, _ = strconv.Atoi(c.Request.URL.Query().Get("limit"))
    }
    if c.Request.URL.Query().Has("offset") {
        offset, _ = strconv.Atoi(c.Request.URL.Query().Get("offset"))
    }
    return limit, offset
}
