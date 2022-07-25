import {PrismaClient} from "@prisma/client";
import chai, {expect} from "chai";
import sinon, {SinonFake} from "sinon";
import sinonChai from "sinon-chai";
import {ImageServices} from "../../services/imageService";

chai.use(sinonChai);

const testImage = {
	id: 1,
	createdAt: new Date(),
	url: "test.com",
	label: "test image"
};
const oneDay = 1000 * 60 * 60 * 24;
const testImages = new Array(10).fill(true).map((_, i) => ({
	id: i + 1,
	createdAt: new Date(Date.now() - oneDay * (i + 1)),
	url: `test.com/${i + 1}`,
	label: "test image"
}));

describe("imageServices", function () {
	describe("createImage", function () {
		it("can save new image and return result", async function () {
			const createFake = sinon.fake(() => Promise.resolve(testImage));
			const orm = {
				image: {
					create: createFake
				}
			};

			const imageService = new ImageServices(orm as unknown as PrismaClient);

			const result = await imageService.createImage(testImage.url, testImage.label);

			const callArgs: any[] = createFake.args[0];

			expect(callArgs[0]).to.be.deep.equal({
				data: {
					url: testImage.url,
					label: testImage.label
				}
			});

			expect(result).to.be.eqls(testImage);
		});
	});
	describe("deleteImage", function () {
		it("delete image by id", async function () {
			const createFake = sinon.fake(() => Promise.resolve(testImage));
			const orm = {
				image: {
					delete: createFake
				}
			};

			const imageService = new ImageServices(orm as unknown as PrismaClient);

			await imageService.deleteImage(testImage.id);

			const callArgs: any[] = createFake.args[0];

			expect(callArgs[0]).to.be.deep.equal({
				where: {
					id: 1
				}
			});
		});
	});
	describe("getImage", function () {
		const createFake = sinon.fake(() => Promise.resolve(testImages));
		const orm = {
			image: {
				findMany: createFake
			}
		};
		const imageService = new ImageServices(orm as unknown as PrismaClient);

		it("get first 10 images sorted by date that contains test", async function () {
			const result = await imageService.getImages(0, "test");

			const callArgs: any[] = createFake.args[0];

			expect(callArgs[0]).to.be.deep.equal({
				skip: 0,
				take: 10,
				where: {
					label: {
						contains: "test"
					}
				},
				orderBy: {
					createdAt: "desc"
				}
			});
			expect(result).to.be.eqls(testImages);
		});
		it("get second 10 images sorted by date", async function () {
			const result = await imageService.getImages(1);

			const callArgs: any[] = createFake.args[1];

			expect(callArgs[0]).to.be.deep.equal({
				skip: 10,
				take: 10,
				orderBy: {
					createdAt: "desc"
				}
			});
			expect(result).to.be.eqls(testImages);
		});
	});
});
