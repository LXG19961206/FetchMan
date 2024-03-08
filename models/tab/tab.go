package tab

import "changeme/models"

type Tab struct {
	models.BaseFields `xorm:"extends"`
	Name              string `json:"name"`
	RequestId         int64  `json:"requestId"`
	ResponseId        int64  `json:"responseId"`
	ShowFlag          bool   `json:"showFlag"`
	IsCurrent         bool   `json:"isCurrent"`
	Method            string `json:"method"`
}

func init() {
	models.CheckOrAppendTable(&Tab{})
}
