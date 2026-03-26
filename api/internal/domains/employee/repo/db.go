package repo

import (
	"context"
	"strings"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/employee"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
	"gorm.io/gorm"
)

type Repo struct {
	db *gorm.DB
}

func NewRepo(db *gorm.DB) employee.Repo {
    return Repo{db}
}

func (r Repo) GetAll(ctx context.Context, limit, offset int, filter employee.FilterParams) []models.Employee {
	base := gorm.G[models.Employee](r.db).
		Preload("Account", nil).
		Limit(limit).
		Offset(offset)
	if filter.Name != "" {
		base = base.Where("lower(name) LIKE ?", "%"+strings.ToLower(filter.Name)+"%")
	}

	res, err := base.Find(ctx)
	if err != nil {
		return nil
	}
    return res
}

func (r Repo) Get(ctx context.Context, id string) *models.Employee {
	res, err := gorm.G[models.Employee](r.db).Preload("Account", nil).Where("id = ?", id).First(ctx)
	if err != nil {
		return nil
	}
    return &res
}

func (r Repo) GetByAccount(ctx context.Context, login string) *models.Employee {
	var res models.Employee
	err := r.db.WithContext(ctx).Joins("Account").Where(`"Account".login = ?`, login).First(&res).Error
	if err != nil {
		return nil
	}
    return &res
}

func (r Repo) Add(ctx context.Context, emp *models.Employee) error {
	return gorm.G[models.Employee](r.db).Create(ctx, emp)
}

func (r Repo) Delete(ctx context.Context, id string) error {
	_, err := gorm.G[models.Employee](r.db).Where("id = ?", id).Delete(ctx)
	return err
}

func (r Repo) Update(ctx context.Context, emp *models.Employee) error {
	_, err := gorm.G[models.Employee](r.db).
		Where("id = ?", emp.ID).
        Select("account_login", "name", "phone").
		Updates(ctx, *emp)
	return err
}


func (r Repo) Total(ctx context.Context, filter employee.FilterParams) (int64, error) {
	base := gorm.G[models.Employee](r.db).Offset(0)
	if filter.Name != "" {
		base = base.Where("lower(name) LIKE ?", "%"+strings.ToLower(filter.Name)+"%")
	}
	return base.Count(ctx, "id")
}

