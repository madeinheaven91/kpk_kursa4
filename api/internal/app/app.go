package app

import (
	"fmt"

	"github.com/gin-gonic/gin"
	accRepo "github.com/madeinheaven91/anim-crm-api/internal/domains/account/repo"
	accHTTP "github.com/madeinheaven91/anim-crm-api/internal/domains/account/transport"
	accUC "github.com/madeinheaven91/anim-crm-api/internal/domains/account/usecase"
	clientRepo "github.com/madeinheaven91/anim-crm-api/internal/domains/client/repo"
	clientHTTP "github.com/madeinheaven91/anim-crm-api/internal/domains/client/transport"
	clientUC "github.com/madeinheaven91/anim-crm-api/internal/domains/client/usecase"
	empRepo "github.com/madeinheaven91/anim-crm-api/internal/domains/employee/repo"
	empHTTP "github.com/madeinheaven91/anim-crm-api/internal/domains/employee/transport"
	empUC "github.com/madeinheaven91/anim-crm-api/internal/domains/employee/usecase"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/config"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/database"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/services"
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

	authService := services.NewService(c.Server.SecretKey)

	v1 := router.Group("/api/v1")


	// Auth module
	{
		accrepo := accRepo.NewAccountRepo(db)
		sRepo := accRepo.NewSessionRepo(db)
		authUC := accUC.NewAuthUC(accrepo, sRepo, c.Server.SecretKey)
        accUC := accUC.NewAccountUC(accrepo)
		handler := accHTTP.NewHandler(accUC, authUC)
		handler.SetupRouter(v1, authService)
	}

	// Client module
	{
		repo := clientRepo.NewRepo(db)
		uc := clientUC.NewUC(repo)
		handler := clientHTTP.NewClientHandler(uc)
		handler.SetupRouter(v1, authService)
	}

	// Employee module
	{
		repo := empRepo.NewRepo(db)
		uc := empUC.NewUC(repo)
		handler := empHTTP.NewEmployeeHandler(uc)
		handler.SetupRouter(v1, authService)
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
