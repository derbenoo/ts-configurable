import { decrypt, encrypt } from './encryption-utils';

describe('libs/config: Encryption utils', () => {
  it('Encrypt and decrypt a value', () => {
    const secret = 'secret_key';
    const value = 'test123';
    expect(decrypt(secret, encrypt(secret, value))).toBe(value);
  });
});
