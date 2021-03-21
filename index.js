"use strict";
require("dotenv").config();

const AWS = require("aws-sdk");
const crypto = require("crypto");

const kms = new AWS.KMS({ region: "us-west-2" });

async function encrypt(data) {

	const envelopeKey = await kms
		.generateDataKeyWithoutPlaintext({
			KeyId: process.env.KEY_ID,
			KeySpec: "AES_256"
		})
		.promise()
		.then(response => response.CiphertextBlob);

	const decryptEnvelopeKey = await kms
		.decrypt({
			KeyId: process.env.KEY_ID,
			CiphertextBlob: envelopeKey
		})
		.promise()
		.then(response => response.Plaintext);

	const iv = crypto.randomBytes(16);

	const cipher = crypto.createCipheriv("aes-256-ctr", decryptEnvelopeKey, iv);
	const encrypted = cipher.update(data, "utf8", "hex") + cipher.final("hex");

	return {
		data: encrypted,
		envelopeKey: envelopeKey.toString("base64"),
		iv: iv.toString("base64")
	};
}

async function decrypt(data, envelopeKey, iv) {

	const decryptEnvelopeKey = await kms
		.decrypt({
			KeyId: process.env.KEY_ID,
			CiphertextBlob: Buffer.from(envelopeKey, "base64")
		})
		.promise()
		.then(response => response.Plaintext);

	const decipher = crypto.createDecipheriv(
		"aes-256-ctr",
		decryptEnvelopeKey,
		Buffer.from(iv, "base64")
	);

	const decrypted = decipher.update(data, "hex", "utf8") + decipher.final("utf8")
	return decrypted
}

const dataToEncrypt = "Hello World";

encrypt(dataToEncrypt)
	.then(response => decrypt(response.data, response.envelopeKey, response.iv))
	.then(data => console.log(data === dataToEncrypt));
