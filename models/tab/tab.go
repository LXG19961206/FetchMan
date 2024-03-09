package tab

import "changeme/models"

type Tab struct {
	models.BaseFields `xorm:"extends"`
	Name              string `xorm:"varchar(32)" json:"name"`
	RequestId         int64  `json:"requestId"`
	ResponseId        int64  `json:"responseId"`
	ShowFlag          bool   `json:"showFlag"`
	IsCurrent         bool   `json:"isCurrent"`
	Method            string `xorm:"varchar(32)" json:"method"`
	Url               string `xorm:"varchar(64)" json:"url"`
}

func init() {
	models.CheckOrAppendTable(&Tab{})
}
