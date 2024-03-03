package handlehttp

import "net/http"

func HanleClientCors(w http.ResponseWriter, r *http.Request) (http.ResponseWriter, bool) {

	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Headers", "*")
	w.Header().Add("Access-Control-Allow-Methods", "*")

	var isOption = r.Method == http.MethodOptions

	if isOption {
		w.WriteHeader(http.StatusOK)
	}

	return w, isOption

}
