import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { DecryptionSecret } from './interfaces';

/** Cipher algorithm used for encryption and decryption of configuration values */
const cipherAlgorithm = 'aes-128-cbc';
/** Hashing algorithm used to derive the encryption/ decryption key from the provided secret(s) */
const keyHashingAlgorithm = 'sha1';
/** Byte length of the randomly generated initialization vector */
const ivBytelength = 16;
/** Byte length of the key derived from the given secret(s) */
const keyBytelength = 16;
/** Separation character used to separate the different parts of the ciphertext in its serialized form */
const ciphertextSeparator = '.';
/** Ciphertext prefix used to determine whether a value has been ecrypted and should be attempted for decryption (default: '$ENC$') */
const ciphertextPrefix = '$ENC$';

/**
 * Serialize the given encryption result into a single (printable) string
 * @param iv initialization vector used during encryption
 * @param encrypted result of the encryption
 */
function serializeCipher(iv: Buffer, encrypted: Buffer): string {
  return `${ciphertextPrefix}${ciphertextSeparator}${iv.toString(
    'hex'
  )}${ciphertextSeparator}${encrypted.toString('hex')}`;
}

/**
 * De-serialize the given ciphertext from its string representation
 * @param ciphertext ciphertext (string representation) to de-serialize
 */
function deserializeCipher(ciphertext: string) {
  // Parse ciphertext (prefix, iv, encrypted string)
  const [cipherPrefix, ivStr, encryptedStr] = ciphertext.split(ciphertextSeparator);

  // Check if the ciphertext is in a valid format
  if (
    cipherPrefix !== ciphertextPrefix ||
    !ivStr ||
    ivStr.length !== 2 * ivBytelength ||
    !encryptedStr
  ) {
    throw Error();
  }

  const iv = Buffer.from(ivStr, 'hex');
  const encrypted = Buffer.from(encryptedStr, 'hex');

  return { cipherPrefix, iv, encrypted };
}

/**
 * Calculate the encryption/ decryption key from the given secret
 * @param secret secret
 */
function keyFromSecret(secret: string): Buffer {
  // Normalize key by hashing it and return a key of the appropriate length
  const hash = createHash(keyHashingAlgorithm);
  hash.update(secret);
  const key = hash.digest().slice(0, keyBytelength);
  return key;
}

/**
 * Load secret from a file
 * @param filepath path to the secret file
 * @param options file read options
 */
function loadSecretFromFile(
  filepath: string,
  options?: { encoding?: null; flag?: string } | null
): string | null {
  if (!existsSync(filepath)) {
    return null;
  }

  const secret = readFileSync(filepath, options);
  return secret.toString();
}

/**
 * Load secret from the processes environment variables
 * @param environmentVariable name of the environment variable
 */
function loadSecretFromEnvironmentVariable(environmentVariable: string): string | null {
  const secret = process.env[environmentVariable];
  if (!secret) {
    return null;
  }

  return secret;
}

export function getDecryptionKeys(secrets: false | DecryptionSecret[]): null | Buffer[] {
  const keys = (secrets || [])
    .filter(secret => !!secret)
    .map(secret => {
      switch (secret.type) {
        case 'raw':
          return secret.secret;
        case 'env':
          return loadSecretFromEnvironmentVariable(secret.environmentVariable);
        case 'file':
          return loadSecretFromFile(secret.filepath, secret.fileOptions);
      }
    })
    .filter(secret => !!secret)
    .map(secret => keyFromSecret(secret));

  return keys;
}

/**
 * Encrypt the given plaintext
 * @param key encryption key
 * @param plaintext plaintext to encrypt
 */
export function encrypt(secret: string, plaintext: string): string {
  const key = keyFromSecret(secret);

  // Generate random IV
  const iv = randomBytes(ivBytelength);

  // Encrypt plaintext
  const cipher = createCipheriv(cipherAlgorithm, key, iv);
  let encrypted = cipher.update(plaintext);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Return the serialized cipher (its string representation)
  return serializeCipher(iv, encrypted);
}

/**
 * Decrypt the given ciphertext
 * @param keyOrSecret decryption secret (string) or derived key (Buffer)
 * @param ciphertext ciphertext to decrypt
 */
export function decrypt(keyOrSecret: Buffer | string, ciphertext: string): string {
  const key = typeof keyOrSecret === 'string' ? keyFromSecret(keyOrSecret) : keyOrSecret;
  const { iv, encrypted } = deserializeCipher(ciphertext);

  // Decrypt value
  const decipher = createDecipheriv(cipherAlgorithm, key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  const plaintext = decrypted.toString();

  return plaintext;
}

export function attemptDecryption(keys: Buffer[], ciphertext: any): any {
  // Only attempt decryption if the value is a string
  if (typeof ciphertext !== 'string') {
    return ciphertext;
  }

  for (const key of keys) {
    try {
      const plaintext = decrypt(key, ciphertext);
      return plaintext;
    } catch (err) {}
  }

  return ciphertext;
}
