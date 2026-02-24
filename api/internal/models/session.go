package models

import "time"

type Session struct {
	ID           int       `gorm:"primaryKey;autoIncrement:true" json:"id"`
	AccountLogin string    `gorm:"not null" json:"account_login"`
	Account      Account   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"-"`
	RefreshToken string    `gorm:"not null;unique" json:"refresh_token"`
	Expires_At   time.Time `gorm:"not null;type:timestamp;default:current_timestamp + interval '1 week'" json:"expires_at"`
}
