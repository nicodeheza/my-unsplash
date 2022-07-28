import {Prisma} from "@prisma/client";
import prisma from "../db/prisma";

export class ImageServices {
	private orm;
	constructor(orm = prisma) {
		this.orm = orm;
	}

	async createImage(url: string, label: string) {
		return await this.orm.image.create({
			data: {
				url,
				label
			}
		});
	}

	async deleteImage(id: number) {
		return await this.orm.image.delete({
			where: {
				id
			}
		});
	}

	async getImages(page: number, label?: string) {
		const query: Prisma.ImageFindManyArgs = {
			skip: page * 10,
			take: 10,
			orderBy: {
				createdAt: "desc"
			}
		};
		if (label) {
			query.where = {
				label: {
					contains: label,
					mode: "insensitive"
				}
			};
		}

		return await this.orm.image.findMany(query);
	}
}

const imageServices = new ImageServices();

export default imageServices;
