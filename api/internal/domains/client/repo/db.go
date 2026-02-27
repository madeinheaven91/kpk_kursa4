package repo

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/client"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
	"gorm.io/gorm"
)

type UserClientRepo struct {
	db *gorm.DB
}

func NewRepo(db *gorm.DB) client.ClientRepo {
    return UserClientRepo{db}
}

func (r UserClientRepo) GetAll(ctx context.Context, limit, offset int) []models.Client {
	res, err := gorm.G[models.Client](r.db).Limit(limit).Offset(offset).Find(ctx)
	if err != nil {
		return nil
	}
    return res
}

func (r UserClientRepo) Get(ctx context.Context, id string) *models.Client {
	res, err := gorm.G[models.Client](r.db).Where("id = ?", id).First(ctx)
	if err != nil {
		return nil
	}
    return &res
}

func (r UserClientRepo) Add(ctx context.Context, client *models.Client) error {
	return gorm.G[models.Client](r.db).Create(ctx, client)
}

func (r UserClientRepo) Delete(ctx context.Context, id string) error {
	_, err := gorm.G[models.Client](r.db).Where("id = ?", id).Delete(ctx)
	return err
}

func (r UserClientRepo) Update(ctx context.Context, client *models.Client) error {
	_, err := gorm.G[models.Client](r.db).Where("id = ?", client.ID).Updates(ctx, *client)
	return err
}
