package usecases

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/employee"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
)


type EmployeeUC struct {
    repo employee.EmployeeRepo
}

func NewUC(repo employee.EmployeeRepo) employee.EmployeeUC {
    return &EmployeeUC{
        repo: repo,
    }
}

func (u *EmployeeUC) GetEmployee(ctx context.Context, id string) *models.Employee {
	return u.repo.Get(ctx, id)
}

func (u *EmployeeUC) GetEmployeeFull(ctx context.Context, id string) *models.Employee {
	// TODO
	// + []EmployeeOrder
	return u.repo.Get(ctx, id)
}

func (u *EmployeeUC) GetAllEmployees(ctx context.Context, limit, offset int) []models.Employee {
	return u.repo.GetAll(ctx, limit, offset)
}

func (u *EmployeeUC) AddEmployee(ctx context.Context, form *models.AddEmployeeForm) (*models.Employee, error) {
	emp := form.ToEmployee()
	err := u.repo.Add(ctx, emp)
	if err != nil {
		return nil, err
	}
	return emp, nil
}

func (u *EmployeeUC) DeleteEmployee(ctx context.Context, login string) error {
    return u.repo.Delete(ctx, login)
}

func (u *EmployeeUC) UpdateEmployee(ctx context.Context, emp *models.Employee) error {
    return u.repo.Update(ctx, emp)
}
