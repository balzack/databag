<div align="center">
  <a href="#"><img src="/doc/icon.png" width="8%" style="border-radius:50%"></a>
  <h3 align="center">Databag</h3>
  <p align="center">Communication for the Decentralized Web</p>
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

Databag is a self-hosted messaging service. Notable features include:
- Public-private key based identity (not bound to any blockchain or hosting domain)
- Federated (accounts on different nodes can communicate)
- Topic based threads (messages organized by topic not contacts)
- Lightweight (server runs on a raspberry pi zero v1.3)
- Decentralized (direct communication between app and contact's node)
- Low latency (use of websockets for push events to avoid polling)
- Responsive (renders well in phone, tablet and pc)
- Unlimited accounts per node (host for your whole family)
- Mobile alerts (push notifications on new contacts and messages)

<br>
<p align="center">
  <a href="https://apps.apple.com/us/app/databag/id6443741428">
    <img src="/doc/astore.png" width="15%">
  </a>
  <a href="https://play.google.com/store/apps/details?id=com.databag">
    <img src="/doc/gplay.png" width="15%">
  </a>
</p>

The app is available in the google and apple stores. You can also test out the project [here](https://databag.coredb.org/#/create), but don't post anything important as this server is regularly wiped. Feedback on the UI/UX, bugs or features is greatly appreciated.

## Installation

To use databag, you will need a DNS name pointing to your node with a certificate. You can deploy a node manually, but you will have a much easier time using a container service. Containers for arm64 and amd64 are available [here](https://hub.docker.com/r/balzack/databag/tags). 

### Example with Portainer and Nginx Proxy Manager

From Portainer:
  - In the container view, click add container:
    - In the 'Image' field enter 'balzack/databag:latest'
    - Click 'publish a new network port', and select port 7000 for both host and container
    - Under 'Advanced container settings', select 'Env', and click 'Add Environment Variable'
      - Enter 'Name' as 'ADMIN' and your admin password [password]
    - Click 'Deploy the Container'

From Nginx Proxy Manager:
  - Add a host and specify:
    - Hostname [hostname.domain]
    - Portainer IP address [address]
    - Port '7000'
    - Request new SSL certificate

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

Instruction for installing without a container on a Raspberry Pi Zero are [here](/doc/pizero.md).

Instruction for installing without a container in AWS are [here](/doc/aws.md).
