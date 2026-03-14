package transport

import (
	"github.com/gin-gonic/gin"
	"github.com/madeinheaven91/anim-crm-api/internal/domains/account"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
	"github.com/madeinheaven91/anim-crm-api/internal/shared"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/errors"
	"github.com/madeinheaven91/anim-crm-api/internal/shared/services"
)

type Handler struct {
	accUC  account.AccountUC
	authUC account.AuthUC
}

func NewHandler(acc account.AccountUC, auth account.AuthUC) Handler {
	return Handler{accUC: acc, authUC: auth}
}

func (h Handler) SetupRouter(r *gin.RouterGroup, authService services.AuthService) {
	r.POST("/login", h.Login)
	r.GET("/logout", h.Logout)
	r.GET("/refresh", h.Refresh)

	// Account CRUD
	auth := r.Group("")
	auth.Use(authService.Authorized())

	// Invariant
	auth.GET("/me", h.Me)
	auth.POST("/changepass", h.ChangeMyPass)

	prot := auth.Group("")
	prot.Use(authService.RequireRoles("manager", "admin"))

	// Manager and admin
	prot.GET("/accounts", h.GetAllAccounts)
	prot.GET("/accounts/:login", h.GetAccount)
	prot.DELETE("/accounts/:login", h.DeleteAccount)
	prot.POST("/accounts", h.AddAccount)
	prot.POST("/changepass/:login", h.ChangePass)
}

func (h Handler) Login(c *gin.Context) {
	// Bind json
	var form models.LoginForm
	if err := c.ShouldBindJSON(&form); err != nil {
		c.AbortWithStatusJSON(401, err.Error())
		return
	}

	// Check if credentials are right and if so create a new session
	session, err := h.authUC.Login(c, form)
	if err != nil {
		c.AbortWithStatusJSON(401, err.Error())
		return
	}

	// Generate access token
	accessToken, err := h.authUC.GenerateAccessToken(c.Request.Context(), &session.Account)

	c.SetCookie("REFRESH_TOKEN", session.RefreshToken, 604800, "/api", "localhost", false, true)
	c.SetCookie("ACCESS_TOKEN", accessToken, 3600, "/api", "localhost", false, true)
	c.JSON(200, gin.H{
		"account": session.Account,
	})
}

func (h Handler) Logout(c *gin.Context) {
	// Get refresh token from cookies
	token, err := c.Cookie("REFRESH_TOKEN")
	if err != nil {
		c.Status(400)
		return
	}

	// Delete session with provided token
	err = h.authUC.Logout(c.Request.Context(), token)
	if err != nil {
		c.AbortWithStatusJSON(401, err.Error())
		return
	}

	// Clear refresh token cookie
	c.SetCookie("REFRESH_TOKEN", "", -1, "/api", "localhost", false, true)
	c.SetCookie("ACCESS_TOKEN", "", -1, "/api", "localhost", false, true)
	c.Status(204)
}

func (h Handler) Refresh(c *gin.Context) {
	// Get refresh token from cookies
	token, err := c.Cookie("REFRESH_TOKEN")
	if err != nil {
		c.Status(400)
		return
	}

	// Refresh
	acc, refr, err := h.authUC.Refresh(c.Request.Context(), token)
	if err != nil {
		c.AbortWithStatusJSON(401, err.Error())
		return
	}

	c.SetCookie("REFRESH_TOKEN", refr, 604800, "/api", "localhost", false, true)
	c.SetCookie("ACCESS_TOKEN", acc, 3600, "/api", "localhost", false, true)
	c.Status(204)
}

func (h Handler) AddAccount(c *gin.Context) {
	cl, _ := c.Get("claims")
	claims := cl.(*account.CustomClaims)

	// Bind json
	var form models.AddAccountForm
	if err := c.ShouldBindJSON(&form); err != nil {
		c.AbortWithStatusJSON(401, err.Error())
		return
	}

	// Manager can only create employees
	if (claims.Role == "manager" && form.Role != "employee") ||
		// Can't create admin accounts
		(form.Role == "admin") {
		c.AbortWithStatusJSON(403, errors.NewError(account.ForbiddenError))
		return
	}

	// Create account
	acc, err := h.accUC.Create(c.Request.Context(), form)
	if err != nil {
		c.AbortWithStatusJSON(401, err.Error())
		return
	}

	c.JSON(201, acc)
}

func (h Handler) DeleteAccount(c *gin.Context) {
	cl, _ := c.Get("claims")
	claims := cl.(*account.CustomClaims)
	login := c.Param("login")

	// Get account by login
	acc := h.accUC.Get(c.Request.Context(), login)
	if acc == nil {
		c.AbortWithStatusJSON(404, errors.NewError(account.AccountNotFound))
		return
	}

	// Manager can only delete employees
	if (claims.Role == "manager" && acc.Role != "employee") ||
		// Can't delete your own account
		(claims.Subject == login) {
		c.AbortWithStatusJSON(403, errors.NewError(account.ForbiddenError))
		return
	}

	// Delete account
	err := h.accUC.Delete(c.Request.Context(), login)
	if err != nil {
		c.Error(err)
		return
	}

	c.Status(204)
}

func (h Handler) GetAllAccounts(c *gin.Context) {
	limit, offset, _ := shared.LimitOffsetSearch(c)
	filter := account.FilterParams{}
	filter.Login = c.Query("login")

	accs := h.accUC.GetAll(c.Request.Context(), limit, offset, filter)
	total, err := h.accUC.GetTotal(c.Request.Context(), filter)
	if err != nil {
		c.AbortWithStatusJSON(500, err.Error())
		return
	}

	// Convert to responses
	res := make([]models.AccountResponse, len(accs))
	for i, acc := range accs {
		res[i] = acc.ToResponse()
	}

	c.JSON(200, gin.H{"total": total, "accounts": res})
}

func (h Handler) GetAccount(c *gin.Context) {
	cl, _ := c.Get("claims")
	claims := cl.(*account.CustomClaims)
	login := c.Param("login")

	if claims.Subject != login && claims.Role != "admin" {
		c.AbortWithStatusJSON(403, errors.NewError(account.ForbiddenError))
		return
	}

	acc := h.accUC.Get(c.Request.Context(), login)
	if acc == nil {
		c.AbortWithStatusJSON(404, errors.NewError(account.AccountNotFound))
		return
	}

	c.JSON(200, acc.ToResponse())
}

func (h Handler) ChangePass(c *gin.Context) {
	cl, _ := c.Get("claims")
	claims := cl.(*account.CustomClaims)
	login := c.Param("login")

	// Bind json
	var form models.ChangePasswordForm
	if err := c.ShouldBindJSON(&form); err != nil {
		c.Error(err)
		return
	}

	acc := h.accUC.Get(c.Request.Context(), login)
	if acc == nil {
		c.AbortWithStatusJSON(404, errors.NewError(account.AccountNotFound))
		return
	}

	// Manager can only change employees password
	if claims.Role == "manager" && acc.Role != "employee" {
		c.AbortWithStatusJSON(403, errors.NewError(account.ForbiddenError))
		return
	}

	// Change password
	err := h.authUC.ChangePassword(c.Request.Context(), login, form)
	if err != nil {
		c.Error(err)
		return
	}

	c.Status(201)
}

func (h Handler) ChangeMyPass(c *gin.Context) {
	cl, _ := c.Get("claims")
	claims := cl.(*account.CustomClaims)

	// Bind json
	var form models.ChangePasswordForm
	if err := c.ShouldBindJSON(&form); err != nil {
		c.Error(err)
		return
	}

	acc := h.accUC.Get(c.Request.Context(), claims.Subject)
	if acc == nil {
		c.AbortWithStatusJSON(404, errors.NewError(account.AccountNotFound))
		return
	}

	// Change password
	err := h.authUC.ChangePassword(c.Request.Context(), claims.Subject, form)
	if err != nil {
		c.Error(err)
		return
	}

	c.Status(201)
}

func (h Handler) Me(c *gin.Context) {
	cl, _ := c.Get("claims")
	claims := cl.(*account.CustomClaims)

	acc := h.accUC.Get(c.Request.Context(), claims.Subject)

	c.JSON(200, acc.ToResponse())
}
