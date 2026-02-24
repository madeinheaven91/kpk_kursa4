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

    // // Create enum type with Exec() and check error
    // if err := DB.Exec("CREATE TYPE media_type AS ENUM ('video', 'image');").Error; err != nil {
    //     // Ignore "already exists" error
    //     if !strings.Contains(err.Error(), "already exists") {
    //         panic("failed to create enum type: " + err.Error())
    //     }
    // }

	// err = DB.AutoMigrate(
	// 	models.Account{},
	// 	models.Session{},
	// 	models.Animator{},
	// 	models.Costume{},
	// 	models.Show{},
	// 	models.ShowMedia{},
	// 	models.ExtraService{},
	// 	models.MainSetting{},
	// 	models.MainSettingAnimator{},
	// 	models.MainSettingShow{},
	// 	models.MainSettingExtraService{},
	// )
	if err != nil {
		panic(err)
	}

	return DB
}
