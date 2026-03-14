package usecases

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/employee"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
)


type UC struct {
    repo employee.Repo
}

func NewUC(repo employee.Repo) employee.UC {
    return &UC{
        repo: repo,
    }
}

func (u *UC) GetEmployee(ctx context.Context, id string) *models.Employee {
	return u.repo.Get(ctx, id)
}

func (u *UC) GetEmployeeFull(ctx context.Context, id string) *models.Employee {
	// TODO
	// + []EmployeeOrder
	return u.repo.Get(ctx, id)
}

func (u *UC) GetAllEmployees(ctx context.Context, limit, offset int, filter employee.FilterParams) []models.Employee {
	return u.repo.GetAll(ctx, limit, offset, filter)
}

func (u *UC) AddEmployee(ctx context.Context, form *models.AddEmployeeForm) (*models.Employee, error) {
	emp := form.ToEmployee()
	err := u.repo.Add(ctx, emp)
	if err != nil {
		return nil, err
	}
	return emp, nil
}

func (u *UC) DeleteEmployee(ctx context.Context, login string) error {
    return u.repo.Delete(ctx, login)
}

func (u *UC) UpdateEmployee(ctx context.Context, emp *models.Employee) error {
    return u.repo.Update(ctx, emp)
}

func (u *UC) GetTotal(ctx context.Context, filter employee.FilterParams) (int64, error) { 
	return u.repo.Total(ctx, filter)
}
