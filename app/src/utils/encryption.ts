// Source: https://dev.to/halan/4-ways-of-symmetric-cryptography-and-javascript-how-to-aes-with-javascript-3o1b

const PBKDF2 = async (
  password: string,
  salt: Uint8Array,
  iterations: number,
  length: number,
  hash: string,
  algorithm = "AES-CBC"
) => {
  const encoder = new TextEncoder();

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations,
      hash,
    },
    keyMaterial,
    { name: algorithm, length },
    false, // we don't need to export our key!!!
    ["encrypt", "decrypt"]
  );
};

const toBase64 = (buffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)));

const fromBase64 = (buffer) =>
  Uint8Array.from(atob(buffer), (c) => c.charCodeAt(0));

const salt_len = 16;
const iv_len = 16;

export async function encrypt(data: any, encryptionKey: string) {
  const salt = window.crypto.getRandomValues(new Uint8Array(salt_len));
  const iv = window.crypto.getRandomValues(new Uint8Array(iv_len));
  const key = await PBKDF2(encryptionKey, salt, 100000, 256, "SHA-256");

  const encoder = new TextEncoder();
  const plain_text = encoder.encode(JSON.stringify(data));

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    plain_text
  );

  return toBase64([...salt, ...iv, ...new Uint8Array(encrypted)]);
}

export async function decrypt(
  encryptedDataString: string,
  encryptionKey: string
) {
  const encrypted = fromBase64(encryptedDataString);

  const salt = encrypted.slice(0, salt_len);
  const iv = encrypted.slice(0 + salt_len, salt_len + iv_len);
  const key = await PBKDF2(encryptionKey, salt, 100000, 256, "SHA-256");

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    key,
    encrypted.slice(salt_len + iv_len)
  );

  const decoder = new TextDecoder();
  const plain_text = decoder.decode(decrypted);
  return JSON.parse(plain_text);
}
