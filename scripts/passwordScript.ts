import Prompt from "prompt-sync";
import hashPassword from "../src/util/hashPassword";

const prompt = Prompt({
	sigint: true
});

export default async function createAdminPassword() {
	let password;
	password = prompt("Please enter a new password: ");

	if (!password) {
		console.log("Please don't enter an empty password");
		createAdminPassword();
	} else {
		try {
			const hash = await hashPassword(password);
			console.log("Copy the line below to your .env file:");
			console.log(`ADMIN_PASSWORD=${hash}`);
		} catch (err) {
			console.log(err);
		}
	}
}

createAdminPassword();
