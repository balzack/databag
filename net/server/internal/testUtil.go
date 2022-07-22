package databag

import (
	"bytes"
	"encoding/json"
	"errors"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strconv"
	"strings"
	"time"
)

const testReadDeadline = 2
const testRevisionWait = 100

type testCard struct {
	GUID    string
	Token   string
	CardID  string
	GroupID string
}

type testContact struct {
	GUID      string
	Token     string
	Revisions chan *Revision
	A         testCard
	B         testCard
	C         testCard
	D         testCard
}

type TestGroup struct {
	A testContact
	B testContact
	C testContact
	D testContact
}

func GetTestRevision(status chan *Revision) (rev *Revision) {
	time.Sleep(testRevisionWait * time.Millisecond)
	for {
		select {
		case r := <-status:
			rev = r
		default:
			return
		}
	}
}

func APITestData(
	endpoint func(http.ResponseWriter, *http.Request),
	requestType string,
	name string,
	params *map[string]string,
	body interface{},
	tokenType string,
	token string,
	start int64,
	end int64,
) (data []byte, hdr map[string][]string, err error) {

	var r *http.Request
	var w *httptest.ResponseRecorder

	if tokenType == APPTokenAgent {
		if !strings.Contains(name, "?") {
			name += "?"
		} else {
			name += "&"
		}
		name += "agent=" + token
	} else if tokenType == APPTokenContact {
		if !strings.Contains(name, "?") {
			name += "?"
		} else {
			name += "&"
		}
		name += "contact=" + token
	}

	if r, w, err = NewRequest(requestType, name, body); err != nil {
		return
	}
	if params != nil {
		r = mux.SetURLVars(r, *params)
	}
	if token != "" {
		r.Header.Add("TokenType", tokenType)
		SetBearerAuth(r, token)
	}
	if start != 0 || end != 0 {
		byteRange := "bytes=" + strconv.FormatInt(start, 10) + "-" + strconv.FormatInt(end, 10)
		r.Header.Add("Range", byteRange)
	}
	endpoint(w, r)

	resp := w.Result()
	if resp.StatusCode != 200 && resp.StatusCode != 206 {
		err = errors.New("response failed")
		return
	}
	hdr = resp.Header
	data, err = ioutil.ReadAll(resp.Body)
	return
}

func APITestMsg(
	endpoint func(http.ResponseWriter, *http.Request),
	requestType string,
	name string,
	params *map[string]string,
	body interface{},
	tokenType string,
	token string,
	response interface{},
	responseHeader *map[string][]string,
) (err error) {

	var r *http.Request
	var w *httptest.ResponseRecorder

	if tokenType == APPTokenAgent {
		if !strings.Contains(name, "?") {
			name += "?"
		} else {
			name += "&"
		}
		name += "agent=" + token
	} else if tokenType == APPTokenContact {
		if !strings.Contains(name, "?") {
			name += "?"
		} else {
			name += "&"
		}
		name += "contact=" + token
	}

	if r, w, err = NewRequest(requestType, name, body); err != nil {
		return
	}
	if params != nil {
		r = mux.SetURLVars(r, *params)
	}
	if tokenType != "" {
		r.Header.Add("TokenType", tokenType)
	}
	if token != "" {
		SetBearerAuth(r, token)
	}
	endpoint(w, r)

	resp := w.Result()
	if resp.StatusCode != 200 {
		err = errors.New("response failed")
		return
	}
	if responseHeader != nil {
		*responseHeader = resp.Header
	}
	if response == nil {
		return
	}
	dec := json.NewDecoder(resp.Body)
	dec.Decode(response)
	return
}

func APITestUpload(
	endpoint func(http.ResponseWriter, *http.Request),
	requestType string,
	name string,
	params *map[string]string,
	body []byte,
	tokenType string,
	token string,
	response interface{},
	responseHeader *map[string][]string,
) (err error) {

	data := bytes.Buffer{}
	writer := multipart.NewWriter(&data)
	part, err := writer.CreateFormFile("asset", "asset")
	if err != nil {
		return err
	}
	part.Write(body)
	if err = writer.Close(); err != nil {
		return
	}

	if tokenType == APPTokenAgent {
		if !strings.Contains(name, "?") {
			name += "?"
		} else {
			name += "&"
		}
		name += "agent=" + token
	} else if tokenType == APPTokenContact {
		if !strings.Contains(name, "?") {
			name += "?"
		} else {
			name += "&"
		}
		name += "contact=" + token
	}

	w := httptest.NewRecorder()
	r := httptest.NewRequest(requestType, name, &data)

	if params != nil {
		r = mux.SetURLVars(r, *params)
	}
	r.Header.Set("Content-Type", writer.FormDataContentType())
	endpoint(w, r)

	resp := w.Result()
	if resp.StatusCode != 200 {
		err = errors.New("response failed")
		return
	}
	if responseHeader != nil {
		*responseHeader = resp.Header
	}
	if response == nil {
		return
	}
	dec := json.NewDecoder(resp.Body)
	dec.Decode(response)
	return
}

//
//    A --- connected,group               connected,group --- B
//    | \                                                    /|
//    |   requested,nogroup                  confirmed,group  |
//    |                                                       |
//     connected,group                                       ,
//                                  |
//                                --x--
//                                  |
//     connected,group                                       ,
//    |                                                       |
//    |  ,                                   pending,nogroup  |
//    |/                                                     \|
//    C --- connected,group               connected,group --- D
//

// AddTestGroup creates and connects test accounts for useCases
func AddTestGroup(prefix string) (*TestGroup, error) {
	var err error
	var rev *Revision
	var ws *websocket.Conn

	// allocate contacts
	g := &TestGroup{}
	if g.A.GUID, g.A.Token, err = addTestAccount(prefix + "A"); err != nil {
		return g, err
	}
	if g.B.GUID, g.B.Token, err = addTestAccount(prefix + "B"); err != nil {
		return g, err
	}
	if g.C.GUID, g.C.Token, err = addTestAccount(prefix + "C"); err != nil {
		return g, err
	}
	if g.D.GUID, g.D.Token, err = addTestAccount(prefix + "D"); err != nil {
		return g, err
	}

	// setup A
	if g.A.B.CardID, err = addTestCard(g.A.Token, g.B.Token); err != nil {
		return g, err
	}
	if err = openTestCard(g.A.Token, g.A.B.CardID); err != nil {
		return g, err
	}
	if g.A.B.GroupID, err = groupTestCard(g.A.Token, g.A.B.CardID); err != nil {
		return g, err
	}
	if g.A.C.CardID, err = addTestCard(g.A.Token, g.C.Token); err != nil {
		return g, err
	}
	if err = openTestCard(g.A.Token, g.A.C.CardID); err != nil {
		return g, err
	}
	if g.A.C.GroupID, err = groupTestCard(g.A.Token, g.A.C.CardID); err != nil {
		return g, err
	}
	if g.A.D.CardID, err = addTestCard(g.A.Token, g.D.Token); err != nil {
		return g, err
	}
	if err = openTestCard(g.A.Token, g.A.D.CardID); err != nil {
		return g, err
	}

	// setup B
	if g.B.A.CardID, err = addTestCard(g.B.Token, g.A.Token); err != nil {
		return g, err
	}
	if err = openTestCard(g.B.Token, g.B.A.CardID); err != nil {
		return g, err
	}
	if g.B.A.GroupID, err = groupTestCard(g.B.Token, g.B.A.CardID); err != nil {
		return g, err
	}
	if g.B.C.CardID, err = addTestCard(g.B.Token, g.C.Token); err != nil {
		return g, err
	}
	if g.B.C.GroupID, err = groupTestCard(g.B.Token, g.B.C.CardID); err != nil {
		return g, err
	}

	// setup C
	if g.C.D.CardID, err = addTestCard(g.C.Token, g.D.Token); err != nil {
		return g, err
	}
	if err = openTestCard(g.C.Token, g.C.D.CardID); err != nil {
		return g, err
	}
	if g.C.D.GroupID, err = groupTestCard(g.C.Token, g.C.D.CardID); err != nil {
		return g, err
	}
	if g.C.A.CardID, err = addTestCard(g.C.Token, g.A.Token); err != nil {
		return g, err
	}
	if err = openTestCard(g.C.Token, g.C.A.CardID); err != nil {
		return g, err
	}
	if g.C.A.GroupID, err = groupTestCard(g.C.Token, g.C.A.CardID); err != nil {
		return g, err
	}

	// setup D
	if g.D.C.CardID, err = addTestCard(g.D.Token, g.C.Token); err != nil {
		return g, err
	}
	if err = openTestCard(g.D.Token, g.D.C.CardID); err != nil {
		return g, err
	}
	if g.D.C.GroupID, err = groupTestCard(g.D.Token, g.D.C.CardID); err != nil {
		return g, err
	}
	if g.D.A.CardID, err = getCardID(g.D.Token, g.A.GUID); err != nil {
		return g, err
	}

	// get contact tokens
	if g.A.B.Token, err = getCardToken(g.A.Token, g.A.B.CardID); err != nil {
		return g, err
	}
	if g.B.A.Token, err = getCardToken(g.B.Token, g.B.A.CardID); err != nil {
		return g, err
	}
	if g.C.A.Token, err = getCardToken(g.C.Token, g.C.A.CardID); err != nil {
		return g, err
	}
	if g.C.D.Token, err = getCardToken(g.C.Token, g.C.D.CardID); err != nil {
		return g, err
	}
	if g.D.C.Token, err = getCardToken(g.D.Token, g.D.C.CardID); err != nil {
		return g, err
	}

	// connect websockets
	rev = &Revision{}
	if ws, err = StatusConnection(g.A.Token, rev); err != nil {
		return g, err
	}
	g.A.Revisions = make(chan *Revision, 64)
	g.A.Revisions <- rev
	go monitorStatus(ws, &g.A)
	rev = &Revision{}
	if ws, err = StatusConnection(g.B.Token, rev); err != nil {
		return g, err
	}
	g.B.Revisions = make(chan *Revision, 64)
	g.B.Revisions <- rev
	go monitorStatus(ws, &g.B)
	rev = &Revision{}
	if ws, err = StatusConnection(g.C.Token, rev); err != nil {
		return g, err
	}
	g.C.Revisions = make(chan *Revision, 64)
	g.C.Revisions <- rev
	go monitorStatus(ws, &g.C)
	rev = &Revision{}
	if ws, err = StatusConnection(g.D.Token, rev); err != nil {
		return g, err
	}
	g.D.Revisions = make(chan *Revision, 64)
	g.D.Revisions <- rev
	go monitorStatus(ws, &g.D)

	return g, nil
}

func monitorStatus(ws *websocket.Conn, contact *testContact) {
	var data []byte
	var dataType int
	var err error

	// reset any timeout
	ws.SetReadDeadline(time.Time{})

	// read revision update
	for {
		if dataType, data, err = ws.ReadMessage(); err != nil {
			LogMsg("failed to read status conenction")
			return
		}
		if dataType != websocket.TextMessage {
			LogMsg("invalid status data type")
			return
		}
		rev := &Revision{}
		if err = json.Unmarshal(data, rev); err != nil {
			LogMsg("invalid status data")
			return
		}
		contact.Revisions <- rev
	}
}

func getCardToken(account string, cardID string) (token string, err error) {
	var r *http.Request
	var w *httptest.ResponseRecorder
	var cardDetail CardDetail
	var cardProfile CardProfile
	vars := make(map[string]string)
	vars["cardID"] = cardID

	if r, w, err = NewRequest("GET", "/contact/cards/{cardID}/detail?agent="+account, nil); err != nil {
		return
	}
	r = mux.SetURLVars(r, vars)
	GetCardDetail(w, r)
	if err = ReadResponse(w, &cardDetail); err != nil {
		return
	}
	if cardDetail.Status != APPCardConnected {
		err = errors.New("card not connected")
		return
	}

	if r, w, err = NewRequest("GET", "/contact/cards/{cardID}/profile?agent="+account, nil); err != nil {
		return
	}
	r = mux.SetURLVars(r, vars)
	GetCardProfile(w, r)
	if err = ReadResponse(w, &cardProfile); err != nil {
		return
	}

	token = cardProfile.GUID + "." + cardDetail.Token
	return
}

func getCardID(account string, guid string) (cardID string, err error) {
	var r *http.Request
	var w *httptest.ResponseRecorder
	var cards []Card

	if r, w, err = NewRequest("GET", "/contact/cards?agent="+account, nil); err != nil {
		return
	}
	GetCards(w, r)
	if err = ReadResponse(w, &cards); err != nil {
		return
	}

	for _, card := range cards {
		if card.Data.CardProfile.GUID == guid {
			cardID = card.ID
			return
		}
	}
	err = errors.New("card not found")
	return
}

func groupTestCard(account string, cardID string) (groupID string, err error) {
	var r *http.Request
	var w *httptest.ResponseRecorder
	var subject *Subject
	var group Group
	var cardData CardData
	vars := make(map[string]string)

	// add new group
	subject = &Subject{
		DataType: "imagroup",
		Data:     "group data with name and logo",
	}
	if r, w, err = NewRequest("POST", "/share/groups?agent="+account, subject); err != nil {
		return
	}
	AddGroup(w, r)
	if err = ReadResponse(w, &group); err != nil {
		return
	}
	groupID = group.ID

	// set contact group
	if r, w, err = NewRequest("PUT", "/contact/cards/{cardID}/groups/{groupID}", nil); err != nil {
		return
	}
	vars["groupID"] = group.ID
	vars["cardID"] = cardID
	r = mux.SetURLVars(r, vars)
	SetBearerAuth(r, account)
	SetCardGroup(w, r)
	if err = ReadResponse(w, &cardData); err != nil {
		return
	}
	return
}

func openTestCard(account string, cardID string) (err error) {
	var r *http.Request
	var w *httptest.ResponseRecorder
	var msg DataMessage
	var card Card
	var vars = map[string]string{"cardID": cardID}
	var contactStatus ContactStatus

	// set to connecting state
	if r, w, err = NewRequest("PUT", "/contact/cards/{cardID}/status?agent="+account, APPCardConnecting); err != nil {
		return
	}
	r = mux.SetURLVars(r, vars)
	SetCardStatus(w, r)
	if err = ReadResponse(w, &card); err != nil {
		return
	}

	// get open message
	if r, w, err = NewRequest("GET", "/contact/cards/{cardID}/openMessage?agent="+account, nil); err != nil {
		return
	}
	r = mux.SetURLVars(r, vars)
	GetOpenMessage(w, r)
	if err = ReadResponse(w, &msg); err != nil {
		return
	}

	// set open message
	if r, w, err = NewRequest("PUT", "/contact/openMessage", msg); err != nil {
		return
	}
	SetOpenMessage(w, r)
	if err = ReadResponse(w, &contactStatus); err != nil {
		return
	}

	// update status if connected
	if contactStatus.Status == APPCardConnected {
		view := "viewRevision=" + strconv.FormatInt(contactStatus.ViewRevision, 10)
		article := "articleRevision=" + strconv.FormatInt(contactStatus.ArticleRevision, 10)
		channel := "channelRevision=" + strconv.FormatInt(contactStatus.ChannelRevision, 10)
		profile := "profileRevision=" + strconv.FormatInt(contactStatus.ProfileRevision, 10)
		if r, w, err = NewRequest("PUT", "/contact/cards/{cardID}/status?agent="+account+"&token="+contactStatus.Token+"&"+view+"&"+article+"&"+channel+"&"+profile, APPCardConnected); err != nil {
			return
		}
		r = mux.SetURLVars(r, vars)
		SetCardStatus(w, r)
		if err = ReadResponse(w, &card); err != nil {
			return
		}
	}
	return
}

func addTestCard(account string, contact string) (cardID string, err error) {
	var r *http.Request
	var w *httptest.ResponseRecorder
	var msg DataMessage
	var card Card

	// get A identity message
	if r, w, err = NewRequest("GET", "/profile/message?agent="+contact, nil); err != nil {
		return
	}
	GetProfileMessage(w, r)
	if err = ReadResponse(w, &msg); err != nil {
		return
	}

	// add A card in B
	if r, w, err = NewRequest("POST", "/contact/cards?agent="+account, &msg); err != nil {
		return
	}
	AddCard(w, r)
	if err = ReadResponse(w, &card); err != nil {
		return
	}
	cardID = card.ID
	return
}

func addTestAccount(username string) (guid string, token string, err error) {
	var r *http.Request
	var w *httptest.ResponseRecorder

	var access LoginAccess
	app := AppData{
		Name:        "Appy",
		Description: "A test app",
		URL:         "http://app.coredb.org",
	}
	var claim Claim
	var msg DataMessage
	var profile Profile
	var login = username + ":pass"

	// get account token
	if r, w, err = NewRequest("POST", "/admin/accounts?token=pass", nil); err != nil {
		return
	}
	AddNodeAccount(w, r)
	if err = ReadResponse(w, &access); err != nil {
		return
	}

	// set account profile
	if r, w, err = NewRequest("POST", "/account/profile", nil); err != nil {
		return
	}
	SetBearerAuth(r, access.AppToken)
	SetCredentials(r, login)
	AddAccount(w, r)
	if err = ReadResponse(w, &profile); err != nil {
		return
	}
	guid = profile.GUID

	// acquire new token for attaching app
	if r, w, err = NewRequest("POST", "/account/apps", &app); err != nil {
		return
	}
	SetBasicAuth(r, login)
	AddAccountApp(w, r)
	if err = ReadResponse(w, &access); err != nil {
		return
	}
	token = access.AppToken

	// authorize claim
	if r, w, err = NewRequest("PUT", "/authorize", "1234abcd"); err != nil {
		return
	}
	SetBearerAuth(r, token)
	Authorize(w, r)
	if err = ReadResponse(w, &msg); err != nil {
		return
	}
	signer, messageType, _, res := ReadDataMessage(&msg, &claim)
	if res != nil || signer != guid || messageType != APPMsgAuthenticate || claim.Token != "1234abcd" {
		err = errors.New("invalid authenticated claim")
		return
	}
	return
}

func NewRequest(rest string, path string, obj interface{}) (*http.Request, *httptest.ResponseRecorder, error) {
	w := httptest.NewRecorder()
	if obj != nil {
		body, err := json.Marshal(obj)
		if err != nil {
			return nil, nil, err
		}
		reader := strings.NewReader(string(body))
		return httptest.NewRequest(rest, path, reader), w, nil
	}

	return httptest.NewRequest(rest, path, nil), w, nil
}

// Websocket test support
type statusHandler struct{}

func (h *statusHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	Status(w, r)
}
func StatusConnection(token string, rev *Revision) (ws *websocket.Conn, err error) {
	var data []byte
	var dataType int

	// connect to websocket
	s := httptest.NewServer(&statusHandler{})
	wsURL, _ := url.Parse(s.URL)
	wsURL.Scheme = "ws"
	if ws, _, err = websocket.DefaultDialer.Dial(wsURL.String(), nil); err != nil {
		return
	}

	// send authentication
	announce := Announce{AppToken: token}
	if data, err = json.Marshal(&announce); err != nil {
		return
	}
	ws.WriteMessage(websocket.TextMessage, data)

	// read revision response
	ws.SetReadDeadline(time.Now().Add(testReadDeadline * time.Second))
	if dataType, data, err = ws.ReadMessage(); err != nil {
		return
	}
	if dataType != websocket.TextMessage {
		err = errors.New("invalid status data type")
		return
	}
	if err = json.Unmarshal(data, rev); err != nil {
		return
	}
	return
}
