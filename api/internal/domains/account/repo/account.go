package repo

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/models"
	"gorm.io/gorm"
)

type AccountRepo struct {
	db *gorm.DB
}

func NewAccountRepo(db *gorm.DB) AccountRepo {
    return AccountRepo{db}
}

func (r AccountRepo) Get(ctx context.Context, login string) *models.Account {
	acc, err := gorm.G[models.Account](r.db).Where("login = ?", login).First(ctx)
	if err != nil {
		return nil
	}
    return &acc
}

func (r AccountRepo) GetAll(ctx context.Context, limit, offset int) []models.Account {
    accs, err := gorm.G[models.Account](r.db).Limit(limit).Offset(offset).Find(ctx)
    if err != nil {
        return nil
    }
    return accs
}

func (r AccountRepo) Add(ctx context.Context, account *models.Account) error {
    return gorm.G[models.Account](r.db).Create(ctx, account)
}

func (r AccountRepo) Update(ctx context.Context, account *models.Account) error {
	_, err := gorm.G[models.Account](r.db).Where("login = ?", account.Login).Updates(ctx, *account)
	return err
}

func (r AccountRepo) Delete(ctx context.Context, login string) error {
	_, err := gorm.G[models.Account](r.db).Where("login = ?", login).Delete(ctx)
	return err
}
