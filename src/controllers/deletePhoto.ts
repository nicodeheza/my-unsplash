import {Request, Response} from "express";
import imageServices from "../services/imageService";

export default async function deletePhoto(req: Request, res: Response) {
	const {id} = req.params;
	if (!id) {
		res.status(400).json({message: "id is required"});
	} else {
		try {
			await imageServices.deleteImage(Number(id));
			res.status(200).json({message: "image deleted successfully"});
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	}
}
