package models

type Client struct {
	ID    string `json:"id" gorm:"type:uuid;default:uuidv7();primaryKey"`
	Name  string `json:"name"`
	Phone string `json:"phone"`
}

type AddClientForm struct {
	Name  string `json:"name" binding:"required"`
	Phone string `json:"phone" binding:"required"`
}

func (f AddClientForm) ToClient() *Client {
	return &Client{
		Name:  f.Name,
		Phone: f.Phone,
	}
}

func (c *Client) Update(form UpdateClientForm) {
	if form.Name != "" {
        c.Name = form.Name
	}
	if form.Phone != "" {
		c.Phone = form.Phone
	}
}

type UpdateClientForm struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
}
