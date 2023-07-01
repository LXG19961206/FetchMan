package launch

import (
	"changeme/config"
	"changeme/model"
	"github.com/rs/zerolog"
	"os"
)

var AppLogger zerolog.Logger

func InitLog(conf model.AppBaseConfig) *os.File {

	var fullPath = conf.LogDir + "/" + config.LogFileName + ".log"

	file, err := os.OpenFile(fullPath, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)

	if err == nil {

		AppLogger = zerolog.New(file).With().Caller().Timestamp().Logger()

	}

	return file

}
