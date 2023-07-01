package request

import (
	"bytes"
	"changeme/model"
	"changeme/service/file"
	"github.com/labstack/gommon/log"
	"io"
	"mime/multipart"
	"strings"
)

const (
	None       = "none"
	JsonType   = "json"
	TextType   = "text"
	FormType   = "x-www-form-urlencoded"
	FormData   = "formData"
	HtmlType   = "html"
	XmlType    = "xml"
	BinaryType = "binary"
)

const (
	ContentType = "Content-Type"
)

func BodyHandler(body model.ReqBody) (io.Reader, string) {

	switch body.Type {
	case None:
		return nil, ""
	case FormData:
		var buf = new(bytes.Buffer)
		writer := multipart.NewWriter(buf)
		for _, formItem := range body.FormData {
			if len(formItem.Value) == 0 {
				continue
			}
			if formItem.Type == BinaryType && len(formItem.Name) > 0 {
				fileInfo := file.GetFileInfo(formItem.FilePath)
				fileWriter, _ := writer.CreateFormFile(formItem.Name, fileInfo.FileName)
				_, _ = fileWriter.Write(fileInfo.File)
			} else {
				_ = writer.WriteField(formItem.Name, formItem.Value)
			}
		}
		defer func() {
			_ = writer.Close()
		}()

		return buf, writer.FormDataContentType()

	case BinaryType:
		var cache = file.LastFileCache
		var fileHitCache = body.FileId == cache.Id && body.FilePath == cache.Path
		var bin []byte
		if fileHitCache {
			bin = cache.File
		} else {
			bin = file.GetFileInfo(body.FilePath).File
		}
		var reader io.Reader
		reader = bytes.NewReader(bin)
		return reader, ""

	default:
		log.Info(body.Value)
		return strings.NewReader(body.Value), ""
	}

}
