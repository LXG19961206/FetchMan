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

func CreateNewTab(name string) {
	var engine, err = models.GetSqLiteEngine()
	if err == nil {
		var tab = &Tab{Name: name}
		engine.Insert(tab)
	}
}

func CloseTab(id int64) {
	models.BasePhyDel(id, &Tab{})
}

func CloseTabMul(ids []int64) {
	var engine, err = models.GetSqLiteEngine()
	if err == nil {
		engine.In("id", ids).Delete(&Tab{})
	}
}

func RenameTab(newName string, id int64) {
	models.BaseRename(newName, id, &Tab{})
}

func DuplicateTab(id int64) {
	var engine, err = models.GetSqLiteEngine()
	if err == nil {
		var current = &Tab{}
		engine.ID(id).Get(current)
		current.Id = 0
		current.Name = current.Name + " copy"
		engine.Insert(current)
	}
}
