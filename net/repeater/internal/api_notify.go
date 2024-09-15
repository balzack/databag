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

	// This registration token comes from the client FCM SDKs.
	registrationToken := "dKYLg8VpRGiYciBtuh_Wrs:APA91bEvpRVQscGZuVK8ynYRT_3ZJLuZJKVm705deeVd7EMe6ISok3hqXLNuVKbSR0Ck0EyxYyOoAKgOQY--MU7AacWtvU3qbnTEZ6Df-ZoO61NVGziZ5TBacLjiy9YoLcqCrxvYy2yp"

	// See documentation on defining a message payload.
  notification := &messaging.Notification{ Title: "TEST TITLE", Body: "TEST BODY" }
	message := &messaging.Message{
    Topic: "news",
    Notification : notification,
		Token: registrationToken,
	}

	// Send a message to the device corresponding to the provided
	// registration token.
	response, err := client.Send(ctx, message)
	if err != nil {
		log.Fatalln(err)
	}
	// Response is a message ID string.
	fmt.Println("Successfully sent message:", response)

	WriteResponse(w, nil)
}
