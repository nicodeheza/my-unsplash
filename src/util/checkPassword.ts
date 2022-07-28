import {scrypt} from "crypto";
import "dotenv/config";

export default function checkPassword(password: string): Promise<boolean> {
	const adminHash = process.env.ADMIN_PASSWORD;
	if (!adminHash) throw new Error("no admin password found");

	const [salt, hash] = adminHash.split(":");

	return new Promise((resolve, reject) => {
		scrypt(password, salt, 64, (err, buffer) => {
			if (err) reject(err);
			resolve(buffer.toString("hex") === hash);
		});
	});
}
