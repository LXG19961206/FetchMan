package db

import (
	"fmt"
	"strings"

	"github.com/labstack/gommon/log"
)

func UpadteColById(name string, col interface{}, id int) error {

	var (
		fields, values = GetFieldsAndValues(col)
		finalValues    = []interface{}{}
		patchSubSqls   []string
	)

	log.Info(col)

	log.Info(fields)

	log.Info(values)

	for idx, field := range fields {
		if strings.ToUpper(field) == "ID" {
			continue
		} else {
			patchSubSqls = append(patchSubSqls, fmt.Sprintf("%s = ?", field))
			finalValues = append(finalValues, values[idx])
		}
	}

	stmt, err := GetAppDb().Prepare(fmt.Sprintf("UPDATE %s SET %s WHERE id = %d", name, strings.Join(patchSubSqls, ","), id))

	log.Info(finalValues)

	if err == nil {

		stmt.Exec(finalValues...)

	}

	return err

}
