package filelike

import (
	"changeme/models"
)

// file type
const (
	PHYSICALFILE = "PhysicalFile"
	REQUEST      = "Request"
)

type FileLike struct {
	models.BaseFields `xorm:"extends"`
	FolderId          int64  `json:"folderId"`
	Name              string `json:"name"`
	Type              string `json:"type"`
	FileId            int64  `json:"fileId"`
	RequestId         int64  `json:"requestId"`
}

func init() {
	models.CheckOrAppendTable(new(FileLike))
}
