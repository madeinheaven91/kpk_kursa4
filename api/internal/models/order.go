package models

import "time"

type Order struct {
	ID        int       `json:"id" gorm:"primaryKey;autoIncrement:true"`
	ClientID  string    `json:"client_id" gorm:"type:uuid;not null"`
	Client    Client    `json:"-" gorm:"foreignKey:ClientID"`
	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
	Address   string    `json:"addredd"`
}

type OrderEmployees struct {
	EmployeeID string `json:"employee_id" gorm:"type:uuid;primaryKey"`
	OrderID    int    `json:"order_id" gorm:"primaryKey"`

	Role string `json:"role"`
}
