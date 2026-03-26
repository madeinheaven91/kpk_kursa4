package shared

import (
	"strconv"

	"github.com/gin-gonic/gin"

    "github.com/go-playground/validator/v10"
    "regexp"
)

func LimitOffsetSearch(c *gin.Context) (int, int, string) {
    var limit, offset int = -1, 0
    if c.Request.URL.Query().Has("limit") {
        limit, _ = strconv.Atoi(c.Request.URL.Query().Get("limit"))
    }
    if c.Request.URL.Query().Has("offset") {
        offset, _ = strconv.Atoi(c.Request.URL.Query().Get("offset"))
    }

	search := c.Request.URL.Query().Get("search")

    return limit, offset, search
}

var e164Regex = regexp.MustCompile(`^\+[1-9]\d{1,14}$`)
var e164RegexFront = regexp.MustCompile(`^\+7 \(\d{3}\) \d{3}-\d{4}$`)

func E164Phone(fl validator.FieldLevel) bool {
    return e164Regex.MatchString(fl.Field().String()) || e164RegexFront.MatchString(fl.Field().String())
}
