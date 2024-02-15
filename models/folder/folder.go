package folder

import (
	"changeme/models"

	_ "github.com/mattn/go-sqlite3" // 引入 SQLite 数据库驱动
)

// folder type
const (
	HISTORYRECORD = "HistoryRecord"
	COLLECTION    = "Collection"
)

type Folder struct {
	models.BaseFields `xorm:"extends"`
	CreaterId         string `json:"createrId"`
	Name              string `json:"name"`
	Depth             int64  `json:"depth"`
	ParentId          int64  `json:"parentId"`
	Type              string `json:"type"`
}

type Folder2Ancestor struct {
	models.BaseFields `xorm:"extends"`
	FolderId          int64 `json:"folderId"`
	AncestorId        int64 `json:"ancestorId"`
	AncestorLevel     int64 `json:"ancestorLevel"`
}

func init() {
	models.CheckOrAppendTable(&Folder{})
	models.CheckOrAppendTable(&Folder2Ancestor{})
}
