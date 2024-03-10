package env

import "changeme/models"

type Env struct {
	models.BaseFields `xorm:"extends"`
	Name              string `json:"name"`
	IsCurrent         bool   `json:"isCurrent"`
	CreaterId         int64  `json:"createrId"`
}

type Vars struct {
	models.BaseFields `xorm:"extends"`
	EnvId             int64  `json:"envId"`
	Value             string `xorm:"text" json:"value"`
	InitialValue      string `xorm:"text" json:"initialValue"`
	Name              string `xorm:"varchar(64)" json:"name"`
}

func init() {
	models.CheckOrAppendTable(&Vars{})
	models.CheckOrAppendTable(&Env{})
}
