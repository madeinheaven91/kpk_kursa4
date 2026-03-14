package order

import (
	"context"
	"time"

	"github.com/madeinheaven91/anim-crm-api/internal/models"
)

type FilterParams struct {
	ClientID   string
	EmployeeID string
	StartMin   *time.Time
	StartMax   *time.Time
}

type Repo interface {
	Get(ctx context.Context, id string) *models.Order
	GetAll(ctx context.Context, limit, offset int, filter FilterParams) []models.Order
	Add(ctx context.Context, order *models.Order) error
	Delete(ctx context.Context, id string) error
	Update(ctx context.Context, order *models.Order) error

	GetEmployees(ctx context.Context, orderID int) []models.EmployeeRole
	AddEmployeeToOrder(ctx context.Context, orderID int, empID string, role string) error
	RemoveEmployeeFromOrder(ctx context.Context, orderID int, empID string) error

	Total(ctx context.Context, filter FilterParams) (int64, error)
}

type UC interface {
	Get(ctx context.Context, id string) *models.OrderFull
	GetAll(ctx context.Context, limit, offset int, filter FilterParams) []models.OrderFull
	Add(ctx context.Context, form models.AddOrderForm) (*models.Order, error)
	Delete(ctx context.Context, id string) error
	Update(ctx context.Context, order *models.Order) error

	AddEmployeeToOrder(ctx context.Context, order *models.Order, employee *models.EmployeeRole) error
	RemoveEmployeeFromOrder(ctx context.Context, order *models.Order, employee *models.Employee) error

	Total(ctx context.Context, filter FilterParams) (int64, error)
}
