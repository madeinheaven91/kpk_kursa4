package usecases

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/client"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
)

type UC struct {
	repo client.Repo
}

func NewUC(repo client.Repo) client.UC {
	return &UC{
		repo: repo,
	}
}

func (u *UC) GetClient(ctx context.Context, id string) *models.Client {
	return u.repo.Get(ctx, id)
}

func (u *UC) GetClientFull(ctx context.Context, id string) *models.Client {
	// TODO
	// + []ClientOrder
	return u.repo.Get(ctx, id)
}

func (u *UC) GetAllClients(ctx context.Context, limit, offset int, filter client.FilterParams) []models.Client {
	return u.repo.GetAll(ctx, limit, offset, filter)
}

func (u *UC) AddClient(ctx context.Context, form *models.AddClientForm) (*models.Client, error) {
	client := form.ToClient()
	err := u.repo.Add(ctx, client)
	if err != nil {
		return nil, err
	}
	return client, nil
}

func (u *UC) DeleteClient(ctx context.Context, login string) error {
	return u.repo.Delete(ctx, login)
}

func (u *UC) UpdateClient(ctx context.Context, client *models.Client) error {
	return u.repo.Update(ctx, client)
}

func (u *UC) GetTotal(ctx context.Context, filter client.FilterParams) (int64, error) {
	return u.repo.Total(ctx, filter)
}
