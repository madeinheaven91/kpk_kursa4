package app

import (
	"fmt"

	"github.com/gin-gonic/gin"
	repoAccount "github.com/madeinheaven91/anim-crm-api/internal/domains/account/repo"
	transportAccount "github.com/madeinheaven91/anim-crm-api/internal/domains/account/transport"
	usecaseAccount "github.com/madeinheaven91/anim-crm-api/internal/domains/account/usecase"
	repoClient "github.com/madeinheaven91/anim-crm-api/internal/domains/client/repo"
	transportClient "github.com/madeinheaven91/anim-crm-api/internal/domains/client/transport"
	usecaseClient "github.com/madeinheaven91/anim-crm-api/internal/domains/client/usecase"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/config"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/database"
	"gorm.io/gorm"
)

type App struct {
	db *gorm.DB

	Settings config.Config
	Router   *gin.Engine
}

func SetupApp(c config.Config) App {
	router := gin.Default()
	db := database.Connect(c.Server.DSN)

	// Settings based on environment
	switch c.Environment {
	case config.Dev:
		gin.SetMode(gin.DebugMode)
	case config.Production:
		gin.SetMode(gin.ReleaseMode)
	}

	v1 := router.Group("/api/v1")
	// Set up client routes
	{
		repo := repoClient.NewRepo(db)
		uc := usecaseClient.NewUsecase(repo)
		rest := transportClient.NewHandler(uc)
		rest.SetupRouter(v1)
	}

	// Set up account routes
	{
		accrepo := repoAccount.NewAccountRepo(db)
		srepo := repoAccount.NewSessionRepo(db)
		auth := usecaseAccount.NewUsecase(accrepo, srepo, c.Server.SecretKey)

        acc := usecaseAccount.NewAccountUC(accrepo)
		rest := transportAccount.NewHandler(acc, auth)
		rest.SetupRouter(v1)
	}

	app := App{
		Router:   router,
		db:       db,
		Settings: c,
	}

	return app
}

func (a App) Run() {
	a.Router.Run(fmt.Sprint(":", a.Settings.Server.Port))
}
