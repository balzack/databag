package repeater

import (
	"encoding/json"
	"log"
  "context"
	"net/http"
	"os"
	"runtime"
	"strings"
  "fmt"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
)

func ParseRequest(r *http.Request, w http.ResponseWriter, obj interface{}) error {
        r.Body = http.MaxBytesReader(w, r.Body, 1024)
        dec := json.NewDecoder(r.Body)
        return dec.Decode(&obj)
}

func WriteResponse(w http.ResponseWriter, v interface{}) {
	body, err := json.Marshal(v)
	if err != nil {
		_, file, line, _ := runtime.Caller(1)
		p, _ := os.Getwd()
		log.Printf("%s:%d %s", strings.TrimPrefix(file, p), line, err.Error())
		w.WriteHeader(http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.Write(body)
	}
}

//Notify proxies push notification to device
func Notify(w http.ResponseWriter, r *http.Request) {
  app, err := firebase.NewApp(context.Background(), nil)
  if err != nil {
    log.Fatalf("error initializing app: %v\n", err)
  }

  ctx := context.Background()
	client, err := app.Messaging(ctx)
	if err != nil {
		log.Fatalf("error getting Messaging client: %v\n", err)
	}

	        var msg PushMessage
        if err := ParseRequest(r, w, &msg); err != nil {
                ErrResponse(w, http.StatusBadRequest, err)
                return
        }

	// See documentation on defining a message payload.
  notification := &messaging.Notification{ Title: msg.Title, Body: msg.Body }
	message := &messaging.Message{
    Notification : notification,
		Token: msg.Token,
	}

	// Send a message to the device corresponding to the provided
	// registration token.
	response, err := client.Send(ctx, message)
	if err != nil {
		log.Fatalln(err)
	}
	// Response is a message ID string.
	fmt.Println("Successfully sent message:", response)

	res := &PushResponse{ Message: response }
	WriteResponse(w, res);
}
