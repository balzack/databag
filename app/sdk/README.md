DatabagClientSDK provides an interface and implementation for the decentralized databag network. The SDK is written in pure typescript so it can be imported into a wide variety of applications. The project contains reference applications for react-js, react-native, and node. The platform specific implementations of storage and cryptography are defined externally and provided to the SDK through interfaces

## API

# The SDK must first be allocated

DatabacgClientSDK(crypto: Crypto | null, log?: Logging)

# Persistent storage can then be provided to the SDK.

Mobile apps typically use the SqlStore interface allowing for offline use cases where most of the relational data is stored
initOfflineStore(sql: SqlStore): Promise<Session | null>

Borwser apps typically use the WebStore interface where minimal session data is stored
initOnlineStore(web: WebStore): Promise<Session | null>

# Account communcation is provided through the Session interface which is allocated and released as needed.

login provides a Session through an account login
login(handle: string, password: string, node: string, secure: boolean, mfaCode: string | null, params: SessionParams): Promise<Session>

access provides a Session through token access to an account when password is forgotten
access(node: string, secure: boolean, token: string, params: SessionParams): Promise<Session>

create provides a Session to a newly created account
create(handle: string, password: string, node: string, secure: boolean, token: string | null, params: SessionParams): Promise<Session>

available returns the number of accounts that can be publically created
available(node: string, secure: boolean): Promise<number>

username returns whether the username is available for account creation
username(name: string, token: string, node: string, secure: boolean): Promise<boolean>

logout releases the Session interface
logout(session: Session, all: boolean): Promise<void>

# Admin communcation is provided through the Node interface

configure allocates the Node interface for the server
configure(node: string, secure: boolean, token: string, mfaCode: string | null): Promise<Node>

# Bot communication is provided through the Bot interface

automate allocates the Bot interface for ia specific communication channel
automate(node: string, secure: boolean, token: string): Promise<Bot>


