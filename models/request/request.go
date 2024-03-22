package request

import (
	"changeme/models"
)

type RequestRecord struct {
	models.BaseFields `xorm:"extends"`
	CollectionId      int64             `json:"collectionId"`
	Url               string            `xorm:"text" json:"url"`
	OriginUrl         string            `xorm:"text" json:"originUrl"`
	Method            string            `xorm:"varchar(32)" json:"method"`
	Headers           map[string]string `xorm:"text" json:"headers"`
	PreScript         string            `xorm:"text" json:"preScript"`
	PostTestScript    string            `xorm:"text" json:"postTestScript"`
	ContentType       string            `xorm:"varchar(255)" json:"contentType"`
	BodyId            int64             `json:"bodyId"`
	RespId            int64             `json:"respId"`
	Body              string            `xorm:"text" json:"body"`
	IsBinary          bool              `json:"isBinary"`
	IsFormData        bool              `json:"isFormData"`
	IsReferenced      bool              `json:"isReferenced"`
}

func init() {
	models.CheckOrAppendTable(new(RequestRecord))
}
