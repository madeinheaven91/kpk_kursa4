package router

import (
	"github.com/gin-gonic/gin"
	clientControllers "github.com/madeinheaven91/anim-crm-api/internal/domains/client/controllers"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/database"
)

func SetupRouter(r *gin.Engine) {
	v1 := r.Group("/api/v1")

	clientControllers.SetupRouter(v1, database.DB)
}

