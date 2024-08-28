!!! still a work in progress !!!

DatabagClientSDK provides a typescript interface for communication over the decentralized databag network. The SDK has minimal dependencies and contains reference applications for react-js, react-native, and node.

The API is provided through a set of typescript interfaces. Each interface groups methods by their functionality and are only allocated as needed. The platform specific implementations of storage and cryptography are defined externally and are also provided to the SDK through interfaces.

## Initialization

<details>
  <summary>The SDK must first be allocated</summary><br>

The crypto and log params are provided by implementing the [Crypto](https://github.com/balzack/databag/blob/sdk/app/sdk/src/crypto.ts) and [Logging](https://github.com/balzack/databag/blob/sdk/app/sdk/src/logging.ts) interface respectively. 
  
```DatabacgClientSDK(crypto?: Crypto, log?: Logging)```
</details>

<details>
  <summary>Persistent storage can then be provided to the SDK</summary><br>
  
Mobile apps typically use the SqlStore interface allowing for offline use cases where most of the relational data is stored. The sql param for the offline store is provided by implementing the [SqlStore]([Crypto](https://github.com/balzack/databag/blob/sdk/app/sdk/src/store.ts) interface.

```initOfflineStore(sql: SqlStore): Promise<Session | null>```

Browser apps typically use the WebStore interface where minimal session data is stored. The web param for the minimal online store is provided by implementing the [WebStore]([Crypto](https://github.com/balzack/databag/blob/sdk/app/sdk/src/store.ts) interface.

```initOnlineStore(web: WebStore): Promise<Session | null>```
</details>

<details>
  <summary>User communcation is provided through the Session interface</summary><br>

login provides a Session through an account login

```login(handle: string, password: string, node: string, secure: boolean, mfaCode: string | null, params: SessionParams): Promise<Session>```

access provides a Session through token access to an account when password is forgotten

```access(node: string, secure: boolean, token: string, params: SessionParams): Promise<Session>```

create provides a Session to a newly created account

```create(handle: string, password: string, node: string, secure: boolean, token: string | null, params: SessionParams): Promise<Session>```

available returns the number of accounts that can be publically created

```available(node: string, secure: boolean): Promise<number>```

username returns whether the username is available for account creation

```username(name: string, token: string, node: string, secure: boolean): Promise<boolean>```

logout releases the Session interface

```logout(session: Session, all: boolean): Promise<void>```
</details>

<details>
  <summary>Admin communcation is provided through the Node interface</summary><br>

configure allocates the Node interface for the server

```configure(node: string, secure: boolean, token: string, mfaCode: string | null): Promise<Node>```
</details>

<details>
  <summary>Bot communication is provided through the Bot interface</summary><br>

automate allocates the Bot interface for ia specific communication channel

```automate(node: string, secure: boolean, token: string): Promise<Bot>```
</details>

