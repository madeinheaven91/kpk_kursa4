package usecase

import (
	"context"
	"errors"
	"math/rand"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/madeinheaven91/anim-crm-api/internal/domains/account"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
)

type Usecase struct {
	accRepo account.AccountRepo
	sesRepo account.SessionRepo

	secretKey string
}

func NewUsecase(acc account.AccountRepo, s account.SessionRepo, secretKey string) account.AuthUsecase {
	return &Usecase{
		accRepo:   acc,
		sesRepo:   s,
		secretKey: secretKey,
	}
}

func (u Usecase) Login(ctx context.Context, form models.LoginForm) (*models.Session, error) {
	account := u.accRepo.Get(ctx, form.Login)
	if account == nil {
		return nil, errors.New("account not found")
	}

	if !account.CheckPassword(form.Password) {
		return nil, errors.New("wrong password")
	}

	// can't fail
	refreshToken, _ := u.GenerateRefreshToken(ctx, account)
	session := models.Session{
		AccountLogin: account.Login,
		RefreshToken: refreshToken,
	}
	err := u.sesRepo.Add(ctx, &session)
	if err != nil {
		return nil, err
	}

	// FIXME: maybe sesRepo.Add should preload account
	session.Account = *account

	return &session, nil
}

func (u Usecase) Logout(ctx context.Context, refreshToken string) error {
	return u.sesRepo.DeleteByRefreshToken(ctx, refreshToken)
}

func (u Usecase) Refresh(ctx context.Context, refreshToken string) (string, string, error) {
	ses := u.sesRepo.GetByRefreshToken(ctx, refreshToken)
	if ses == nil {
		return "", "", errors.New("session not found")
	}
	if ses.Expires_At.Unix() < time.Now().Unix() {
		u.sesRepo.DeleteByRefreshToken(ctx, refreshToken)
		return "", "", errors.New("session expired")
	}

	// Update session's refresh token
	// can't fail
	ses.RefreshToken, _ = u.GenerateRefreshToken(ctx, &ses.Account)
	u.sesRepo.Update(ctx, ses)

	// Generate new access token
	accessToken, err := u.GenerateAccessToken(ctx, &ses.Account)
	if err != nil {
		return "", "", err
	}

	return accessToken, ses.RefreshToken, nil
}

func (u Usecase) GenerateAccessToken(ctx context.Context, acc *models.Account) (string, error) {
	if acc == nil {
		return "", errors.New("account not found")
	}

	now := time.Now()

	claims := account.CustomClaims{
		Subject: acc.Login,
		// FIXME: role
		Role:      acc.Role,
		IssuedAt:  now.Unix(),
		ExpiresAt: now.Add(time.Hour * 1).Unix(),
	}

	// jwt.MapClaims{
	// 	"sub": account.Login,
	// 	"exp": time.Now().Add(time.Hour * 1).Unix(),
	// }
	//
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(u.secretKey))
}

func (u Usecase) ValidateAccessToken(tokenString string) (*account.CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &account.CustomClaims{}, func(t *jwt.Token) (any, error) {
		return []byte(u.secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	// Type assert the claims
	if claims, ok := token.Claims.(*account.CustomClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token claims")
}

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func (u Usecase) GenerateRefreshToken(ctx context.Context, _account *models.Account) (string, error) {
	b := make([]rune, 32)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b), nil
}

func (u Usecase) ChangePassword(ctx context.Context, login string, form models.ChangePasswordForm) error {
    acc := u.accRepo.Get(ctx, login)
    if acc == nil {
        return errors.New("account not found")
    }
    if !acc.CheckPassword(form.OldPassword) {
        return errors.New("wrong password")
    }
    acc.ChangePassword(form.NewPassword)
    return u.accRepo.Update(ctx, acc)
}
