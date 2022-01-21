package databag

import (
  "testing"
)

func TestProfileNotification(t *testing.T) {

  // start notifcation thread
  go SendNotifications()

  access := AddTestContacts(t, "profilenotification", 2);
  contact := ConnectTestContacts(t, access[0], access[1])

  PrintMsg(access)
  PrintMsg(contact)

  // connect revision websocket for A

  // get profile revision of B

  // update profile of B

  // read revision message

  // check card increment

  // check B profile incremented

  // stop notification thread
  ExitNotifications()
}
