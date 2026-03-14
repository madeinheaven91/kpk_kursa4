package usecase

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/account"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
)

type AccountUC struct {
	repo account.AccountRepo
}

func NewAccountUC(repo account.AccountRepo) account.AccountUC {
	return AccountUC{repo}
}

func (a AccountUC) GetAll(ctx context.Context, limit, offset int, filter account.FilterParams) []models.Account {
	return a.repo.GetAll(ctx, limit, offset, filter)
}

func (a AccountUC) Get(ctx context.Context, login string) *models.Account {
	return a.repo.Get(ctx, login)
}

func (a AccountUC) Create(ctx context.Context, form models.AddAccountForm) (*models.Account, error) {
	acc := form.ToAccount()
	acc.ChangePassword(form.Password)
	err := a.repo.Add(ctx, acc)
	if err != nil {
		return nil, err
	}
	return acc, nil
}

func (a AccountUC) Delete(ctx context.Context, login string) error {
	return a.repo.Delete(ctx, login)
}

func (a AccountUC) Update(ctx context.Context, account *models.Account) error {
	return a.repo.Update(ctx, account)
}

func (a AccountUC) GetTotal(ctx context.Context, filter account.FilterParams) (int64, error) {
	return a.repo.Total(ctx, filter)
}
