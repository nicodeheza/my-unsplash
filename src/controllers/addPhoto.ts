import {Prisma} from "@prisma/client";
import {Request, Response} from "express";
import imageServices from "../services/imageService";

export default async function addPhoto(req: Request, res: Response) {
	const {url, label} = req.body;
	if (!url || !label) {
		res.status(400).json({error: "all fields are required"});
	} else {
		try {
			const newImage = await imageServices.createImage(url, label);

			res.status(200).json(newImage);
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				console.log(error);
				res.status(400).json({error: "image already exists"});
			} else {
				console.log(error);
				res.status(500).json(error);
			}
		}
	}
}
