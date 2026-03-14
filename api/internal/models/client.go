package models

type Client struct {
	ID          string  `json:"id" gorm:"type:uuid;default:uuidv7();primaryKey"`
	Name        string  `json:"name"`
	Phone       string  `json:"phone"`
	Description *string `json:"description"`
}

type AddClientForm struct {
	Name        string  `json:"name" binding:"required"`
	Phone       string  `json:"phone" binding:"required,e164"`
	Description *string `json:"description"`
}

func (f AddClientForm) ToClient() *Client {
	return &Client{
		Name:        f.Name,
		Phone:       f.Phone,
		Description: f.Description,
	}
}

func (c *Client) Update(form UpdateClientForm) {
	if form.Name != "" {
		c.Name = form.Name
	}
	if form.Phone != "" {
		c.Phone = form.Phone
	}
	if form.Description != nil && *form.Description != "" {
        c.Description = form.Description
	}
}

type UpdateClientForm struct {
	Name        string  `json:"name"`
	Phone       string  `json:"phone" binding:"e164"`
	Description *string `json:"description"`
}
