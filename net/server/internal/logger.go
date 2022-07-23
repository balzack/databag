package databag

import (
	"github.com/kr/pretty"
	"log"
	"net/http"
	"os"
	"runtime"
	"strings"
	"time"
)

//Logger prints endpoint details
func Logger(inner http.Handler, name string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		inner.ServeHTTP(w, r)

		log.Printf(
			"%s %s %s %s",
			r.Method,
			r.RequestURI,
			name,
			time.Since(start),
		)
	})
}

//ErrResponse prints detailed error event and sets response
func ErrResponse(w http.ResponseWriter, code int, err error) {
	if err != nil {
		_, file, line, _ := runtime.Caller(1)
		p, _ := os.Getwd()
		log.Printf("%s:%d %s", strings.TrimPrefix(file, p), line, err.Error())
	}
	w.WriteHeader(code)
}

//ErrMsg prints detailed error event
func ErrMsg(err error) {
	if err != nil {
		_, file, line, _ := runtime.Caller(1)
		p, _ := os.Getwd()
		log.Printf("%s:%d %s", strings.TrimPrefix(file, p), line, err.Error())
	}
}

//LogMsg prints detailed error string
func LogMsg(msg string) {
  _, file, line, _ := runtime.Caller(1)
  p, _ := os.Getwd()
  log.Printf("%s:%d %s", strings.TrimPrefix(file, p), line, msg)
}

//PrintMsg prints debug message
func PrintMsg(obj interface{}) {
	pretty.Println(obj)
}
