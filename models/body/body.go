package body

import (
	"changeme/models"
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
