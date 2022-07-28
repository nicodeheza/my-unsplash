import {randomBytes, scrypt} from "crypto";

export default function hashPassword(password: string) {
	return new Promise((resolve, reject) => {
		const salt = randomBytes(16).toString("hex");

		scrypt(password, salt, 64, (err, buffer) => {
			if (err) reject(err);
			resolve(salt + ":" + buffer.toString("hex"));
		});
	});
}
