!!! still a work in progress !!!

DatabagClientSDK provides a typescript interface for communication over the decentralized databag network. The SDK has minimal dependencies and contains reference applications for react-js, react-native, and node.

The API is provided through a set of interfaces; each interface groups methods by their functionality and are only allocated as needed. The platform specific implementations of storage and cryptography are defined externally and are also provided to the SDK through interfaces.

## Initialization

<details>
  <summary>The SDK must first be allocated</summary><br>

  <ul>
    
The crypto and log params are provided by implementing the [Crypto](https://github.com/balzack/databag/blob/sdk/app/sdk/src/crypto.ts) and [Logging](https://github.com/balzack/databag/blob/sdk/app/sdk/src/logging.ts) interface respectively. 
  
```DatabagClientSDK(crypto?: Crypto, log?: Logging)```
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
  <summary>Admin communcation is provided through the Node interface</summary><br>

  <ul>
    
Configure allocates the Node interface for the server

```DatabacgClientSDK::configure(node: string, secure: boolean, token: string, mfaCode: string | null): Promise<Node>```

</ul>
<br>
</details>

<details>
  <summary>Automated communication is provided through the Bot interface</summary><br>
  <ul>
    
Automate allocates the Bot interface for ia specific communication channel

```DatabacgClientSDK::automate(node: string, secure: boolean, token: string): Promise<Bot>```

</ul>
<br>

</details>

## Account Communication


<details>
  <summary>Session divides the account communication into separate modules</summary><br>
  
  <ul>
    
  Account Settings are managed through the Settings interface
  
  ```Session::getSettings(): Settings```

  Account Profile is managed through the Identity interface
  
  ```Session::getIdentity(): Identity```

  Account Contacts are managed through the Contact Inferface
  
  ```Session::getContact(): Contact```

  Contact groupings are managed through the Alias Interface
  
  ```Session::getAlias(): Alias```

  Account attribute data is managed through the Attribute Interface
  
  ```Session::getAttribute(): Attribute```

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

  Get URL of contacts profile image with getCardImageUrl

  ```Contact::getCardImageUrl(cardId: string): string```

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

  ```Contact::getRegistry(server: string, secure: boolean): Promise<Profile[]>```

  Block or unblock contact to hide locally with setBlockedCard

  ```Contact::setBlockedCard(cardId: string, boolean: blocked): Promise<void>```

  Get list of all blocked contacts with getBlockedCards 

  ```Contact::getBlockedCards(): Promise<Card[]>```

  Flag contact to node admin for review with flagCard

  ```Contact::flagCard(cardId: string): Promise<void>```

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

## Admin Communication

## Bot Communication
