package transport

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/madeinheaven91/anim-crm-api/internal/domains/account"
	"github.com/madeinheaven91/anim-crm-api/internal/domains/order"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
	"github.com/madeinheaven91/anim-crm-api/internal/shared"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/errors"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/services"
)

type Handler struct {
	orderUC order.UC
}

func NewHandler(orderUC order.UC) *Handler {
	return &Handler{
		orderUC: orderUC,
	}
}

func (h *Handler) SetupRouter(r *gin.RouterGroup, s services.AuthService) {
	// All order routes require authentication
	auth := r.Group("")
	auth.Use(s.Authorized())

	// Basic order operations - available to all authenticated users
	// FIXME: employee.account is always null
	auth.GET("/orders", h.GetAllOrders)
	auth.GET("/orders/:id", h.GetOrder)

	// Order management - requires manager or admin
	manage := auth.Group("")
	manage.Use(s.RequireRoles("admin", "manager"))
	manage.POST("/orders", h.AddOrder)
	// manage.PUT("/orders/:id", h.UpdateOrder)
	manage.DELETE("/orders/:id", h.DeleteOrder)

	// Employee management within orders - requires manager or admin
	manage.POST("/orders/:id/employees", h.AddEmployeeToOrder)
	manage.DELETE("/orders/:id/employees/:employeeId", h.RemoveEmployeeFromOrder)
}

// GetAllOrders handles GET /orders
func (h *Handler) GetAllOrders(c *gin.Context) {
	limit, offset, _ := shared.LimitOffsetSearch(c)

	// Parse filter params
	filter := order.FilterParams{}
	filter.ClientID = c.Query("client_id")
	startMin := c.Query("start_min")
	if sm, err := time.Parse("02.01.2006", startMin); err == nil {
		filter.StartMin = &sm
	}
	startMax := c.Query("start_max")
	if sm, err := time.Parse("02.01.2006", startMax); err == nil {
		filter.StartMax = &sm
	}

	orders := h.orderUC.GetAll(c.Request.Context(), limit, offset, filter)
	total, err := h.orderUC.Total(c.Request.Context(), filter)
	if err != nil {
		c.AbortWithStatusJSON(500, err.Error())
		return
	}

	c.JSON(200, gin.H{"orders": orders, "total": total})
}

// GetOrder handles GET /orders/:id
func (h *Handler) GetOrder(c *gin.Context) {
	id := c.Param("id")

	order := h.orderUC.Get(c.Request.Context(), id)
	if order == nil {
		c.AbortWithStatusJSON(404, errors.NewError("order not found"))
		return
	}

	// Check if user has permission to view this order
	// You might want additional logic here (e.g., employees can only see orders they're assigned to)
	claims, exists := c.Get("claims")
	if exists {
		userClaims := claims.(*account.CustomClaims)
		// Add custom permission checks here if needed
		_ = userClaims
	}

	c.JSON(200, order)
}

// AddOrder handles POST /orders
func (h *Handler) AddOrder(c *gin.Context) {
	// Bind JSON
	var form models.AddOrderForm
	if err := c.ShouldBindJSON(&form); err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	// Create order
	order, err := h.orderUC.Add(c.Request.Context(), form)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, order)
}

// UpdateOrder handles PUT /orders/:id
// func (h *OrderHandler) UpdateOrder(c *gin.Context) {
// 	id := c.Param("id")
// 	claims := c.MustGet("claims").(*account.CustomClaims)
//
// 	// Check if order exists
// 	existingOrder := h.orderUC.Get(c.Request.Context(), id)
// 	if existingOrder == nil {
// 		c.AbortWithStatusJSON(404, errors.NewError("order not found"))
// 		return
// 	}
//
// 	// Bind JSON
// 	var order models.UpdateOrder
// 	if err := c.ShouldBindJSON(&order); err != nil {
// 		c.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
// 		return
// 	}
//
// 	// Only admin can update orders (or add more specific rules)
// 	if claims.Role != "admin" {
// 		c.AbortWithStatusJSON(403, errors.NewError("forbidden"))
// 		return
// 	}
//
// 	// Update order
// 	err := h.orderUC.Update(c.Request.Context(), &order)
// 	if err != nil {
// 		c.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
// 		return
// 	}
//
// 	c.Status(204)
// }

// DeleteOrder handles DELETE /orders/:id
func (h *Handler) DeleteOrder(c *gin.Context) {
	id := c.Param("id")

	// Check if order exists
	existingOrder := h.orderUC.Get(c.Request.Context(), id)
	if existingOrder == nil {
		c.AbortWithStatusJSON(404, errors.NewError("order not found"))
		return
	}

	// Delete order
	err := h.orderUC.Delete(c.Request.Context(), id)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	c.Status(204)
}

// AddEmployeeToOrder handles POST /orders/:id/employees
func (h *Handler) AddEmployeeToOrder(c *gin.Context) {
	orderID := c.Param("id")

	// Check if order exists
	existingOrder := h.orderUC.Get(c.Request.Context(), orderID)
	if existingOrder == nil {
		c.AbortWithStatusJSON(404, errors.NewError("order not found"))
		return
	}

	// Bind JSON
	var empRole models.EmployeeRole
	if err := c.ShouldBindJSON(&empRole); err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	// Convert OrderFull to Order model (you might need to adjust this)
	order := &models.Order{
		ID:       existingOrder.ID,
		Client:   existingOrder.Client,
		Datetime: existingOrder.Datetime,
		Duration: existingOrder.Duration,
		Address:  existingOrder.Address,
	}

	// Add employee to order
	err := h.orderUC.AddEmployeeToOrder(c.Request.Context(), order, &empRole)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	c.Status(201)
}

// RemoveEmployeeFromOrder handles DELETE /orders/:id/employees/:employeeId
func (h *Handler) RemoveEmployeeFromOrder(c *gin.Context) {
	orderID := c.Param("id")
	employeeID := c.Param("employeeId")

	// Check if order exists
	existingOrder := h.orderUC.Get(c.Request.Context(), orderID)
	if existingOrder == nil {
		c.AbortWithStatusJSON(404, errors.NewError("order not found"))
		return
	}

	// Check if employee is assigned to order
	employeeFound := false
	for _, emp := range existingOrder.Employees {
		if emp.ID == employeeID {
			employeeFound = true
			break
		}
	}

	if !employeeFound {
		c.AbortWithStatusJSON(404, errors.NewError("employee not found in this order"))
		return
	}

	// Convert OrderFull to Order model
	order := &models.Order{
		ID:       existingOrder.ID,
		Client:   existingOrder.Client,
		Datetime: existingOrder.Datetime,
		Duration: existingOrder.Duration,
		Address:  existingOrder.Address,
	}

	employee := &models.Employee{
		ID: employeeID,
	}

	// Remove employee from order
	err := h.orderUC.RemoveEmployeeFromOrder(c.Request.Context(), order, employee)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	c.Status(204)
}
