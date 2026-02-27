package account

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/models"
)

type AccountRepo interface {
	Get(ctx context.Context, login string) *models.Account
	GetAll(ctx context.Context, limit, offset int) []models.Account

	Add(ctx context.Context, account *models.Account) error
	Update(ctx context.Context, account *models.Account) error
	Delete(ctx context.Context, login string) error
}

type SessionRepo interface {
	GetByRefreshToken(ctx context.Context, refreshToken string) *models.Session
	GetAll(ctx context.Context, uid string) []models.Session

	Add(ctx context.Context, session *models.Session) error
	Update(ctx context.Context, session *models.Session) error
	DeleteByRefreshToken(ctx context.Context, refreshToken string) error
}

type AuthUsecase interface {
	Login(ctx context.Context, form models.LoginForm) (*models.Session, error)
	Logout(ctx context.Context, refreshToken string) error
	Refresh(ctx context.Context, refreshToken string) (string, string, error)

	ChangePassword(ctx context.Context, login string, form models.ChangePasswordForm) error

	GenerateAccessToken(ctx context.Context, account *models.Account) (string, error)
	ValidateAccessToken(token string) (*CustomClaims, error)
	GenerateRefreshToken(ctx context.Context, account *models.Account) (string, error)
}

type AccountUsecase interface {
	Create(ctx context.Context, form models.AddAccountForm) (*models.Account, error)
	Get(ctx context.Context, login string) *models.Account
	GetAll(ctx context.Context, limit, offset int) []models.Account
	Update(ctx context.Context, account *models.Account) error
	Delete(ctx context.Context, login string) error
} 
