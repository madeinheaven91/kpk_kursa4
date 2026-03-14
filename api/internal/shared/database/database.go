package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect(DSN string) *gorm.DB {
	var err error
	DB, err := gorm.Open(postgres.Open(DSN), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	sqlDB, err := DB.DB()
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetMaxIdleConns(10)

	if err != nil {
		panic(err)
	}

	return DB
}
