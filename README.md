
<p align="center">
  <a href="#"><img src="/doc/screenshot.png" width="80%"/></a>
</p>

Databag is a self-hosting network for the DWeb community, implementing the IndiCom messaging service. Notable features include:
- A databag node can host multiple accounts for a family or company.
- Public-private key based identity and not bound to any blockchain or hosting domain.
- Direct communication between app and contact's node with no server-side replication.
- Data revision trees for effient syncrhonization.
- Websockets for delivering synchronization events.

You can test out the project [here](https://databag.coredb.org/#/create), but don't post anything important as the server is regularly wiped.

### Installation

To use databag, you will need a DNS name pointing to your node with a certificate. You can deloy a node manually, but you will have a much easier time using a container service. For my self-hosting setup, I use Portainer with Nginx Proxy Manager running on an Intel Nuc. As a reslt the docker image I have built is for [amd64](https://hub.docker.com/u/balzack)
