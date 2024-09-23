export interface Crypto {

  // generate salt for pbk function
  pbkdfSalt(): Promise<{ saltHex: string }>;

  // generate aes key with pbkdf2
  pbkdfKey(saltHex: string, password: string): Promise<{ aesKeyHex: string }>;

  // generate random aes key
  aesKey(): Promise<{ aesKeyHex: string }>;

  // generate iv to use to aes function
  aesIv(): Promise<{ ivHex: string }>;

  // encrypt data with aes key and iv
  aesEncrypt(data: string, ivHex: string, aesKeyHex: string): Promise<{ encryptedDataB64: string }>;

  // decrypt data with aes key and iv
  aesDecrypt(encryptedDataB64: string, ivHex: string, aesKeyHex: string): Promise<{ data: string }>;

  // generate rsa key
  rsaKey(): Promise<{ publicKeyB64: string, privateKeyB64: string }>;

  // encrypt data with public rsa key
  rsaEncrypt(data: string, publicKeyB64: string): Promise<{ encryptedDataB64: string }>;

  // decrypt data with private rsa key
  rsaDecrypt(encryptedDataB64: string, privateKeyB64: string): Promise<{ data: string }>;
}
