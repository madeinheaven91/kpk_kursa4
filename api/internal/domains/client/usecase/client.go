package usecases

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/client"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
)


type ClientUsecaseImpl struct {
    repo client.ClientRepo
}

func NewUsecase(repo client.ClientRepo) client.Usecase {
    return &ClientUsecaseImpl{
        repo: repo,
    }
}

func (u *ClientUsecaseImpl) GetClientShortInfo(ctx context.Context, id string) *models.Client {
	return u.repo.GetClient(ctx, id)
}

func (u *ClientUsecaseImpl) GetClientFullInfo(ctx context.Context, id string) *models.Client {
	// + []ClientOrder
	return u.repo.GetClient(ctx, id)
}

func (u *ClientUsecaseImpl) GetAllClients(ctx context.Context) []models.Client {
	return u.repo.GetAllClients(ctx)
}
