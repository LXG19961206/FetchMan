package body

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

type Body struct {
	models.BaseFields `xorm:"extends"`
	Type              string `json:"type"`
	ReqId             int64  `json:"reqId"`
	RespId            int64  `json:"respId"`
	Value             string `json:"value"`
	FilePath          string `json:"filePath"`
	FileId            int    `json:"fileId"`
}
