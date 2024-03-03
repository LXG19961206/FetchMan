package handlehttp

func init() {
	go StartServer()
	go StartFileServer()
}
