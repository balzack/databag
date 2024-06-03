package databag

import (
  "encoding/json"
  "net/http"
  "errors"
  "bytes"
  "strings"
)

func getIce(service string, urls string, username string, credential string) ([]IceURL, error) {

  if service != "" {
    gen := "https://rtc.live.cloudflare.com/v1/turn/keys/" + username + "/credentials/generate"
    req, err := http.NewRequest(http.MethodPost, gen, bytes.NewBuffer([]byte("{\"ttl\": 86400}")))
    if err != nil {
      return nil, err
    }
    req.Header.Set("Content-Type", "application/json; charset=utf-8")
    req.Header.Set("Authorization", "Bearer " + credential)
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil || resp == nil || resp.StatusCode != 201 {
      return nil, errors.New("invalid ice service response")
    }

    var r IceService
    err = json.NewDecoder(resp.Body).Decode(&r)
    if err != nil {
      return nil, errors.New("invalid ice service response")
    }

    ice := []IceURL{}
    for _, url := range r.Servers.URLs {
      ice = append(ice, IceURL{ URLs: url, Username: r.Servers.Username, Credential: r.Servers.Credential });
    }
    return ice, nil
  }

  return []IceURL {
    IceURL {
      URLs: urls,
      Username: username,
      Credential: credential,
    },
  }, nil
}

func getDefaultIce(ice []IceURL) IceURL {
  for _, url := range ice {
    if strings.HasSuffix(url.URLs, "?transport=udp") {
      return url
    }
  }
  return ice[0];
}

