package employee

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/models"
)

type FilterParams struct {
	Name string
}

type Repo interface {
	Get(ctx context.Context, id string) *models.Employee
	GetAll(ctx context.Context, limit, offset int, filter FilterParams) []models.Employee
	Add(ctx context.Context, client *models.Employee) error
	Delete(ctx context.Context, id string) error
	Update(ctx context.Context, client *models.Employee) error

	Total(ctx context.Context, filter FilterParams) (int64, error)
}

type UC interface {
	GetEmployee(ctx context.Context, id string) *models.Employee
	GetEmployeeFull(ctx context.Context, id string) *models.Employee
	GetAllEmployees(ctx context.Context, limit, offset int, filter FilterParams) []models.Employee
    AddEmployee(ctx context.Context, client *models.AddEmployeeForm) (*models.Employee, error)
    UpdateEmployee(ctx context.Context, client *models.Employee) error
    DeleteEmployee(ctx context.Context, id string) error

	GetTotal(ctx context.Context, filter FilterParams) (int64, error)
}
