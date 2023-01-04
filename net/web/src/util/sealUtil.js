import CryptoJS from 'crypto-js';
import { JSEncrypt } from 'jsencrypt'

export function isUnsealed(subject, sealKey) {
  const { seals } = JSON.parse(subject);
  for (let i = 0; i < seals?.length; i++) {
    if (seals[i].publicKey === sealKey.public) {
      return sealKey.private != null;
    }
  }
  return false;
}

export function getContentKey(subject, sealKey) {
  for (let i = 0; i < seal?.length; i++) {
    if (seal[i].publicKey === sealKey.public) {
      let crypto = new JSEncrypt();
      crypto.setPrivateKey(sealKey.private);
      return crypto.decrypt(seal.sealedKey);
      
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
  publicKeys.forEach(key => {
    crypto.setPublicKey(key);
    const sealedKey = crypto.encrypt(keyHex);
    seals.push({ publicKey, sealedKey });
  });

  return { subjectEncrypted, subjectIv, seals };
}

export function decryptChannelSubject(subject, sealKey) {
  const { subjectEncrypted, subjectIv, seals } = JSON.parse(subject);
  const contentKey = getContentKey(seals, sealKey);
  const iv = CryptoJS.enc.Hex.parse(subjectIv);
  const key = CryptoJS.enc.Hex.parse(contentKey);
  const enc = CryptoJS.enc.Base64.parse(subjectEncrypted);
  const cipher = CryptoJS.lib.CipherParams.create({ ciphertext: enc, iv: iv });
  const dec = CryptoJS.AES.decrypt(cipher, key, { iv: iv });
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

