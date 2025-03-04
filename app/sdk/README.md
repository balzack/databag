DatabagClientSDK provides a typescript interface for communication over the decentralized Databag network. 

The API is provided through a set of interfaces; each interface groups methods by their functionality and only need to be allocated as needed. The platform specific implementations of storage and cryptography are defined externally and are also provided to the SDK through interfaces.

## Initialization

<details>
  <summary>The SDK must first be allocated</summary><br>

  <ul>
    
The [Params](https://github.com/balzack/databag/blob/sdk/app/sdk/src/types.ts) argument specifies the data to syncrhonize. The crypto, staging and log arguments are provided by implementing the [Crypto](https://github.com/balzack/databag/blob/sdk/app/sdk/src/crypto.ts), [Staging](https://github.com/balzack/databag/blob/sdk/app/sdk/src/staging.ts) and [Logging](https://github.com/balzack/databag/blob/sdk/app/sdk/src/logging.ts) interface respectively.
  
```new DatabagClientSDK(params: Params, crypto?: Crypto, staging?: Staging, log?: Logging)```
  </ul>
<br>

</details>

<details>
  <summary>Account communcation is provided through the Session interface</summary><br>

<ul>
  
Login provides a Session through an account login

```DatabacgClientSDK::login(handle: string, password: string, node: string, secure: boolean, mfaCode: string | null, params: SessionParams): Promise<Session>```

Access provides a Session through token access to an account when password is forgotten

```DatabacgClientSDK::access(node: string, secure: boolean, token: string, params: SessionParams): Promise<Session>```

Create provides a Session to a newly created account

```DatabacgClientSDK::create(handle: string, password: string, node: string, secure: boolean, token: string | null, params: SessionParams): Promise<Session>```

Available returns the number of accounts that can be publically created

```DatabacgClientSDK::available(node: string, secure: boolean): Promise<number>```

Username returns whether the username is available for account creation

```DatabacgClientSDK::username(name: string, token: string, node: string, secure: boolean): Promise<boolean>```

Logout releases the Session interface

```DatabacgClientSDK::logout(session: Session, all: boolean): Promise<void>```

Remove releases the Session interface and deletes the account from the server

```DatabacgClientSDK::remove(session: Session): Promise<void>```

<details>
  <summary>Storage can then be provided to the SDK to persist sessions</summary><br>

Mobile apps typically use the offline store where most of the relational data is saved. The sql param is provided by implementing the [SqlStore](https://github.com/balzack/databag/blob/sdk/app/sdk/src/store.ts) interface.

```DatabacgClientSDK::initOfflineStore(sql: SqlStore): Promise<Session | null>```

Browser apps typically use the online store where minimal session data is saved. The web param is provided by implementing the [WebStore](https://github.com/balzack/databag/blob/sdk/app/sdk/src/store.ts) interface.

```DatabacgClientSDK::initOnlineStore(web: WebStore): Promise<Session | null>```
</details>
</ul>
<br>

</details>

<details>
  <summary>Admin communcation is provided through the Service interface</summary><br>

  <ul>
    
Configure allocates the Service interface for the server

```DatabacgClientSDK::configure(node: string, secure: boolean, token: string, mfaCode: string | null): Promise<Service>```

</ul>
<br>
</details>

## Account Communication


<details>
  <summary>Session provides connectivity status and divides the account communication into separate modules</summary><br>
  
  <ul>
    
  Account Settings are managed through the Settings interface
  
  ```Session::getSettings(): Settings```

  Account Profile is managed through the Identity interface
  
  ```Session::getIdentity(): Identity```

  Account Contacts are managed through the Contact Inferface
  
  ```Session::getContact(): Contact```

  Account and Contact channels are managed through the Content Interface
  
  ```Session::getContent(): Content```

  WebRTC calling is managed through the Ring Interface
  
  ```Session::getRing(): Ring```

  Management of an active content channel is provided through the Focus Interface
  
  ```Session::setFocus(cardId: string | null, channelId: string): Focus```   
  ```Session::clearFocus(focus: Focus): void```

  The connectivity status is provided through a status lisenter
  
  ```Session::addStatusListener(ev: (status: string) => void): void```   
  ```Session::removeStatusListener(ev: (status: string) => void): void```

</ul>

<br>

</details>


<details>
  <summary>Settings interface module manages the account access settings</summary><br>
  
  <ul>
    
  The login and password for the account can be changed through the setLogin method
  
  ```Settings::setLogin(username: string, password: string): Promise<void>```

  Check if the specified username is available

  ```Settings::getUsernameStatus(username: string): Promise<boolean>```

  Push notifications to the user's device can be enabled through enableNotifications
  
  ```Settings::enableNotifications(): Promise<void>```

  Push notifications to the user's device can be disabled through disableNotifications
  
  ```Settings::disableNotifications(): Promise<void>```

  The account will be visible in the server registry when enabled through enableRegistry
  
  ```Settings::enableRegistry(): Promise<void>```

  The account will not be visible in the server registry when disabled through disableRegistry
  
  ```Settings::disableRegistry(): Promise<void>```

  Multi-Factor authentication is enabled through enableMFA
  
  ```Settings::enableMFA(): Promise<{ secretImage: string, secretText: string }>```

  Multi-Factor authentication is disabled with disableMFA
  
  ```Settings::disableMFA(): Promise<void>```

  Once enabled the Mutli-Factor authentication must be confirmed before it will be required for login
  
  ```Settings::confirmMFA(code: string): Promise<void>```

  End-to-End encryption is enabled by setting up a client key with setSeal
  
  ```Settings::setSeal(password: string): Promise<void>```

  End-to-End encryption is disabled and the key deleted with clearSeal
  
  ```Settings::clearSeal(): Promise<void>```

  End-to-End encryption can be enabled of other devices by unlocking the key with unlockSeal
  
  ```Settings::unlockSeal(password: string): Promise<void>```

  End-to-End encryption is disabled, but the key remains locked with forgetSeal
  
  ```Settings::forgetSeal(): Promise<void>```

  The current configuration can be accessed through a [Config](https://github.com/balzack/databag/blob/sdk/app/sdk/src/types.ts) listener

  ```Settings::addConfigListener(ev: (config: Cofnig) => void): void```   
  ```Settings::removeConfigListener(ev: (config: Config) => void): void```

  </ul>
  
  <br>
  
</details>

<details>
  <summary>Identity interface module manages the account profile</summary><br>

<ul>
  
  The text details of the profile are set with setProfileData

  ```Identity::setProfileData(name: string, location: string, description: string): Promise<void>```

  The profile image is set with setProfileImage
  
  ```Identity::setProfileImage(image: string): Promise<void>```

  A direct url to retrieve the profile image is provided with getProfileImageUrl

  ```Identity:::getProfileImageUrl(): string```

  The current profile can be access with a [Profile](https://github.com/balzack/databag/blob/sdk/app/sdk/src/types.ts) listener

  ```Identity::addProfileListener(ev: (profile: Profile) => void): void```   
  ```Identity::removeProfileListener(ev: (profile: Profile) => void): void```
  
</ul>

  <br>
</details>

<details>
  <summary>Contact interface module manages contacts and their connected state</summary><br>
  
  <ul>

  The current contacts can be access with a [Card](https://github.com/balzack/databag/blob/sdk/app/sdk/src/types.ts) listener

  ```Contact::addCardListener(ev: (cards: Card[]) => void): void```
  
  ```Contact::removeCardListener(ev: (cards: Card[]) => void): void```
    
  A new contact can be added to the account through the addCard method, the id of the card is returned
  
  ```Contact::addCard(server: string, guid: string): Promise<string>```

  A contact is removed the the account through the removeCard method

  ```Contact::removeCard(cardId: string): Promise<void>```

  Attempt synchronization of contact data if previously failed

  ```Contact::resyncCard(cardId: string): Promise<void>```

  Initiate or accept a contact connection with connectCard to share data

  ```Contact::connectCard(cardId: string): Promise<void>```

  Save contact of connection request without accepting connection with confirmCard

  ```Contact::confirmCard(cardId: string): Promise<void>```
  
  Disconnect or cancel from a contact with diconnectCard to stop sharing with that contact

  ```Contact::disconnectCard(cardId: string): Promise<void>```

  Deny a connection request from a contact with denyCard

  ```Contact::denyCard(cardId: string): Promise<void>```

  Ignore a connection request from a contact with ignoreCard

  ```Contact::ignoreCard(cardId: string): Promise<void>```

  Cancel your connection request to a contact with cancelCard

  ```Contact::cancelCard(cardId: string): Promise<void>```

  Get list of searchable accounts of specified server with getRegistry

  ```Contact::getRegistry(handle: string | null, server: string | null): Promise<Profile[]>```

  Block or unblock contact to hide locally with setBlockedCard

  ```Contact::setBlockedCard(cardId: string, boolean: blocked): Promise<void>```

  Get list of all blocked contacts with getBlockedCards 

  ```Contact::getBlockedCards(): Promise<Card[]>```

  Flag contact to node admin for review with flagCard

  ```Contact::flagCard(cardId: string): Promise<void>```

  Request a peer-to-peer link to a contact

  ```Contact::callCard(cardId: string): Promise<Link>```

</ul>

  <br>
</details>

<details>
  <summary>Content interface module manages hosted and contact shared channels</summary><br>

  <ul>

  The current channels can be access with a [Channel](https://github.com/balzack/databag/blob/sdk/app/sdk/src/types.ts) listener

  ```Content::addChannelListener(ev: (arg: { channels: Channel[], cardId: string | null }) => void): void```

  ```Content::removeChannelListener(ev: (arg: { channels: Channel[], cardId: string | null }) => void): void```

  Add a new channel shared with specified contacts with addChannel

  ```Content::addChannel(sealed: boolean, type: string, subject: any, cardIds: string[]): Promise<string>```

  Remove a hosted channel with removeChannel

  ```Content::removeChannel(channelId: string): Promise<void>```

  Leave a channel hosted by a contact with leaveChannel

  ```Content::leaveChannel(cardId: string, channelId: string): Promise<void>```

  Update the subject on specified channel

  ```Content::setChannelSubject(channelId: string, type: string, subject: any): Promise<void>```

  Add member to specified channel

  ```Content::setChannelCard(channelId: string, cardId: string): Promise<void>```

  Remove member from specified channel

  ```Content::clearChannelCard(channelId: string, cardId: string): Promise<void>```

  Enable or disable push notification associated with specified channel

  ```Content::setChannelNotifications(cardId: string | null, channelId: string, enabled: boolean): Promise<void>```

  Get whether notifications are enabled on specified channel

  ```Content::getChannelNotifications(cardId: string | null, channelId: string): Promise<boolean>```

  Mark channel as read or unread with setUnreadChannel

  ```Content::setUnreadChannel(cardId: string | null, channelId: string, unread: boolean): Promise<void>```

  Block or unblock channel with setBlockedChannel

  ```Content::setBlockedChannel(cardId: string | null, channelId: string, boolean: blocked): Promise<void>```

  Get list of all blocked channels with getBlockedChannels

  ```Content::getBlockedChannels(): Promise<Channel[]>```

  Flag channel for review by admin with flagChannel

  ```Content::flagChannel(cardId: string | null, channelId: string): Promise<void>```

</ul>

  <br>
</details>

<details>
  <summary>Focus interface module manages the topics on an activated channel</summary><br>

  <ul>

  The current topics can be accessed with a [Topic](https://github.com/balzack/databag/blob/sdk/app/sdk/src/types.ts) listener

  ```Focus::addTopicListener(ev: (arg: { topics: Topic[] | null }) => void): void```
  ```Focus::removeTopicListener(ev: (arg: { topics: Topic[] }) => void): void```

  The channel configuration can be accessed with a [FocusDetail](https://github.com/balzack/databag/blob/sdk/app/sdk/src/types.ts) listener

  ```Focus::addDetailListener(ev: (focused: { cardId: string | null, channelId: string, detail: FocusDetail | null }) => void): void```
  ```Focus::removeDetailListener(ev: (focused: { cardId: string | null, channelId: string, detail: FocusDetail | null }) => void): void```

  The current channel id can be retrieved with the helper function getFocused

  ```Focus::getFocused(): {cardId: null|string, channelId: string}```

  Adding a topic can be done through the addTopic method

  ```Focus::addTopic(sealed: boolean, type: string, subject: (assets: {assetId: string, appId: string}[])=>any, assets: AssetSource[], progress: (percent: number)=>boolean): Promise<string>```
  
  Update a topic subject with setTopicSubject

  ```Focus::setTopicSubject(topicId: string, type: string, subject: (assets: {assetId: string, appId: string}[])=>any, files: AssetSource[], progress: (percent: number)=>boolean): Promise<void>```

  Delete a topic with removeTopic

  ```Focus::removeTopic(topicId: string): Promise<void>```

  Retrieve more than the initial topic back in listener with viewMoreTopics

  ```Focus::viewMoreTopics(): Promise<void>```

  Generate URL for retrieve a topic asset, sealed assets are retrieved and decrypted locally

  ```Focus::getTopicAssetUrl(topicId: string, assetId: string, progress?: (percent: number) => boolean|void): Promise<string>```

  Flag topic for abuse

  ```Focus::flagTopic(topicId: string): Promise<void>```

  Set blocked flag associated with topic

  ```Focus::setBlockTopic(topicId: string): Promise<void>```

  Clear blocked flag associated with topic

  ```Focus::clearBlockTopic(topicId: string): Promise<void>```

</ul>

  <br>
</details>

<details>
  <summary>Ring interface module manages incoming link requests</summary><br>

  <ul>

  The current calls can accessed with a call listener

  ```Ring::addRingingListener(ev: (calls: { cardId: string, callId: string }[]) => void): void```
  ```Ring::removeRingingListener(ev: (calls: { cardId: string, callId: string }[]) => void): void```

  Accept an incoming link request with accept

  ```Link::accept(cardId: string, callId: string, contactNode: string): Promise<Link>```

  Decline an incoming link notifying requestor

  ```Link::decline(cardId: string, callId: string, contactNode: string): Promise<void>```

  Ignore an incoming link request without notifying requestor

  ```Link::ignore(cardId: string, callId: string): Promise<void>```

</ul>

  <br>
</details>


<details>
  <summary>Link interface module manages a proxied link between contacts</summary><br>

  <ul>

  The connection status can be accessed with a status listener

  ```Link::setStatusListener(ev: (status: string) => Promise<void>): void```
  ```Link::clearStatusListener(): void```

  The messages are received through through a listener

  ```Link::setMessageListener(ev: (message: any) => Promise<void>): void```
  ```Link::clearMessageListener(): void```

  Messages are sent to contact through sendMessage

  ```Link::sendMessage(message: any): Promise<void>```

  WebRTC ICE params are provided through a dedicated method

  ```Link::getIce(): { urls: string; username: string; credential: string }[]```

  Close is called to close the connection

  ```Link::close(): Promise<void>```

</ul>

  <br>
</details>


## Admin Communication

<details>

  <summary>Service interface manages accounts and server configuration</summary><br>

  <ul>

  Retrieve the list of account on the server

  ```Service::getMembers(): Promise<Member[]>```

  Create a token allowing for the creation of an account when the server is private

  ```Service::createMemberAccess(): Promise<string>```
 
  Create a token allowing for access to an account without password 

  ```Service::resetMemberAccess(): Promise<string>```

  Enable or disable specified account on the server 

  ```Service::blockMember(memberId: number, blocked: boolean): Promise<void>```
 
  Delete specified account from the server 

  ```Service::removeMember(memberId: number): Promise<void>```

  Retrieve current server configuration 

  ```Service::getSetup(): Promise<Setup>```

  Update the server configuration 

  ```Service::getSetup(): Promise<Setup>```

  Check if multi-factor authentication is enabled for admin access

  ```Service::checkMFAuth(): Promise<boolean>```

  Retrieve mutli-factor authentication values to be confirmed

  ```Service::enableMFAuth(): Promise<{ image: string, text: string }>```
  
  Confirm multi-factor authentication values to complete the enable process

  ```Service::confirmMFAuth(code: string): Promise<void>```

  Disable multi-factor auth for admin access

  ```Service::disableMFAuth(): Promise<void>```

</ul>

  <br>
</details>

