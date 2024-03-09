package file

import (
	"changeme/models"
)

const (
	JSON      = "application/json"
	TEXT      = "text/plain"
	XML       = "application/xml"
	HTML      = "text/html"
	JSONP     = "application/javascript"
	MULTIPART = "multipart/form-data"
	URL       = "application/x-www-form-urlencoded"
	BINARY    = "application/octet-stream"
	FILE      = "file"
)

type File struct {
	models.BaseFields `xorm:"extends"`
	Path              string `xorm:"varchar(32)" json:"path"`
	ContentType       string `xorm:"varchar(127)" json:"contentType"`
	Name              string `xorm:"varchar(32)" json:"name"`
}
