package response

import "changeme/models"

type RespRecord struct {
	models.BaseFields `xorm:"extends"`
	CollectionId      int64          `json:"collectionId"`
	ReqId             int64          `json:"reqId"`
	Url               string         `json:"url"`
	OriginUrl         string         `json:"originUrl"`
	Method            string         `json:"method"`
	Headers           map[string]any `json:"headers"`
	ContentType       string         `json:"contentType"`
	BodyId            int64          `json:"bodyId"`
	Body              string         `json:"body"`
}
