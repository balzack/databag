package databag

import (
    "log"
    "net/http"
    "time"
    "os"
    "runtime"
    "strings"
    "github.com/kr/pretty"
)

var hideLog bool = false
func SetHideLog(hide bool) {
  hideLog = hide
}

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

func ErrResponse(w http.ResponseWriter, code int, err error) {
  if !hideLog && err != nil {
    _, file, line, _ := runtime.Caller(1)
    p, _ := os.Getwd()
    log.Printf("%s:%d %s", strings.TrimPrefix(file, p), line, err.Error())
  }
  w.WriteHeader(code)
}

func ErrMsg(err error) {
  if !hideLog && err != nil {
    _, file, line, _ := runtime.Caller(1)
    p, _ := os.Getwd()
    log.Printf("%s:%d %s", strings.TrimPrefix(file, p), line, err.Error())
  }
}

func LogMsg(msg string) {
  if !hideLog {
    _, file, line, _ := runtime.Caller(1)
    p, _ := os.Getwd()
    log.Printf("%s:%d %s", strings.TrimPrefix(file, p), line, msg)
  }
}

func PrintMsg(obj interface{}) {
  pretty.Println(obj);
}
