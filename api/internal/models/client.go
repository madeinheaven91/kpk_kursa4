package models

type Client struct {
	ID   string `json:"id" gorm:"type:uuid;default:uuidv7();primaryKey"`
    Name string `json:"name"`
	Phone string `json:"phone"`
}

