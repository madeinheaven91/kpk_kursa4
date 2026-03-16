package models

import (
	"encoding/json"
	"errors"
)

type Order struct {
	ID          int      `json:"id" gorm:"primaryKey;autoIncrement"`
	ClientID    string   `json:"client_id" gorm:"type:uuid"`
	Client      *Client  `json:"-" gorm:"foreignKey:ClientID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	Datetime    JsonTime `json:"datetime" gorm:"type:timestamp;not null"`
	Duration    *int     `json:"duration"`
	Address     string   `json:"address" gorm:"not null"`
	Description *string  `json:"description"`

	EmployeeOrders []EmployeeOrders `gorm:"foreignKey:OrderID" json:"-"`
}

type EmployeeOrders struct {
	EmployeeID string `json:"employee_id" gorm:"type:uuid;primaryKey"`
	OrderID    int    `json:"order_id" gorm:"primaryKey"`
	Role       string `json:"role"`

	Employee Employee `json:"employee" gorm:"foreignKey:EmployeeID"`
	Order    Order    `json:"order" gorm:"foreignKey:OrderID"`
}

// EmployeeRole is employee representation with role
type EmployeeRole struct {
	Employee `json:"employee" binding:"required"`
	Role     string `json:"role" binding:"required"`
}

// func (e EmployeeRole) MarshalJSON() ([]byte, error) {
// 	return json.Marshal(map[string]any{
// 		"id":      e.ID,
// 		"account": e.Account,
// 		"name":    e.Name,
// 		"phone":   e.Phone,
// 		"role":    e.Role,
// 	})
// }

func (e *EmployeeRole) UnmarshalJSON(data []byte) error {
	var er map[string]any
	if err := json.Unmarshal(data, &er); err != nil {
		return err
	}
	id, exists := er["id"]
	if !exists {
		return errors.New("can't unmarshal EmployeeRole without id")
	}
	e.ID = id.(string)
	role, exists := er["role"]
	if !exists {
		return errors.New("can't unmarshal EmployeeRole without role")
	}
	e.Role = role.(string)
	return nil
}

type OrderFull struct {
	ID          int            `json:"id"`
	Client      *Client        `json:"client"`
	Employees   []EmployeeRole `json:"employees"`
	Datetime    JsonTime       `json:"datetime"`
	Duration    *int           `json:"duration"`
	Address     string         `json:"address"`
	Description *string        `json:"description"`
}

type AddOrderForm struct {
	ClientID string `json:"client_id" binding:"required"`
	// Employees is a list of employee IDs
	Employees   []EmployeeRole `json:"employees" binding:"required"`
	Datetime    JsonTime       `json:"datetime" binding:"required"`
	Duration    *int           `json:"duration"`
	Address     string         `json:"address" binding:"required"`
	Description *string        `json:"description"`
}

func (a AddOrderForm) ToOrder() (*Order, []EmployeeRole) {
	return &Order{
		ClientID: a.ClientID,
		Address:  a.Address,
		Datetime: a.Datetime,
		Duration: a.Duration,
		Description: a.Description,
	}, a.Employees
}

type UpdateOrderForm struct {
	Employees   []EmployeeRole `json:"employees"`
	Datetime    JsonTime       `json:"datetime"`
	Duration    *int           `json:"duration"`
	Address     string         `json:"address"`
	Description *string        `json:"description"`
}
