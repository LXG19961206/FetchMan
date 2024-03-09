package filelike

import (
	"changeme/models"
)

// file type
const (
	PHYSICALFILE = "PhysicalFile"
	REQUEST      = "Request"
	ENVRECORD    = "EnvRecord"
)

type FileLike struct {
	models.BaseFields `xorm:"extends"`
	FolderId          int64  `json:"folderId"`
	Name              string `xorm:"varchar(64)" json:"name"`
	Type              string `xorm:"varchar(32)" json:"type"`
	FileId            int64  `json:"fileId"`
	RequestId         int64  `json:"requestId"`
	Tag               string `xorm:"varchar(32)" json:"tag"`
}

func init() {
	models.CheckOrAppendTable(new(FileLike))
}
