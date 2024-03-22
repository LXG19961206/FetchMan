package handlehttp

import (
	"net/http"
	"strings"

	"github.com/samber/lo"
)

func CopyHeaders(originRespWriter http.ResponseWriter, headers http.Header) {
	if len(headers) == 0 {
		return
	}
	for key, value := range headers {
		originRespWriter.Header().Set(key, value[0])
	}
}

func CreateRealValueHeaders(header http.Header, envMap map[string]string) http.Header {
	var realHeader = map[string][]string{}
	for key, value := range header {
		var partly = lo.Map[string](value, func(partValue string, idx int) string {
			return ReplaceVarWithItsRealValue(partValue, envMap)
		})
		realHeader[key] = partly
	}
	return realHeader
}

func TransHeaders(headers map[string]string) http.Header {
	var retHeaders = map[string][]string{}
	for key, value := range headers {
		retHeaders[key] = strings.Split(value, ",")
	}
	return retHeaders
}

func TransBackHeaders(headers http.Header, recordHeader map[string]string) map[string]string {
	var retHeaders = map[string]string{}
	for key, value := range headers {
		if str, has := recordHeader[key]; has && IsVar(str) {
			retHeaders[key] = str
			continue
		}
		retHeaders[key] = strings.Join(value, ",")
	}
	return retHeaders
}
