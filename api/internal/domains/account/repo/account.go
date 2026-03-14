package repo

import (
	"context"
	"strings"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/account"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
	"gorm.io/gorm"
)

type AccountRepo struct {
	db *gorm.DB
}

func NewAccountRepo(db *gorm.DB) account.AccountRepo {
    return AccountRepo{db}
}

func (r AccountRepo) Get(ctx context.Context, login string) *models.Account {
	acc, err := gorm.G[models.Account](r.db).Where("login = ?", login).First(ctx)
	if err != nil {
		return nil
	}
    return &acc
}

func (r AccountRepo) GetAll(ctx context.Context, limit, offset int, filter account.FilterParams) []models.Account {
	base := gorm.G[models.Account](r.db).Limit(limit).Offset(offset)
	if filter.Login != "" {
		base = base.Where("lower(login) LIKE ?", "%"+strings.ToLower(filter.Login)+"%")
	}

    accs, err := base.Find(ctx)
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

func (r AccountRepo) Total(ctx context.Context, filter account.FilterParams) (int64, error) {
	if filter.Login != "" {
        return gorm.G[models.Account](r.db).
			Where("lower(login) LIKE ?", "%"+strings.ToLower(filter.Login)+"%").
			Count(ctx, "login")
    }
    return gorm.G[models.Account](r.db).Count(ctx, "login")
}
