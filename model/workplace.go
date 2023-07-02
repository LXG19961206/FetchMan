package model

type WorkPlace struct {
	Id        int    `db:"INTEGER PRIMARY KEY AUTOINCREMENT" name:"id" json:"id"`
	Name      string `db:"VARCHAR(128) NULL" name:"name" json:"name"`
	IsCurrent bool   `db:"BOOLEAN NULL" name:"is_current" json:"is_current"`
}
