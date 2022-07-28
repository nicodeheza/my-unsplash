import {NextFunction, Request, Response} from "express";
import checkPassword from "../util/checkPassword";

export default async function isAdmin(req: Request, res: Response, next: NextFunction) {
	const {password} = req.body;
	if (!password) return res.status(401).json({message: "empty password sended"});
	try {
		const itIs = await checkPassword(password);
		if (!itIs) return res.status(401).json({message: "incorrect password"});
		next();
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
}
