package handlehttp

import (
	"bytes"
	"changeme/config"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/textproto"
	"os"
	"strings"
)

type FormDataItem struct {
	Name     string
	Value    string
	FilePath string
	File     io.Reader
}

func GenerateRealBody(
	header http.Header,
	bodyBuffer bytes.Buffer,
	isFormData bool,
	isBinary bool,
) io.Reader {

	if isBinary {
		var path = strings.Split((bodyBuffer.String()), config.AppConfigForClient.FilePlaceholderPath)[1]
		if file, err := os.Open(path); err == nil {
			defer file.Close()
			return file
		}
		return nil
	} else if isFormData {
		var buf = &bytes.Buffer{}
		writer := multipart.NewWriter(buf)
		var formData = []FormDataItem{}
		json.Unmarshal(bodyBuffer.Bytes(), &formData)
		for _, formItem := range formData {
			if len(formItem.Name) == 0 || (len(formItem.Value) == 0 && len(formItem.FilePath) == 0) {
				continue
			}
			if formItem.FilePath != "" && strings.Contains(formItem.FilePath, config.AppConfigForClient.FilePlaceholderPath) {
				var path = strings.Split(formItem.FilePath, config.AppConfigForClient.FilePlaceholderPath)[1]
				if file, err := os.Open(path); err == nil {
					var info, _ = file.Stat()
					var formItemHeader = make(textproto.MIMEHeader)
					var fileBuf = bytes.Buffer{}
					io.Copy(&fileBuf, file)
					var bytes = fileBuf.Bytes()
					var fileContentType = http.DetectContentType(bytes)
					formItemHeader.Set("Content-Type", fileContentType)
					formItemHeader.Set("Content-Disposition", fmt.Sprintf(`form-data; name="%s"; filename="%s"`, formItem.Name, info.Name()))
					var part, _ = writer.CreatePart(formItemHeader)
					// fileWriter, _ := writer.CreateFormFile(formItem.Name, path)
					part.Write(bytes)
					file.Close()
				} else {
					fmt.Printf("err: %v\n", err)
				}
			} else {
				_ = writer.WriteField(formItem.Name, formItem.Value)
			}
		}
		var contentType = writer.FormDataContentType()
		writer.Close()
		header.Set("Content-Type", contentType)
		return buf
	} else {
		return bytes.NewReader(bodyBuffer.Bytes())
	}
}
