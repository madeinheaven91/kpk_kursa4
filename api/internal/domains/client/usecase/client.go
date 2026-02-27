package usecases

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/client"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
)


type ClientUC struct {
    repo client.ClientRepo
}

func NewUC(repo client.ClientRepo) client.Usecase {
    return &ClientUC{
        repo: repo,
    }
}

func (u *ClientUC) GetClient(ctx context.Context, id string) *models.Client {
	return u.repo.Get(ctx, id)
}

func (u *ClientUC) GetClientFull(ctx context.Context, id string) *models.Client {
	// TODO
	// + []ClientOrder
	return u.repo.Get(ctx, id)
}

func (u *ClientUC) GetAllClients(ctx context.Context, limit, offset int) []models.Client {
	return u.repo.GetAll(ctx, limit, offset)
}

func (u *ClientUC) AddClient(ctx context.Context, form *models.AddClientForm) (*models.Client, error) {
	client := form.ToClient()
	err := u.repo.Add(ctx, client)
	if err != nil {
		return nil, err
	}
	return client, nil
}

func (u *ClientUC) DeleteClient(ctx context.Context, login string) error {
    return u.repo.Delete(ctx, login)
}

func (u *ClientUC) UpdateClient(ctx context.Context, client *models.Client) error {
    return u.repo.Update(ctx, client)
}
