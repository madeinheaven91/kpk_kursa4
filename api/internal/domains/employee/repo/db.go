package repo

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/employee"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
	"gorm.io/gorm"
)

type UserEmployeeRepo struct {
	db *gorm.DB
}

func NewRepo(db *gorm.DB) employee.EmployeeRepo {
    return UserEmployeeRepo{db}
}

func (r UserEmployeeRepo) GetAll(ctx context.Context, limit, offset int) []models.Employee {
	res, err := gorm.G[models.Employee](r.db).Preload("Account", nil).Limit(limit).Offset(offset).Find(ctx)
	if err != nil {
		return nil
	}
    return res
}

func (r UserEmployeeRepo) Get(ctx context.Context, id string) *models.Employee {
	res, err := gorm.G[models.Employee](r.db).Preload("Account", nil).Where("id = ?", id).First(ctx)
	if err != nil {
		return nil
	}
    return &res
}

func (r UserEmployeeRepo) Add(ctx context.Context, emp *models.Employee) error {
	return gorm.G[models.Employee](r.db).Create(ctx, emp)
}

func (r UserEmployeeRepo) Delete(ctx context.Context, id string) error {
	_, err := gorm.G[models.Employee](r.db).Where("id = ?", id).Delete(ctx)
	return err
}

func (r UserEmployeeRepo) Update(ctx context.Context, emp *models.Employee) error {
	_, err := gorm.G[models.Employee](r.db).Where("id = ?", emp.ID).Updates(ctx, *emp)
	return err
}
