package handlehttp

import (
	"bytes"
	"fmt"
	"net/http"
)

func SaveRequest(
	req *http.Request,
	isBinary bool,
	isFormData bool,
	originBody bytes.Buffer,
) {

	fmt.Printf("req: %v\n", req)
	fmt.Printf("isBinary: %v\n", isBinary)
	fmt.Printf("isFormData: %v\n", isFormData)
	fmt.Printf("originBody: %v\n", originBody)

}

func SaveResp(req *http.Response) {
}
