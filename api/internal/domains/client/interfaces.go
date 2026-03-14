package client

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/models"
)

type FilterParams struct {
	Name string
}

type Repo interface {
	Get(ctx context.Context, id string) *models.Client
	GetAll(ctx context.Context, limit, offset int, filter FilterParams) []models.Client
	Add(ctx context.Context, client *models.Client) error
	Delete(ctx context.Context, id string) error
	Update(ctx context.Context, client *models.Client) error

	Total(ctx context.Context, filter FilterParams) (int64, error)
}

type UC interface {
	GetClient(ctx context.Context, id string) *models.Client
	GetClientFull(ctx context.Context, id string) *models.Client
	GetAllClients(ctx context.Context, limit, offset int, filter FilterParams) []models.Client
    AddClient(ctx context.Context, client *models.AddClientForm) (*models.Client, error)
    UpdateClient(ctx context.Context, client *models.Client) error
    DeleteClient(ctx context.Context, id string) error

	GetTotal(ctx context.Context, filter FilterParams) (int64, error)
}
