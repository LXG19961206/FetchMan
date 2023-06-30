package model

type RespRecord struct {
	Url         string `db:"TEXT NULL" name:"url" json:"url"`
	Method      string `db:"VARCHAR(32) NULL" name:"method" json:"method"`
	Id          int    `db:"INTEGER PRIMARY KEY AUTOINCREMENT" name:"id" json:"id"`
	Status      string `db:"VARCHAR(128) NULL" name:"status" json:"status"`
	StatusCode  int    `db:"INTEGER NULL" name:"status_code" json:"status_code"`
	Headers     string `db:"TEXT NULL" name:"headers" json:"header"`
	ContentType string `db:"VARCHAR(128) NULL" name:"content_type" json:"ContentType"`
	BodyId      any    `db:"INTEGER NULL" name:"body_id" json:"bodyId"`
	ReqId       int    `db:"INTEGER NULL" name:"req_id" json:"reqId"`
	CostTime    int    `db:"INTEGER NULL" name:"cost_time" json:"costTime"`
	CreateTime  string `db:"DATE NULL" name:"create_time" json:"createTime"`
}

type AppResp struct {
	StatusCode int
	Status     string
	Headers    [][2]string
	Body       interface{}
	ReqHeaders [][2]string
}
