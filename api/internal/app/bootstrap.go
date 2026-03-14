package app

import (
	"context"
	"log"
	"os"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/account"
	repoAccount "github.com/madeinheaven91/anim-crm-api/internal/domains/account/repo"
	usecaseAccount "github.com/madeinheaven91/anim-crm-api/internal/domains/account/usecase"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
)

// Bootstrap creates a root account
func (a App) Bootstrap() {
	a.Migrate()

	repo := repoAccount.NewAccountRepo(a.db)
	uc := usecaseAccount.NewAccountUC(repo)
	accounts := uc.GetAll(context.Background(), 1, 0, account.FilterParams{})
	if len(accounts) == 0 {
		// Create root account
		log.Println("BOOSTRAPPING | Creating root account")
		rootLogin := os.Getenv("ROOT_LOGIN")
		if rootLogin == "" {
			panic("ROOT_LOGIN not set")
		}
		rootPassword := os.Getenv("ROOT_PASSWORD")
		if rootPassword == "" {
			panic("ROOT_PASSWORD not set")
		}
		_, err := uc.Create(context.Background(), models.AddAccountForm{
			Login: rootLogin, 
			Password: rootPassword,
			Role: "admin",
		})
		if err != nil {
			panic(err)
		}
	}
}
