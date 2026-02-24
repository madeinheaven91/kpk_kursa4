package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Environment  environment
	Server serverConfig
}

type environment string

const (
	Dev        environment = "dev"
	Production environment = "production"
)

var environmentMap = map[string]environment{
	"dev":        Dev,
	"production": Production,
}

type serverConfig struct {
	Port      int
	DSN       string
	SecretKey string
}


func Init() Config {
	cfg := Config{}
	cfg.Server = serverConfig{}

	cfg.Environment = parseEnvironment()

	// gets env variables from .env in dev environment
	if cfg.Environment == Dev {
		initFromEnvFile()
	}

	cfg.Server.Port = parseEnvInt("SERVER_PORT", 3000)
	cfg.Server.DSN = parseEnvString("DSN", "null")
	cfg.Server.SecretKey = parseEnvString("SECRET_KEY", "null")

	return cfg
}

func initFromEnvFile() {
	envPath := os.Getenv("ENV_PATH")
	if envPath == "" {
		envPath = ".env"
	}

	err := godotenv.Load(envPath)
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func parseEnvironment() environment {
    env, ok := environmentMap[os.Getenv("ENVIRONMENT")]
    if !ok {
        fmt.Println("ENVIRONMENT not set or invalid, using default value:", Dev)
        return Dev
    } else {
        return env
    }
}

func parseEnvInt(variable string, defaultValue int) int {
	value, err := strconv.Atoi(os.Getenv(variable))
	if err != nil {
		fmt.Println(variable, "not set or invalid, using default value:", defaultValue)
		return defaultValue
	} else {
		return value
	}
}

func parseEnvString(variable string, defaultValue string) string {
	value := os.Getenv(variable)
	if value == "" {
		fmt.Println(variable, "not set or invalid, using default value:", defaultValue)
		return defaultValue
	} else {
		return value
	}
}
