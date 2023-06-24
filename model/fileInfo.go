package model

type FileInfo struct {
	Path        string
	ContentType string
	Id          int
	File        []byte
	FileName    string
}
