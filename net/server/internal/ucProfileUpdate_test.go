package databag

import (
	"bytes"
	"encoding/base64"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestProfileUpdate(t *testing.T) {
	param := map[string]string{}
	var msg DataMessage
	var card Card
	var bProfileRev int64
	var bCardRev int64
	var cProfileRev int64
	var cCardRev int64
	var profile Profile
	var data []byte
	var img []byte
	var hdr map[string][]string

	// setup testing group
	set, err := AddTestGroup("updateprofile")
	assert.NoError(t, err)

	// setup testing group
	_, ret := AddTestGroup("updateprofile")
	assert.Error(t, ret)

	// reset revision
	bCardRev = GetTestRevision(set.B.Revisions).Card
	cCardRev = GetTestRevision(set.C.Revisions).Card
	param["cardID"] = set.B.A.CardID
	assert.NoError(t, APITestMsg(GetCard, "GET", "/contact/cards/{cardID}",
		&param, nil,
		APPTokenAgent, set.B.Token, &card, nil))
	bProfileRev = card.Data.NotifiedProfile
	param["cardID"] = set.C.A.CardID
	assert.NoError(t, APITestMsg(GetCard, "GET", "/contact/cards/{cardID}",
		&param, nil,
		APPTokenAgent, set.C.Token, &card, nil))
	cProfileRev = card.Data.NotifiedProfile

	// update A profile
	profileData := &ProfileData{
		Name:        "Namer",
		Location:    "San Diago",
		Description: "databaggerr",
	}
	assert.NoError(t, APITestMsg(SetProfile, "PUT", "/profile/data",
		nil, profileData,
		APPTokenAgent, set.A.Token, &profile, nil))
	assert.Equal(t, "databaggerr", profile.Description)

	// recv websocket event
	assert.NotEqual(t, bCardRev, GetTestRevision(set.B.Revisions).Card)
	assert.NotEqual(t, cCardRev, GetTestRevision(set.C.Revisions).Card)

	// check B notified
	param["cardID"] = set.B.A.CardID
	assert.NoError(t, APITestMsg(GetCard, "GET", "/contact/cards/{cardID}",
		&param, nil,
		APPTokenAgent, set.B.Token, &card, nil))
	assert.NotEqual(t, bProfileRev, card.Data.NotifiedProfile)
	assert.NotEqual(t, card.Data.ProfileRevision, card.Data.NotifiedProfile)

	// check C notified
	param["cardID"] = set.C.A.CardID
	assert.NoError(t, APITestMsg(GetCard, "GET", "/contact/cards/{cardID}",
		&param, nil,
		APPTokenAgent, set.C.Token, &card, nil))
	assert.NotEqual(t, cProfileRev, card.Data.NotifiedProfile)
	assert.NotEqual(t, card.Data.ProfileRevision, card.Data.NotifiedProfile)

	// sync profile
	assert.NoError(t, APITestMsg(GetProfileMessage, "GET", "/profile/message",
		nil, nil,
		APPTokenContact, set.B.A.Token, &msg, nil))
	assert.NoError(t, APITestMsg(AddCard, "POST", "/contact/cards",
		nil, &msg,
		APPTokenAgent, set.B.Token, &card, nil))
	assert.Equal(t, card.ID, set.B.A.CardID)
	assert.Equal(t, card.Data.ProfileRevision, card.Data.NotifiedProfile)
	assert.Equal(t, card.Data.CardProfile.Name, "Namer")

	// sync profile
	assert.NoError(t, APITestMsg(GetProfileMessage, "GET", "/profile/message",
		nil, nil,
		APPTokenContact, set.C.A.Token, &msg, nil))
	assert.NoError(t, APITestMsg(AddCard, "POST", "/contact/cards",
		nil, &msg,
		APPTokenAgent, set.C.Token, &card, nil))
	assert.Equal(t, card.ID, set.C.A.CardID)
	assert.Equal(t, card.Data.ProfileRevision, card.Data.NotifiedProfile)
	assert.Equal(t, card.Data.CardProfile.Name, "Namer")

	// set profile image
	image := "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"
	assert.NoError(t, APITestMsg(SetProfileImage, "PUT", "/profile/image",
		nil, image,
		APPTokenAgent, set.A.Token, &profile, nil))

	// retrieve profile image
	data, hdr, err = APITestData(GetProfileImage, "GET", "/profile/image?agent="+set.A.Token, nil, nil,
		APPTokenAgent, set.A.Token, 0, 0)
	assert.NoError(t, err)

	// compare retrieved image
	assert.Equal(t, "image/png", hdr["Content-Type"][0])
	img, err = base64.StdEncoding.DecodeString(image)
	assert.NoError(t, err)
	assert.Zero(t, bytes.Compare(img, data))
}
