import {Request, Response} from "express";
import imageServices from "../services/imageService";

interface queryT {
	page?: string;
	label?: string;
}

export default async function getPhotos(req: Request, res: Response) {
	const {page, label}: queryT = req.query;
	const pageNum = Number(page);

	if (typeof pageNum !== "number" || isNaN(pageNum)) {
		res.status(400).json({message: "page is required"});
	} else {
		try {
			const images = await imageServices.getImages(pageNum, label);
			res.status(200).json(images);
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	}
}
