import { Crypto } from 'databag-client-sdk'
import CryptoJS from 'crypto-js'
import { JSEncrypt } from 'jsencrypt'

export class WebCrypto implements Crypto {
  // generate salt for pbk function
  public async pbkdfSalt(): Promise<{ saltHex: string }> {
    const salt = CryptoJS.lib.WordArray.random(128 / 8)
    const saltHex = salt.toString()
    return { saltHex }
  }

  // generate aes key with pbkdf2
  public async pbkdfKey(saltHex: string, password: string): Promise<{ aesKeyHex: string }> {
    const salt = CryptoJS.enc.Hex.parse(saltHex)
    const aes = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 1024, hasher: CryptoJS.algo.SHA1 })
    const aesKeyHex = aes.toString()
    return { aesKeyHex }
  }

  // generate random aes key
  public async aesKey(): Promise<{ aesKeyHex: string }> {
    const aes = CryptoJS.lib.WordArray.random(256 / 8)
    const aesKeyHex = aes.toString()
    return { aesKeyHex }
  }

  // generate iv to use to aes function
  public async aesIv(): Promise<{ ivHex: string }> {
    const iv = CryptoJS.lib.WordArray.random(128 / 8)
    const ivHex = iv.toString()
    return { ivHex }
  }

  // encrypt data with aes key and iv
  public async aesEncrypt(data: string, ivHex: string, aesKeyHex: string): Promise<{ encryptedDataB64: string }> {
    const iv = CryptoJS.enc.Hex.parse(ivHex)
    const key = CryptoJS.enc.Hex.parse(aesKeyHex)
    const encrypted = CryptoJS.AES.encrypt(data, key, { iv })
    const encryptedDataB64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
    return { encryptedDataB64 }
  }

  // decrypt data with aes key and iv
  public async aesDecrypt(encryptedDataB64: string, ivHex: string, aesKeyHex: string): Promise<{ data: string }> {
    const iv = CryptoJS.enc.Hex.parse(ivHex)
    const key = CryptoJS.enc.Hex.parse(aesKeyHex)
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedDataB64)
    const cipher = CryptoJS.lib.CipherParams.create({ ciphertext, iv })
    const decrypted = CryptoJS.AES.decrypt(cipher, key, { iv })
    const data = decrypted.toString(CryptoJS.enc.Utf8)
    return { data }
  }

  // generate rsa key
  public async rsaKey(): Promise<{ publicKeyB64: string; privateKeyB64: string }> {
    const crypto = new JSEncrypt({ default_key_size: '2048' })
    crypto.getKey()
    const publicKey = crypto.getPublicKey()
    const publicKeyB64 = this.convertPem(publicKey)
    const privateKey = crypto.getPrivateKey()
    const privateKeyB64 = this.convertPem(privateKey)
    return { publicKeyB64, privateKeyB64 }
  }

  // encrypt data with public rsa key
  public async rsaEncrypt(data: string, publicKeyB64: string): Promise<{ encryptedDataB64: string }> {
    const crypto = new JSEncrypt()
    crypto.setPublicKey(publicKeyB64)
    const encryptedDataB64 = crypto.encrypt(data)
    if (!encryptedDataB64) {
      throw new Error('rsaEncrypt failed')
    }
    return { encryptedDataB64 }
  }

  // decrypt data with private rsa key
  public async rsaDecrypt(encryptedDataB64: string, privateKeyB64: string): Promise<{ data: string }> {
    const crypto = new JSEncrypt()
    crypto.setPrivateKey(privateKeyB64)
    const data = crypto.decrypt(encryptedDataB64)
    if (!data) {
      throw new Error('rsaDecrypt failed')
    }
    return { data }
  }

  private convertPem(pem: string): string {
    const lines = pem.split('\n')
    let encoded = ''
    for (let i = 0; i < lines.length; i++) {
      if (
        lines[i].trim().length > 0 &&
        lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
        lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
        lines[i].indexOf('-BEGIN PUBLIC KEY-') < 0 &&
        lines[i].indexOf('-END PUBLIC KEY-') < 0 &&
        lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
        lines[i].indexOf('-END RSA PUBLIC KEY-') < 0
      ) {
        encoded += lines[i].trim()
      }
    }
    return encoded
  }
}
