package request

import "changeme/models"

type RequestRecord struct {
	models.BaseFields `xorm:"extends"`
	CollectionId      int64          `json:"collectionId"`
	Url               string         `json:"url"`
	OriginUrl         string         `json:"originUrl"`
	Method            string         `json:"method"`
	Headers           map[string]any `json:"headers"`
	ContentType       string         `json:"contentType"`
	BodyId            int64          `json:"bodyId"`
	RespId            int64          `json:"respId"`
	Body              string         `json:"body"`
}

func init() {
	models.CheckOrAppendTable(new(RequestRecord))
}
