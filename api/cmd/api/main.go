package main

import (
	"github.com/madeinheaven91/anim-crm-api/internal/app"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/config"
)

func main() {
	config := config.Init()

	app := app.SetupApp(config)
	app.Bootstrap()
	app.Run()
}
