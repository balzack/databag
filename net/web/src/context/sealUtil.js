import CryptoJS from 'crypto-js';
import { JSEncrypt } from 'jsencrypt'

export function getChannelSeals(subject) {
  const { seals } = JSON.parse(subject);
  return seals;
}

export function isUnsealed(seals, sealKey) {
  for (let i = 0; i < seals?.length; i++) {
    if (seals[i].publicKey === sealKey?.public) {
      return sealKey?.private != null;
    }
  }
  return false;
}

export function getContentKey(seals, sealKey) {
  for (let i = 0; i < seals?.length; i++) {
    if (seals[i].publicKey === sealKey.public) {
      let crypto = new JSEncrypt();
      crypto.setPrivateKey(sealKey.private);
      return crypto.decrypt(seals[i].sealedKey);
      
    }
  }
  throw new Error("unsealKey not available");
}

export function encryptChannelSubject(subject, publicKeys) {
  const key = CryptoJS.lib.WordArray.random(256 / 8);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ subject }), key, { iv: iv });
  const subjectEncrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
  const subjectIv = iv.toString();
  const keyHex = key.toString();

  let seals = [];
  let crypto = new JSEncrypt();
  publicKeys.forEach(publicKey => {
    crypto.setPublicKey(publicKey);
    const sealedKey = crypto.encrypt(keyHex);
    seals.push({ publicKey, sealedKey });
  });

  return { subjectEncrypted, subjectIv, seals };
}

export function decryptChannelSubject(subject, contentKey) {
  const { subjectEncrypted, subjectIv } = JSON.parse(subject);
  const iv = CryptoJS.enc.Hex.parse(subjectIv);
  const key = CryptoJS.enc.Hex.parse(contentKey);
  const enc = CryptoJS.enc.Base64.parse(subjectEncrypted);
  const cipher = CryptoJS.lib.CipherParams.create({ ciphertext: enc, iv: iv });
  const dec = CryptoJS.AES.decrypt(cipher, key, { iv: iv });
  const str = dec.toString(CryptoJS.enc.Utf8);
  if (!str) {
    return null;
  }
  return JSON.parse(dec.toString(CryptoJS.enc.Utf8));
}

export function encryptTopicSubject(subject, contentKey) {
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const key = CryptoJS.enc.Hex.parse(contentKey);
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ subject }), key, { iv: iv });
  const messageEncrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
  const messageIv = iv.toString();
  return { messageEncrypted, messageIv };
}

export function decryptTopicSubject(subject, contentKey) {
  const { messageEncrypted, messageIv } = JSON.parse(subject);
  const iv = CryptoJS.enc.Hex.parse(messageIv);
  const key = CryptoJS.enc.Hex.parse(contentKey);
  const enc = CryptoJS.enc.Base64.parse(messageEncrypted);
  let cipher = CryptoJS.lib.CipherParams.create({ ciphertext: enc, iv: iv });
  const dec = CryptoJS.AES.decrypt(cipher, key, { iv: iv });
  return JSON.parse(dec.toString(CryptoJS.enc.Utf8));
}

function convertPem(pem) {
  var lines = pem.split('\n');
  var encoded = '';
  for(var i = 0;i < lines.length;i++){
    if (lines[i].trim().length > 0 &&
        lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
        lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
        lines[i].indexOf('-BEGIN PUBLIC KEY-') < 0 &&
        lines[i].indexOf('-END PUBLIC KEY-') < 0 &&
        lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
        lines[i].indexOf('-END RSA PUBLIC KEY-') < 0) {
      encoded += lines[i].trim();
    }
  }
  return encoded
};

export async function generateSeal(password) {

  // generate key to encrypt private key
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const aes = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1024,
  });

  // generate rsa key for sealing channel, delay for activity indicators
  await new Promise(r => setTimeout(r, 1000));
  const crypto = new JSEncrypt({ default_key_size: 2048 });
  crypto.getKey();

  // encrypt private key
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const privateKey = convertPem(crypto.getPrivateKey());
  const enc = CryptoJS.AES.encrypt(privateKey, aes, { iv: iv });
  const publicKey = convertPem(crypto.getPublicKey());

  // update account
  const seal = {
    passwordSalt: salt.toString(),
    privateKeyIv: iv.toString(),
    privateKeyEncrypted: enc.ciphertext.toString(CryptoJS.enc.Base64),
    publicKey: publicKey,
  }
  const sealKey = {
    public: publicKey,
    private: privateKey,
  }

  return { seal, sealKey };
}

export function unlockSeal(seal, password) {

  // generate key to encrypt private key
  const salt = CryptoJS.enc.Hex.parse(seal.passwordSalt);
  const aes = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1024,
  });

  // decrypt private key
  const iv = CryptoJS.enc.Hex.parse(seal.privateKeyIv);
  const enc = CryptoJS.enc.Base64.parse(seal.privateKeyEncrypted)

  let cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: enc,
    iv: iv
  });
  const dec = CryptoJS.AES.decrypt(cipherParams, aes, { iv: iv });
  const privateKey = dec.toString(CryptoJS.enc.Utf8)

  // store ke
  const sealKey = {
    public: seal.publicKey,
    private: privateKey,
  }

  return sealKey;
}

export function updateSeal(seal, sealKey, password) {

  // generate key to encrypt private key
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const aes = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1024,
  });

  // encrypt private key
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const enc = CryptoJS.AES.encrypt(sealKey.private, aes, { iv: iv });

  // update account
  const updated = {
    passwordSalt: salt.toString(),
    privateKeyIv: iv.toString(),
    privateKeyEncrypted: enc.ciphertext.toString(CryptoJS.enc.Base64),
    publicKey: seal.publicKey,
  }

  return { seal: updated, sealKey };
}
