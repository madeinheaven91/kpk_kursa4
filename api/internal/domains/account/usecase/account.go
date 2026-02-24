package usecase

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/account"
	"github.com/madeinheaven91/anim-crm-api/internal/domains/account/repo"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
)

type Account struct {
	repo repo.AccountRepo
}

func NewAccountUC(repo repo.AccountRepo) account.AccountUsecase {
	return Account{repo}
}

func (a Account) GetAll(ctx context.Context, limit, offset int) []models.Account {
    return a.repo.GetAll(ctx, limit, offset)
}

func (a Account) Get(ctx context.Context, login string) *models.Account {
    return a.repo.Get(ctx, login)
}

func (a Account) Create(ctx context.Context, form models.AddAccountForm) (*models.Account, error) {
	acc := models.Account{Login: form.Login, Role: form.Role}
	acc.ChangePassword(form.Password)
	err := a.repo.Add(ctx, &acc)
	if err != nil {
		return nil, err
	}
	return &acc, nil
}

func (a Account) Delete(ctx context.Context, login string) error {
    return a.repo.Delete(ctx, login)
}

func (a Account) Update(ctx context.Context, account *models.Account) error {
    return a.repo.Update(ctx, account)
}
