package databag

import (
  "os"
  "log"
  "runtime"
  "strings"
  "errors"
  "encoding/json"
  "encoding/base64"
  "net/http"
  "net/http/httptest"
)

func WriteResponse(w http.ResponseWriter, v interface{}) {
  body, err := json.Marshal(v);
  if err != nil {
    _, file, line, _ := runtime.Caller(1)
    p, _ := os.Getwd()
    log.Printf("%s:%d %s", strings.TrimPrefix(file, p), line, err.Error())
    w.WriteHeader(http.StatusInternalServerError)
  } else {
    w.Write(body);
  }
}

func ReadResponse(w *httptest.ResponseRecorder, v interface{}) error {
  resp := w.Result()
  if resp.StatusCode != 200 {
    return errors.New("response failed");
  }
  if v == nil {
    return nil
  }
  dec := json.NewDecoder(resp.Body)
  dec.Decode(v)
  return nil
}

func NewRequest(rest string, path string, obj interface{}) (*http.Request, *httptest.ResponseRecorder, error) {
  w := httptest.NewRecorder()
  if(obj != nil) {
    body, err := json.Marshal(obj)
    if err != nil {
      return nil, nil, err
    }
    reader := strings.NewReader(string(body))
    return httptest.NewRequest(rest, path, reader), w, nil
  }

  return httptest.NewRequest(rest, path, nil), w, nil
}

func SetBasicAuth(r *http.Request, login string) {
  auth := base64.StdEncoding.EncodeToString([]byte(login))
  r.Header.Add("Authorization", "Basic " + auth)
}

func SetBearerAuth(r *http.Request, token string) {
  r.Header.Add("Authorization", "Bearer " + token)
}

func SetCredentials(r *http.Request, login string) {
  auth := base64.StdEncoding.EncodeToString([]byte(login))
  r.Header.Add("Credentials", "Basic " + auth)
}

func ParseRequest(r *http.Request, w http.ResponseWriter, obj interface{}) error {
  r.Body = http.MaxBytesReader(w, r.Body, APP_BODYLIMIT)
  dec := json.NewDecoder(r.Body)
  dec.DisallowUnknownFields()
  return dec.Decode(&obj)
}

