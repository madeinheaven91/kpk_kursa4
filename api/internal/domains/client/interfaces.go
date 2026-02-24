package client

import (
	"context"

	"github.com/madeinheaven91/anim-crm-api/internal/models"
)

type ClientRepo interface {
	GetAllClients(context.Context) []models.Client
	GetClient(ctx context.Context, id string) *models.Client
	AddClient(ctx context.Context, client *models.Client) error
	DeleteClient(ctx context.Context, id string) error
	UpdateClient(ctx context.Context, client *models.Client) *models.Client
}

type Usecase interface {
	GetClientShortInfo(ctx context.Context, id string) *models.Client
	GetClientFullInfo(ctx context.Context, id string) *models.Client
	GetAllClients(context.Context) []models.Client
}
