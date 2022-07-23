
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
