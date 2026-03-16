package usecases

import (
	"context"
	"fmt"
	"log"
	"strconv"

	"github.com/madeinheaven91/anim-crm-api/internal/domains/order"
	"github.com/madeinheaven91/anim-crm-api/internal/models"
)

type OrderUC struct {
	repo order.Repo
}

func NewUC(repo order.Repo) order.UC {
	return &OrderUC{
		repo: repo,
	}
}

func (u *OrderUC) Get(ctx context.Context, id string) *models.OrderFull {
	order := u.repo.Get(ctx, id)
	employees := u.repo.GetEmployees(ctx, order.ID)
	return &models.OrderFull{
		ID:        order.ID,
		Client:    order.Client,
		Employees: employees,
		Datetime:  order.Datetime,
		Duration:  order.Duration,
		Address:   order.Address,
	}
}

func (u *OrderUC) GetAll(ctx context.Context, limit, offset int, filter order.FilterParams) []models.OrderFull {
	orders := u.repo.GetAll(ctx, limit, offset, filter)
	res := make([]models.OrderFull, len(orders))
	for i, order := range orders {
		employees := u.repo.GetEmployees(ctx, order.ID)
		res[i] = models.OrderFull{
			ID:          order.ID,
			Client:      order.Client,
			Employees:   employees,
			Datetime:    order.Datetime,
			Duration:    order.Duration,
			Address:     order.Address,
			Description: order.Description,
		}

	}
	return res
}

func (u *OrderUC) Add(ctx context.Context, form models.AddOrderForm) (*models.Order, error) {
	order, employees := form.ToOrder()
	err := u.repo.Add(ctx, order)
	if err != nil {
		return nil, err
	}
	for _, e := range employees {
		err := u.repo.AddEmployeeToOrder(ctx, order.ID, e.ID, e.Role)
		if err != nil {
			log.Println(err)
		}
	}
	return order, nil
}

func (u *OrderUC) Delete(ctx context.Context, login string) error {
	return u.repo.Delete(ctx, login)
}

func (u *OrderUC) Update(ctx context.Context, orderID int, form *models.UpdateOrderForm) (*models.Order, error) {
	orderIDStr := strconv.Itoa(orderID)
	order := u.repo.Get(ctx, orderIDStr)
	if order == nil {
		return nil, fmt.Errorf("order not found")
	}

	for _, e := range order.EmployeeOrders {
		err := u.repo.RemoveEmployeeFromOrder(ctx, orderID, e.EmployeeID)
		if err != nil {
			log.Println(err)
		}
		log.Println("Deleted", e.Employee.Name)
	}

	for _, e := range form.Employees {
		err := u.repo.AddEmployeeToOrder(ctx, orderID, e.ID, e.Role)
		if err != nil {
			log.Println(err)
		}
		log.Println("Added", e.ID)
	}

	order.ID = orderID
	order.Duration = form.Duration
	order.Datetime = form.Datetime
	order.Address = form.Address
	order.Description = form.Description

	log.Println(order)

	return order, u.repo.Update(ctx, order)
}

func (u *OrderUC) AddEmployeeToOrder(ctx context.Context, o *models.Order, emp *models.EmployeeRole) error {
	return u.repo.AddEmployeeToOrder(ctx, o.ID, emp.ID, emp.Role)
}

func (u *OrderUC) RemoveEmployeeFromOrder(ctx context.Context, o *models.Order, emp *models.Employee) error {
	return u.repo.RemoveEmployeeFromOrder(ctx, o.ID, emp.ID)
}

func (u *OrderUC) Total(ctx context.Context, filter order.FilterParams) (int64, error) {
	return u.repo.Total(ctx, filter)
}
