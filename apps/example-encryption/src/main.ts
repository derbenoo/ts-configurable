import { Configurable, encrypt } from '@ts-configurable';

const secret = 'secret_key';
const value = 'sensitive_api_key';
const cipher = encrypt(secret, value);

console.log(`Encrypted config: ${cipher}`);

@Configurable({ decryptionSecrets: [{ type: 'raw', secret }] })
class Config {
  apiKey: string = cipher;
}

const config = new Config();
console.log(`Decrypted config: "${config.apiKey}"`);
