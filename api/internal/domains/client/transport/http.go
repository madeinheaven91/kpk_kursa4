package transport

import (
	"github.com/gin-gonic/gin"
	"github.com/madeinheaven91/anim-crm-api/internal/domains/client"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
	"github.com/madeinheaven91/anim-crm-api/internal/shared"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/errors"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/services"
)

type ClientHandler struct {
	clientUC client.Usecase
}

func NewClientHandler(clientUC client.Usecase) ClientHandler {
	return ClientHandler{
		clientUC: clientUC,
	}
}

func (h ClientHandler) SetupRouter(r *gin.RouterGroup, authService services.AuthService) {
	// All client routes require authentication
	auth := r.Group("")
	auth.Use(authService.Authorized())

	// Employee and above can access these
	auth.GET("/clients", h.GetAllClients)
	auth.GET("/clients/:id", h.GetClientFull)
	auth.GET("/clients/:id/short", h.GetClient)

	// Manager and admin only operations
	prot := auth.Group("")
	prot.Use(authService.RequireRoles("manager", "admin"))
	prot.POST("/clients", h.AddClient)
	prot.PUT("/clients/:id", h.UpdateClient)
	prot.DELETE("/clients/:id", h.DeleteClient)
}

func (h ClientHandler) GetAllClients(c *gin.Context) {
	limit, offset := shared.LimitOffset(c)

	clients := h.clientUC.GetAllClients(c.Request.Context(), limit, offset)

	c.JSON(200, clients)
}

func (h ClientHandler) GetClientFull(c *gin.Context) {
	id := c.Param("id")

	client := h.clientUC.GetClientFull(c.Request.Context(), id)
	if client == nil {
		c.AbortWithStatusJSON(404, errors.NewError("client not found"))
		return
	}

	c.JSON(200, client)
}

func (h ClientHandler) GetClient(c *gin.Context) {
	id := c.Param("id")

	client := h.clientUC.GetClient(c.Request.Context(), id)
	if client == nil {
		c.AbortWithStatusJSON(404, errors.NewError("client not found"))
		return
	}

	c.JSON(200, client)
}

func (h ClientHandler) AddClient(c *gin.Context) {
	// Bind json
	var form models.AddClientForm
	if err := c.ShouldBindJSON(&form); err != nil {
		c.AbortWithStatusJSON(400, err.Error())
		return
	}

	// Create client
	client, err := h.clientUC.AddClient(c.Request.Context(), &form)
	if err != nil {
		c.AbortWithStatusJSON(400, err.Error())
		return
	}

	c.JSON(201, client)
}

func (h ClientHandler) UpdateClient(c *gin.Context) {
	id := c.Param("id")

	// Check if client exists
	existingClient := h.clientUC.GetClient(c.Request.Context(), id)
	if existingClient == nil {
		c.AbortWithStatusJSON(404, errors.NewError("client not found"))
		return
	}

	// Bind json
	var form models.UpdateClientForm
	if err := c.ShouldBindJSON(&form); err != nil {
		c.AbortWithStatusJSON(400, err.Error())
		return
	}

	existingClient.Update(form)

	// Update client
	err := h.clientUC.UpdateClient(c.Request.Context(), existingClient)
	if err != nil {
		c.AbortWithStatusJSON(400, err.Error())
		return
	}

	c.Status(204)
}

func (h ClientHandler) DeleteClient(c *gin.Context) {
	id := c.Param("id")

	// Check if client exists
	client := h.clientUC.GetClient(c.Request.Context(), id)
	if client == nil {
		c.AbortWithStatusJSON(404, errors.NewError("client not found"))
		return
	}

	// Delete client
	err := h.clientUC.DeleteClient(c.Request.Context(), id)
	if err != nil {
		c.AbortWithStatusJSON(400, err.Error())
		return
	}

	c.Status(204)
}
