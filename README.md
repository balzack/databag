
<p align="center">
  <a href="#"><img src="/doc/screenshot.png" width="80%"/></a>
</p>

Databag is a self-hosting messaging service for the DWeb community. Notable features include:
- Public-private key based identity (not bound to any blockchain or hosting domain)
- Federated (accounts on different nodes can communicate)
- No server-side replication (direct communication between app and contact's node)
- Low latency (use of websockets for push events to avoid polling)
- Unlimited accounts per node (host for your whole family)

You can test out the project [here](https://databag.coredb.org/#/create), but don't post anything important as this server is regularly wiped. Feedback on the UI/UX, bugs or features is greatly appreciated.

### Installation

To use databag, you will need a DNS name pointing to your node with a certificate. You can deloy a node manually, but you will have a much easier time using a container service. Containers for arm64 and amd64 are available [here](https://hub.docker.com/r/balzack/databag/tags)

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
