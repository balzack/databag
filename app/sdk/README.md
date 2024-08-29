!!! still a work in progress !!!

DatabagClientSDK provides a typescript interface for communication over the decentralized databag network. The SDK has minimal dependencies and contains reference applications for react-js, react-native, and node.

The API is provided through a set of typescript interfaces. Each interface groups methods by their functionality and are only allocated as needed. The platform specific implementations of storage and cryptography are defined externally and are also provided to the SDK through interfaces.

## Initialization

<details>
  <summary>The SDK must first be allocated</summary><br>

The crypto and log params are provided by implementing the [Crypto](https://github.com/balzack/databag/blob/sdk/app/sdk/src/crypto.ts) and [Logging](https://github.com/balzack/databag/blob/sdk/app/sdk/src/logging.ts) interface respectively. 
  
```DatabacgClientSDK(crypto?: Crypto, log?: Logging)```

<br>

</details>

<details>
  <summary>Account communcation is provided through the Session interface</summary><br>

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

<details>
  <summary>Storage can then be provided to the SDK to persist sessions</summary><br>

Mobile apps typically use the offline store where most of the relational data is saved. The sql param is provided by implementing the [SqlStore](https://github.com/balzack/databag/blob/sdk/app/sdk/src/store.ts) interface.

```DatabacgClientSDK::initOfflineStore(sql: SqlStore): Promise<Session | null>```

Browser apps typically the online store where minimal session data is saved. The web param is provided by implementing the [WebStore](https://github.com/balzack/databag/blob/sdk/app/sdk/src/store.ts) interface.

```DatabacgClientSDK::initOnlineStore(web: WebStore): Promise<Session | null>```
</details>

<br>

</details>

<details>
  <summary>Admin communcation is provided through the Node interface</summary><br>

Configure allocates the Node interface for the server

```DatabacgClientSDK::configure(node: string, secure: boolean, token: string, mfaCode: string | null): Promise<Node>```

<br>

</details>

<details>
  <summary>Bot communication is provided through the Bot interface</summary><br>

Automate allocates the Bot interface for ia specific communication channel

```DatabacgClientSDK::automate(node: string, secure: boolean, token: string): Promise<Bot>```

<br>

</details>

## User Communication


<details>
  <summary>Session provides the core functionality and provides access to all user interface modules</summary><br>

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

  Account content channels are managed through the Content Interface
  
  ```Session::getContent(): Content```

  An aggregation of content channels provided by contacts is managed through the Stream Interface
  
  ```Session::getStream(): Stream```

  WebRTC calling is managed through the Ring Interface
  
  ```Session::getRing(): Ring```

  Management of an active content channel is provided through the Focus Interface
  
  ```Session::addFocus(cardId: string | null, channelId: string): Focus```   
  ```Session::removeFocus(focus: Focus): void```

  The connectivity status is provided through a status lisenter
  
  ```Session::addStatusListener(ev: (status: string) => void): void```   
  ```Session::removeStatusListener(ev: (status: string) => void): void```

<br>

</details>


<details>
  <summary>Settings interface module manages the account access settings</summary><br>

  The login and password for the account can be changed through the setLogin method
  
  ```Settings::setLogin(username: string, password: string): Promise<void>```

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
  <br>
  
</details>

## Admin Communication

## Bot Communication
