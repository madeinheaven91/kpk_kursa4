package models

import (
	"golang.org/x/crypto/bcrypt"
)

type Account struct {
	Login string `json:"login" gorm:"primaryKey"`
	// Role is either root, manager or employee
	Role string `json:"role" gorm:"default:'employee'"`
	// Hashed password
	Password string `json:"-"`
}

func (a *Account) ChangePassword(pw string) error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(pw), 14)
	if err != nil {
		return err
	}
	a.Password = string(bytes)
	return nil
}

func (a Account) CheckPassword(pw string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(a.Password), []byte(pw))
	return err == nil
}

func (a Account) ToResponse() AccountResponse {
	return AccountResponse{Login: a.Login, Role: a.Role}
}

type AccountResponse struct {
	Login string `json:"login"`
	Role  string `json:"role"`
}

type LoginForm struct {
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type ChangePasswordForm struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required"`
}

type AddAccountForm struct {
	Login    string `json:"login" binding:"required"`
	Role     string `json:"role"`
	Password string `json:"password" binding:"required"`
}

