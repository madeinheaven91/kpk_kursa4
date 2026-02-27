package transport

import (
	"github.com/gin-gonic/gin"
	"github.com/madeinheaven91/anim-crm-api/internal/domains/account"
	employee "github.com/madeinheaven91/anim-crm-api/internal/domains/employee"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
	"github.com/madeinheaven91/anim-crm-api/internal/shared"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/errors"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/services"
)

type Handler struct {
	empUC employee.EmployeeUC
}

func NewEmployeeHandler(empUC employee.EmployeeUC) Handler {
	return Handler{
		empUC: empUC,
	}
}

func (h Handler) SetupRouter(r *gin.RouterGroup, authService services.AuthService) {
	// All employee routes require authentication
	auth := r.Group("")
	auth.Use(authService.Authorized())

	// Employee and above can access these
	auth.GET("/employees", h.GetAllEmployees)
	auth.GET("/employees/:id", h.GetEmployeeFull)
	auth.GET("/employees/:id/short", h.GetEmployee)
	
	// Manager and admin only operations
	prot := auth.Group("")
	prot.Use(authService.RequireRoles("manager", "admin"))
	prot.POST("/employees", h.AddEmployee)
	prot.PUT("/employees/:id", h.UpdateEmployee)
	prot.DELETE("/employees/:id", h.DeleteEmployee)
}

func (h Handler) GetAllEmployees(c *gin.Context) {
	limit, offset := shared.LimitOffset(c)

	employees := h.empUC.GetAllEmployees(c.Request.Context(), limit, offset)
	
	c.JSON(200, employees)
}

func (h Handler) GetEmployeeFull(c *gin.Context) {
	id := c.Param("id")
	
	employee := h.empUC.GetEmployeeFull(c.Request.Context(), id)
	if employee == nil {
		c.AbortWithStatusJSON(404, errors.NewError("employee not found"))
		return
	}
	
	c.JSON(200, employee)
}

func (h Handler) GetEmployee(c *gin.Context) {
	id := c.Param("id")
	
	employee := h.empUC.GetEmployee(c.Request.Context(), id)
	if employee == nil {
		c.AbortWithStatusJSON(404, errors.NewError("employee not found"))
		return
	}
	
	c.JSON(200, employee)
}

func (h Handler) AddEmployee(c *gin.Context) {
	// Bind json
	var form models.AddEmployeeForm
	if err := c.ShouldBindJSON(&form); err != nil {
		c.AbortWithStatusJSON(400, err.Error())
		return
	}
	
	// Create employee
	employee, err := h.empUC.AddEmployee(c.Request.Context(), &form)
	if err != nil {
		c.AbortWithStatusJSON(400, err.Error())
		return
	}
	
	c.JSON(201, employee)
}

func (h Handler) UpdateEmployee(c *gin.Context) {
	id := c.Param("id")

	// Check if employee exists
	existingEmployee := h.empUC.GetEmployee(c.Request.Context(), id)
	if existingEmployee == nil {
		c.AbortWithStatusJSON(404, errors.NewError("employee not found"))
		return
	}

	// Bind json
	var form models.UpdateEmployeeForm
	if err := c.ShouldBindJSON(&form); err != nil {
		c.AbortWithStatusJSON(400, err.Error())
		return
	}
	
	existingEmployee.Update(form)
	
	// Update employee
	err := h.empUC.UpdateEmployee(c.Request.Context(), existingEmployee)
	if err != nil {
		c.AbortWithStatusJSON(400, err.Error())
		return
	}
	
	c.Status(204)
}

func (h Handler) DeleteEmployee(c *gin.Context) {
	id := c.Param("id")
	
	// Check if employee exists
	employee := h.empUC.GetEmployee(c.Request.Context(), id)
	if employee == nil {
		c.AbortWithStatusJSON(404, errors.NewError("employee not found"))
		return
	}
	
	// Delete employee
	err := h.empUC.DeleteEmployee(c.Request.Context(), id)
	if err != nil {
		c.AbortWithStatusJSON(400, err.Error())
		return
	}
	
	c.Status(204)
}
