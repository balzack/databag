
[![contribute.design](https://contribute.design/api/shield/balzack/databag)](https://contribute.design/balzack/databag)

<div align="center">
  <a href="#"><img src="/doc/icon_v2.png" width="8%" style="border-radius:50%"></a>
  <h3 align="center">Databag</h3>
  <p align="center">A federated messenger for self-hosting</p>
</div>

<br>

<p align="center">
  <a href="/doc/mobile.png"><img src="/doc/mobile.png" width="48%"/></a>
  &nbsp;&nbsp;
  <a href="/doc/browser.png"><img src="/doc/browser.png" width="48%"/></a>
</p>
<p align="center">
  <sub>Mobile and Browser App Screens</sub>
</p>
<br>

Databag is designed for efficiency, consuming minimal resources on the host system and network. Notable features include:
- Decentralized (direct communication between app and server node)
- Federated (accounts on different nodes can communicate)
- Public-Private key based identity (not bound to any blockchain or hosting domain)
- End-to-End encryption (the hosting admin cannot view topics if sealed)
- Audio and Video Calls (nat traversal requires separate relay server)
- Topic based threads (messages organized by topic not contacts)
- Lightweight (server can run on a raspberry pi zero v1.3)
- Low latency (use of websockets for push events to avoid polling)
- Unlimited accounts per node (host for your whole family)
- Mobile alerts (push notifications on new contacts, messages, and calls)

<br>
<p align="center">
  <a href="https://apps.apple.com/us/app/databag/id6443741428">
    <img src="/doc/astore.png" width="18%">
  </a>
  <a href="https://play.google.com/store/apps/details?id=com.databag">
    <img src="/doc/gplay.png" width="18%">
  </a>
</p>

The app is available in the google and apple stores. You can also test out the project [here](https://databag.coredb.org/#/create), but don't post anything important as this server is regularly wiped. Feedback on the UI/UX, bugs or features is greatly appreciated.

## Installation

To use databag, you will need a DNS name pointing to your node with a certificate. You can deploy a node manually, but you will have a much easier time using a container service. Containers for arm64 and amd64 are available [here](https://hub.docker.com/r/balzack/databag/tags). 

### Docker Compose Command

From the net/container sub directory:
  - sudo docker-compose -f compose.yaml -p databag up

### Example with Portainer and Nginx Proxy Manager

From Portainer:
  - In the volume view, click add volumen:
    - Enter a name, then click 'Create the volume'
  - In the container view, click add container:
    - In the 'Image' field enter 'balzack/databag:latest'
    - Click 'publish a new network port', and select port 7000 for both host and container
    - Under 'Advanced container settings', select 'Env', and click 'Add Environment Variable'
      - Enter 'Name' as 'ADMIN' and your admin password [password]
    - Under 'Advanced container settings', select 'Volumes', then 'map additional volume'
      - Enter '/var/lib/databag' for 'container' and the created volume for 'volume'
    - Click 'Deploy the Container'

From Nginx Proxy Manager:
  - Add a host and specify:
    - Hostname [hostname.domain]
    - Portainer IP address [address]
    - Port '7000'
    - Request new SSL certificate

<details>
  <summary>Nginx Proxy config
➡️ Click to expand ⬅️
  </summary>

  ```
server {
  server_name your.site.tld;

location / {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
    proxy_pass http://127.0.0.1:7000;
    client_max_body_size 0;
    proxy_max_temp_file_size 0;

}

    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/your.site.tld/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your.site.tld/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    add_header Strict-Transport-Security "max-age=0";

}

server {
    if ($host = your.site.tld) {
        return 301 https://$host$request_uri;
    }
  listen 80;
  server_name your.site.tld;
    return 404;
}
```
</details>

From Your Browser:
  - Enter your server address in the address bar [hostname.domain]
    - Click the cog icon in the top right
    - Enter your admin password: [password]
    - Click the cog icon in the dashboard
      - Enter Federated Host as [hostname.domain]
      - Click 'Save'
    - Click the user icon to generate a new account link
      - Follow the link to create an account

### Other installation options

Install without a container on a Raspberry Pi Zero [here](/doc/pizero.md).

Install without a container in AWS [here](/doc/aws.md).

Integrate Databag in an OpenWrt firmware [here](/doc/openwrt.md).

1-click installs in [CapRover](https://caprover.com/), [CasaOS](https://casaos.io), [Unraid](https://unraid.net/), [Runtipi](https://www.runtipi.io/), [Kubero](https://www.kubero.dev/)

## Audio and Video Calls

Databag provides audio and video calling and relies on a STUN/TURN relay server for NAT traversal. Testing was done with both [cuturn](https://github.com/coturn/coturn) and [pion](https://github.com/pion/turn) and should work with any implementation. Instructions for installing a coturn server are provided [here](https://gabrieltanner.org/blog/turn-server/).

If you want to enable audio and video calls, you should setup your own relay server. For testing purposes you can however use the demo relay server configuration. In the admin configuration modal, set:
  - Enable WebRTC Calls: -switch on-
  - WebRTC Server URL: turn:34.210.172.114:3478?transport=udp
  - WebRTC Username: user
  - WebRTC Password: pass
