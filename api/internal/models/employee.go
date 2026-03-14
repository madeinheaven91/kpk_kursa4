package models

type Employee struct {
	ID           string   `json:"id" gorm:"type:uuid;default:uuidv7();primaryKey" binding:"required"`
	AccountLogin *string  `json:"account_login"`
	Account      *Account `gorm:"foreignKey:AccountLogin;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"-"`
	Name         string   `json:"name"`
	Phone        string   `json:"phone"`

	Orders []Order `gorm:"many2many:employee_orders" json:"orders"`
}

type AddEmployeeForm struct {
	AccountLogin *string `json:"account_login"`
	Name         string `json:"name" binding:"required"`
	Phone        string `json:"phone" binding:"required,e164"`
}

func (f AddEmployeeForm) ToEmployee() *Employee {
	return &Employee{
		AccountLogin: f.AccountLogin,
		Name:         f.Name,
		Phone:        f.Phone,
	}
}

func (e *Employee) Update(form UpdateEmployeeForm) {
	if form.AccountLogin != "" {
        e.AccountLogin = &form.AccountLogin
	}
	if form.Name != "" {
        e.Name = form.Name
	}
	if form.Phone != "" {
		e.Phone = form.Phone
	}
}

type UpdateEmployeeForm struct {
	AccountLogin string `json:"account_login"`
	Name  string `json:"name"`
	Phone string `json:"phone" binding:"e164"`
}
