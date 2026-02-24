package app

import "github.com/madeinheaven91/anim-crm-api/internal/models"

func (a App) Migrate() {
	a.db.AutoMigrate(
		&models.Session{},
		&models.Client{},
	)
}

