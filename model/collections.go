package model

type Collections struct {
	Id int `db:"INTEGER PRIMARY KEY AUTOINCREMENT" name:"id" json:"id"`

	Name string `db:"VARCHAR(64) NULL" name:"name" json:"name"`

	Type string `db:"VARCHAR(64) NULL" name:"type" json:"type"`

	ParentId int `db:"INTEGER NULL" name:"parent_id" json:"parent_id"`
}
