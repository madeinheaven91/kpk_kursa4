package models

import (
	"database/sql/driver"
	"fmt"
	"strings"
	"time"
)

type JsonTime time.Time

func (j JsonTime) MarshalJSON() ([]byte, error) {
	return fmt.Appendf(nil, "\"%s\"", time.Time(j).Format("15:04 02.01.2006")), nil
}

func (j *JsonTime) UnmarshalJSON(b []byte) error {
    s := strings.Trim(string(b), `"`)
    
    formats := []string{
		"15:04 02.01.2006",
        "2006-01-02T15:04:05Z07:00", // RFC3339
        "2006-01-02T15:04:05",       
        "2006-01-02T15:04",          // datetime-local
    }
    
    for _, f := range formats {
        if t, err := time.Parse(f, s); err == nil {
            *j = JsonTime(t)
            return nil
        }
    }
    
    return fmt.Errorf("cannot parse %q as DateTime", s)
}

func (j JsonTime) Value() (driver.Value, error) {
	return time.Time(j), nil
}
 
func (j *JsonTime) Scan(value any) error {
	if value == nil {
		*j = JsonTime(time.Time{})
		return nil
	}
	
	switch v := value.(type) {
	case time.Time:
		*j = JsonTime(v)
		return nil
	case []byte:
		t, err := time.Parse("15:04 02.01.2006", string(v))
		if err != nil {
			return err
		}
		*j = JsonTime(t)
		return nil
	case string:
		t, err := time.Parse("15:04 02.01.2006", v)
		if err != nil {
			return err
		}
		*j = JsonTime(t)
		return nil
	default:
		return fmt.Errorf("cannot scan type %T into JsonTime", value)
	}
}

func (j JsonTime) Time() time.Time {
	return time.Time(j)
}
