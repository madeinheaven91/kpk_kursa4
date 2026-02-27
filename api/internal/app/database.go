package app

import "github.com/madeinheaven91/anim-crm-api/internal/models"

func (a App) Migrate() {
	a.db.AutoMigrate(
		&models.Account{},
		&models.Session{},
		&models.Client{},
		&models.Employee{},
		&models.Order{},
	)

	err := a.db.SetupJoinTable(&models.Employee{}, "Orders", &models.OrderEmployees{})
	if err != nil {
		panic(err)
	}
}

