package repo

import (
	"context"
	"strings"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/client"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
	"gorm.io/gorm"
)

type Repo struct {
	db *gorm.DB
}

func NewRepo(db *gorm.DB) client.Repo {
	return Repo{db}
}

func (r Repo) GetAll(ctx context.Context, limit int, offset int, filter client.FilterParams) []models.Client {
	base := gorm.G[models.Client](r.db).Offset(0)
	if filter.Name != "" {
		base = base.Where("lower(name) LIKE ?", "%"+strings.ToLower(filter.Name)+"%")
	}
	result, err := base.Limit(limit).Offset(offset).Find(ctx)
	if err != nil {
		return nil
	}
	return result
}

func (r Repo) Get(ctx context.Context, id string) *models.Client {
	res, err := gorm.G[models.Client](r.db).Where("id = ?", id).First(ctx)
	if err != nil {
		return nil
	}
	return &res
}

func (r Repo) Add(ctx context.Context, client *models.Client) error {
	return gorm.G[models.Client](r.db).Create(ctx, client)
}

func (r Repo) Delete(ctx context.Context, id string) error {
	_, err := gorm.G[models.Client](r.db).Where("id = ?", id).Delete(ctx)
	return err
}

func (r Repo) Update(ctx context.Context, client *models.Client) error {
	_, err := gorm.G[models.Client](r.db).Where("id = ?", client.ID).Updates(ctx, *client)
	return err
}

func (r Repo) Total(ctx context.Context, filter client.FilterParams) (int64, error) {
	base := gorm.G[models.Client](r.db).Offset(0)
	if filter.Name != "" {
		base = base.Where("lower(name) LIKE ?", "%"+strings.ToLower(filter.Name)+"%")
	}
	return base.Count(ctx, "id")
}
