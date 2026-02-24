package repo

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/models"
	"gorm.io/gorm"
)

type UserClientRepo struct {
	db *gorm.DB
}

func NewRepo(db *gorm.DB) UserClientRepo {
    return UserClientRepo{db}
}

func (r UserClientRepo) GetAllClients(ctx context.Context) []models.Client {
	res, err := gorm.G[models.Client](r.db).Find(ctx)
	if err != nil {
		return nil
	}
    return res
}

func (r UserClientRepo) GetClient(ctx context.Context, id string) *models.Client {
	res, err := gorm.G[models.Client](r.db).Where("id = ?", id).First(ctx)
	if err != nil {
		return nil
	}
    return &res
}


func (r UserClientRepo) AddClient(ctx context.Context, client *models.Client) error {
	return gorm.G[models.Client](r.db).Create(ctx, client)
}

func (r UserClientRepo) DeleteClient(ctx context.Context, id string) error {
	_, err := gorm.G[models.Client](r.db).Where("id = ?", id).Delete(ctx)
	return err
}

func (r UserClientRepo) UpdateClient(ctx context.Context, client *models.Client) *models.Client {
	err := r.db.Save(&client)
    if err != nil {
        return nil
    }
    return client
}
