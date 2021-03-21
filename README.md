# Amazon KMS Envelope Encryption
A demonstration on implementation envelope encryption using amazon kms and Node.JS' crypto module

## Getting Started

1. Set your amazon kms key id in the .env file
2. Install NPM packages
	```sh
	$ npm install
	```
1. Start program
	```sh
	$ node index.js
	```

## Explanation
In this example, we are using `aes-256-ctr` algorithm. You can have a look on this [article](https://crypto.stackexchange.com/a/43289) to find the difference between CTR and GCM ciphers.

### Encryption Flow

1. Generates data key using Customer Master Key via kms `generateDataKeyWithoutPlaintext` API
   
2. Decrypted the data key using kms `decrypt` API

3. Create a random initialization vector (IV).

4. Encrypt the data using the data key and the iv. Amazon do not manage the data key. You need to store the data key and IV by yourself.

5. Encode the IV and data key using base64 encoding and store it for decryption.

### Decryption Flow

1. Decrypt the data key using kms `decrypt` API

3. decrypt the data using the VI and decrypted data key
