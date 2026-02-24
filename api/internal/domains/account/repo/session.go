package repo

import (
	"context"
	"time"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/account"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
	"gorm.io/gorm"
)

type SessionRepo struct {
	db *gorm.DB
}

func NewSessionRepo(db *gorm.DB) account.SessionRepo {
    return SessionRepo{db}
}

func (r SessionRepo) GetByID(ctx context.Context, id int) *models.Session {
	acc, err := gorm.G[models.Session](r.db).Preload("Account", nil).Where("id = ?", id).First(ctx)
	if err != nil {
		return nil
	}
    return &acc
}

func (r SessionRepo) GetByRefreshToken(ctx context.Context, token string) *models.Session {
	acc, err := gorm.G[models.Session](r.db).Preload("Account", nil).Where("refresh_token = ?", token).First(ctx)
	if err != nil {
		return nil
	}
    return &acc
}

func (r SessionRepo) GetAll(ctx context.Context, uid string) []models.Session {
    res, err := gorm.G[models.Session](r.db).Where("account_login = ?", uid).Find(ctx)
    if err != nil {
        return nil
    }
    return res
}

func (r SessionRepo) Add(ctx context.Context, session *models.Session) error {
    return gorm.G[models.Session](r.db).Create(ctx, session)
}

func (r SessionRepo) Update(ctx context.Context, session *models.Session) error {
	_, err := gorm.G[models.Session](r.db).Where("id = ?", session.ID).Updates(ctx, models.Session{
        RefreshToken: session.RefreshToken,
        Expires_At: time.Now().Add(time.Hour * 24 * 7),
	})
	return err
}

func (r SessionRepo) DeleteByID(ctx context.Context, id int) error {
	_, err := gorm.G[models.Session](r.db).Where("id = ?", id).Delete(ctx)
	return err
}

func (r SessionRepo) DeleteByRefreshToken(ctx context.Context, token string) error {
	_, err := gorm.G[models.Session](r.db).Where("refresh_token = ?", token).Delete(ctx)
	return err
}
