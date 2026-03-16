package repo

import (
	"context"
	"log"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/order"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
	"gorm.io/gorm"
)

type UserOrderRepo struct {
	db *gorm.DB
}

func NewRepo(db *gorm.DB) order.Repo {
	return UserOrderRepo{db}
}

func (r UserOrderRepo) GetAll(ctx context.Context, limit, offset int, filter order.FilterParams) []models.Order {
	base := r.db.WithContext(ctx).
		Model(&models.Order{}).
		Preload("Client", nil).
		Preload("EmployeeOrders.Employee", nil).
		Order("datetime desc").
		Limit(limit).
		Offset(offset)
	if filter.ClientID != "" {
		base = base.Where("client_id = ?", filter.ClientID)
	}
	if filter.StartMin != nil {
		base = base.Where("datetime >= ?", filter.StartMin)
	}
	if filter.StartMax != nil {
		base = base.Where("datetime <= ?", filter.StartMax)
	}
	if filter.EmployeeID != "" {
		base = base.
			Joins("JOIN employee_orders on employee_orders.order_id = orders.id").
			Where("employee_orders.employee_id = ?", filter.EmployeeID)
	}
	var orders []models.Order
	if err := base.Find(&orders).Error; err != nil {
		return nil
	}
	return orders
}

func (r UserOrderRepo) Get(ctx context.Context, id string) *models.Order {
	res, err := gorm.G[models.Order](r.db).
		Preload("Client", nil).
		Preload("EmployeeOrders.Employee", nil).
		Where("id = ?", id).First(ctx)
	if err != nil {
		return nil
	}
	return &res
}

func (r UserOrderRepo) Add(ctx context.Context, order *models.Order) error {
	return gorm.G[models.Order](r.db).Create(ctx, order)
}

func (r UserOrderRepo) Delete(ctx context.Context, id string) error {
	_, err := gorm.G[models.Order](r.db).Where("id = ?", id).Delete(ctx)
	return err
}

func (r UserOrderRepo) Update(ctx context.Context, order *models.Order) error {
	_, err := gorm.G[models.Order](r.db).
		Where("id = ?", order.ID).
		Select("duration", "datetime", "address", "description").
		Updates(ctx, *order)
	return err
}

func (r UserOrderRepo) GetEmployees(ctx context.Context, orderID int) []models.EmployeeRole {
	oe, err := gorm.G[models.EmployeeOrders](r.db).Where("order_id=?", orderID).Find(ctx)
	if err != nil {
		return nil
	}
	res := make([]models.EmployeeRole, len(oe))
	for i, el := range oe {
		emp, err := gorm.G[models.Employee](r.db).Where("id=?", el.EmployeeID).First(ctx)
		if err != nil {
			log.Println(err)
		}
		res[i] = models.EmployeeRole{Employee: emp, Role: el.Role}
	}
	return res
}

func (r UserOrderRepo) AddEmployeeToOrder(ctx context.Context, orderID int, empID string, role string) error {
	err := gorm.G[models.EmployeeOrders](r.db).Create(ctx, &models.EmployeeOrders{
		EmployeeID: empID,
		OrderID:    orderID,
		Role:       role,
	})
	return err
}

func (r UserOrderRepo) RemoveEmployeeFromOrder(ctx context.Context, orderID int, empID string) error {
	_, err := gorm.G[models.EmployeeOrders](r.db).Where("order_id = ? and employee_id = ?", orderID, empID).Delete(ctx)
	return err
}

func (r UserOrderRepo) Total(ctx context.Context, filter order.FilterParams) (int64, error) {
	base := r.db.WithContext(ctx).
		Model(&models.Order{}).
		Preload("Client", nil).
		Preload("EmployeeOrders.Employee", nil)
	if filter.ClientID != "" {
		base = base.Where("client_id = ?", filter.ClientID)
	}
	if filter.StartMin != nil {
		base = base.Where("datetime >= ?", filter.StartMin)
	}
	if filter.StartMax != nil {
		base = base.Where("datetime <= ?", filter.StartMax)
	}
	if filter.EmployeeID != "" {
		base = base.
			Joins("JOIN employee_orders on employee_orders.order_id = orders.id").
			Where("employee_orders.employee_id = ?", filter.EmployeeID)
	}

	var count int64
	res := base.Count(&count)
	return count, res.Error
}
