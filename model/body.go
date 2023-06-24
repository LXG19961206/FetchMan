package model

type Body struct {
	Id         int    `db:"INTEGER PRIMARY KEY AUTOINCREMENT" name:"id" json:"id"`
	FilePath   string `db:"TEXT NULL" name:"file_path" json:"filePath"`
	CreateTime string `db:"DATE NULL" name:"create_time" json:"createTime"`
	SaveAsText bool   `db:"INTEGER NULL" name:"sava_as_text" json:"saveAsText"`
}
