package repeater

//PushMessage notification
type PushMessage struct {
  Title string `json:"title"`
  Body string `json:"body"`
  Token string `json:"token"`
}

//PushResponse notification response
type PushResponse struct {
  Message string `json:"message"`
}

