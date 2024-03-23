 # Databag Design Overview

With all the wonderful things technology provides, it also has its darker side. Technology is increasingly used to violate our privacy and manipulate our beliefs and actions. End-to-end encryption has become standard and restores some of that privacy, but only addresses part of the problem. Self-hosting goes much further in providing true [self-sovereignty](https://www.lifewithalacrity.com/article/the-path-to-self-soverereign-identity/#ten-principles-of-self-sovereign-identity) while allowing technology to grow in a way that is beneficial to everyone. 

Self-hosting involves running your own server to host a variety of services. These services can also be made available to friends and family. While self-hosting is gaining traction, it still remains mostly limited to those that are very technical. Without reaching the average person the impact and benefit of self-hosting also remains limited.

Databag hopes to break the technological barrier by supporting consumer electronics. Ideally a person can simply purchase a device much like a router, plug it in and be up and running. These devices are generally inexpensive with limited resources and run on home area networks. The Databag service is therefore designed to be highly efficient in terms of the hosting resources.

## Components

Within the Databag system, clients connect to nodes with both a websocket and a REST API. The websocket is used to communicate events while the REST API transfers the content. The nodes also communicate events between each other over a notification connection. However, importantly no content is synchronized between nodes.

<div align="center">
  <a href="#"><img src="/doc/overview_fig1.png" width="50%" style="border-radius:50%"></a>
</div>

When a subject posts data that is shared with another contact to the subject’s node:
1. Subject’s node receives the data from the subject’s client over the REST API.
2. Subject’s node notifies the contact’s node over the Notification Endpoint.
3. Contact’s node notifies the contact’s client over the Websocket connection.
4. Contact’s client pulls the new data from the subject’s node over the REST API.

## Data Model

The Databag service only defines a relationship structure which determines how data is synchronized and shared. The format of the data is left abstract to be defined by the applications. Below the core data objects and their sharing relationships are illustrated.

<div align="center">
  <a href="#"><img src="/doc/overview_fig2.png" width="50%" style="border-radius:50%"></a>
</div>

- Profile: describes the account holder and can be publicly shared
- Card: a reference to another account in the network
- Alias: a list of cards to facilitate sharing
- Channel: a collection of data shared with a list of aliases and cards. A contact can query the node and pull the list of channels for which they have access.
- Topic: data associated with a channel; posted by the account holder or shared contact and can have attached assets. A contact can retrieve all topics of a channel they have access to as well as add new topics to that channel.
- Comment: data associated with a topic; posted by the account holder or shared contact. A contact can retrieve all comments of a topic they have access to as well as add new comments to that topic.
- Attribute: data posted by the account holder and shared with a list of aliases

The data objects all maintain revisions that allow for efficient synchronization between client and server. For a given account, all channels and their data are governed by the same revision counter. If the current channel revision counter has a value of X, and a new topic is posted. The new topic will have a revision of X+1, and the associated channel will get the value of X+1. A client, who was synchronized to a revision of X can then request all channels with a revision greater than X, and retrieve the updated channel. Then the client can request all topics of the given channel with a revision greater than X and retrieve the new topic. This concept of a revision counter is maintained for the profile, cards, aliases, and attributes as well.

<div align="center">
  <a href="#"><img src="/doc/overview_fig3.png" width="50%" style="border-radius:50%"></a>
</div>

The revision mechanism allows for the efficient synchronization for both new and updated data. Deleting data however requires an additional concept to indicate the data is no longer present. This is done by composing any data record as both a slot and value. Records store the revision as part of the slot and can have empty values when the data is deleted. When this happens, the client will synchronize the updated record according to the revisions, and seeing an empty value will determine the data was deleted.

## Identity

While the profile describes the account holder, the identity is determined by a public/private key. Regardless of what may be stored in the profile, a fingerprint of the public key uniquely identifies the account. At account creation time a key pair is generated which becomes the identity of the account for its lifetime. The private key never leaves the server and all signing of data happens within the server.

<div align="center">
  <a href="#"><img src="/doc/overview_fig4.png" width="40%" style="border-radius:50%"></a>
</div>

The discovery of other contacts in the system is achieved through a signed profile message. When enabled the profile message can be accessed through a public endpoint on the node. One of the fields in the profile is the public key fingerprint so the receiving client and server can verify the integrity of the profile. When a new profile message is received at the node, a new card object is created with the profile contents for future reference.

## Access Tokens

Databag clients are used to access a subject’s account. When a client authenticates on behalf of the subject, a unique token is generated at the server and returned to the client. Internally this token is referred to as the agent token, and is included on all communication between the client and the account hosted on the subject’s node. Any account may have multiple clients actively connected.

<div align="center">
  <a href="#"><img src="/doc/overview_fig5.png" width="60%" style="border-radius:50%"></a>
</div>

Connected contacts also have access to shared attributes and channels, but this is done through a different contact token. Contact connection is established through a mutual exchange of signed connect messages. The connect message contains the profile details, but also a token for incoming requests from that contact. The token is stored in the card for all future interactions with that contact.

## E2E Encryption

End-to-End encryption is a requirement of any modern communication system. The content within the system is encrypted and decrypted only by the clients. As a result the hosting admin cannot view the content. This is valuable even in the case of self-hosting as it protects the content in the case of a compromised server.

The E2E algorithm implemented in Databag follows the approach of web servers, where a public key is distributed and used to encrypt a symmetric key which in turn encrypts the content from end to end. Other communication systems implement a more sophisticated algorithm providing forward-secrecy. While forward-secrecy is generally desirable it does come with some restrictions. Also, the content in the Databag system only resides on the hosting node, reducing the need for forward-secrecy. For these reasons the more flexible E2E algorithm is implemented.

E2E encryption keys are generated within the client as a public/private key pair, referred to as the sealing key. The public key is published as part of the account profile and is thereby shared with all contacts in the system. The private key is encrypted with a key derived from a pbkdf2 function and stored within the account node. Other clients connecting to the same account can retrieve the encrypted key and restore the private key using the pbkdf2 function. Multiple clients for one account can then access the same E2E encrypted content.

<div align="center">
  <a href="#"><img src="/doc/overview_fig6.png" width="50%" style="border-radius:50%"></a>
</div>

When using E2E encryption, each channel is independently encrypted. The channel object will contain a list of the symmetric key encrypted with the public key of each participating account. Each client can unwrap their copy of the symmetric key with the account sealing key and view the contents of the channel. 

