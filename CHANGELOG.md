# CHANGELOG

## 2.0.0
- Breaking changes: options object for decryption changed: from `decryptionSecrets` to `decryption`: `secrets`, `setNullOnDecryptionFailure`
- Implement setNullOnDecryptionFailure flag

## 1.0.0

- Breaking changes: values are base64 encoded before being encrypted and base64 decoded after being decrypted. This way, when providing multiple keys, a correct decryption can be determined by checking whether the plaintext only contains charactesr from the base64 characterset.
- Export the `decrypt` method from the package so the consumer can test the correct functionality of encryption and decryption.

## 0.3.1

- Fixed error during packaging/ publishing which made the package unusable.

## 0.3.0

- Add the `decrypt` option for specifying decryption secrets that are used to decrypt configuration values that are provided encrypted.

## 0.2.1

- Fix wrong packing of npm package

## 0.2.0

- Add the `strictObjectStructureChecking` option

## 0.1.1

- Bugfix: remove the "is-plain-object" dependency and replace it with a simple object check as class instances should be treated as objects as well but are not "plain" objects
- Add example for a NestJS webserver using the ts-configurable package
- Update documentation

## 0.1.0

- Update documentation
- Additionally export IDecoratorOptions and IEnvOptions from package
- Change throwing "Error" to "TypeError"

## 0.0.2

- Update documentation
- Introduce CI tools (CircleCI, Greenkeeper, Codecov)
