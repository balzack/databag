export interface Crypto {

  // generate salt for pbk function
  pbkdfSalt(): { saltHex: string };

  // generate aes key with pbkdf2
  pbkdfKey(saltHex: string, password: string): { aesKeyHex: string };

  // generate random aes key
  aesKey(): { aesKeyHex: string };

  // generate iv to use to aes function
  aesIv(): { ivHex: string };

  // encrypt data with aes key and iv
  aesEncrypt(data: string, ivHex: string, aesKeyHex: string): { encryptedDataB64: string };

  // decrypt data with aes key and iv
  aesDecrypt(encryptedDataB64: string, ivHex: string, aesKeyHex: string): { data: string };

  // generate rsa key
  rsaKey(): { publicKeyB64: string, privateKeyB64: string };

  // encrypt data with public rsa key
  rsaEncrypt(data: string, publicKeyB64: string): { encryptedDataB64: string }

  // decrypt data with private rsa key
  rsaDecrypt(encryptedDataB64: string, privateKeyB64: string): { data: string }
}
