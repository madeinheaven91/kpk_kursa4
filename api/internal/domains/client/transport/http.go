package transport

import (
	"github.com/gin-gonic/gin"
	"github.com/madeinheaven91/anim-crm-api/internal/domains/client"
)

type Handler struct {
	usecase client.Usecase
}

func NewHandler(usecase client.Usecase) Handler {
    return Handler{
        usecase: usecase,
    }
}

func (h Handler) SetupRouter(r *gin.RouterGroup) {
	r.GET("/clients", h.GetAllClients)
	r.GET("/clients/:client_id", h.ClientView)
}

func (h Handler) GetAllClients(c *gin.Context) {
	data := h.usecase.GetAllClients(c.Request.Context())
	c.JSON(200, data)
}

func (h Handler) ClientView(c *gin.Context) {
	id := c.Param("client_id")
	data := h.usecase.GetClientFullInfo(c.Request.Context(), id)
	c.JSON(200, data)
}
