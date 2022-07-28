import Prompt from "prompt-sync";
import hashPassword from "./hashPassword";

const promptI = Prompt({
	sigint: true
});

export default async function createAdminPassword(prompt: Prompt.Prompt = promptI) {
	let password;
	password = prompt("Please enter a new password: ");

	if (!password) {
		console.log("Please don't enter an empty password");
		createAdminPassword(prompt);
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
