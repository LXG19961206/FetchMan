package db

import (
	"changeme/launch"
	"fmt"

	"github.com/labstack/gommon/log"
)

func DeleteColById(name string, id int) error {

	var sqlStr = fmt.Sprintf("DELETE FROM %s WHERE id=%d;", name, id)

	log.Info(sqlStr)

	var _, err = GetAppDb().Exec(sqlStr)

	if err != nil {
		launch.AppLogger.Error().Msg(err.Error())
	}

	return err

}
