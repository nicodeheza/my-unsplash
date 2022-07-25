import chai, {expect} from "chai";
import addPhoto from "../../controllers/addPhoto";
import sinon, {SinonSpy, SinonStub} from "sinon";
import sinonChai from "sinon-chai";
import imageServices from "../../services/imageService";

import {Request, Response} from "express";
import {Prisma} from "@prisma/client";

chai.use(sinonChai);

const req = {
	body: {
		url: "test.com",
		label: "test photo"
	}
};

const badReq = {
	body: {
		url: "test.com"
	}
};

const res = {
	status(s: number) {
		return this;
	},
	json(o: {[key: string]: any}) {
		return this;
	}
};

describe("addPhoto", function () {
	let statusSpy: SinonSpy, jsonSpy: SinonSpy, createStub: SinonStub;
	const testImage = {
		id: 1,
		createdAt: new Date(),
		url: req.body.url,
		label: req.body.label
	};
	this.beforeEach(function () {
		statusSpy = sinon.spy(res, "status");
		jsonSpy = sinon.spy(res, "json");
		createStub = sinon.stub(imageServices, "createImage");
	});
	this.afterEach(function () {
		statusSpy.restore();
		jsonSpy.restore();
		createStub.restore();
		console.log("restore");
	});
	it("I can add a photo with an url and a description and send correct response", async function () {
		createStub.callsFake(() => Promise.resolve(testImage));

		await addPhoto(req as Request, res as Response);

		expect(createStub).to.have.been.calledWith(req.body.url, req.body.label);

		expect(statusSpy).to.have.been.calledWith(200);
		expect(jsonSpy).to.have.been.calledWith(testImage);
	});

	it("on error send error message and status 500", async function () {
		const testError = new Error("test error");
		createStub.callsFake(() => Promise.reject(testError));

		await addPhoto(req as Request, res as Response);

		expect(createStub).to.have.been.called;

		expect(statusSpy).to.have.been.calledWith(500);
		expect(jsonSpy).to.have.been.calledWith(testError);
	});
	it("if request date is incomplete send an error message and status 400", async function () {
		await addPhoto(badReq as Request, res as Response);

		expect(createStub).to.have.not.been.called;

		expect(statusSpy).to.have.been.calledWith(400);
		expect(jsonSpy).to.have.been.calledWith({error: "all fields are required"});
	});

	it("if try to save an image url that exist send status 400 and 'image already exists'", async function () {
		const error = new Prisma.PrismaClientKnownRequestError(
			"image already exists",
			"P2002",
			"V1"
		);
		createStub.callsFake(() => Promise.reject(error));
		await addPhoto(req as Request, res as Response);

		expect(createStub).to.have.been.called;

		expect(statusSpy).to.have.been.calledWith(400);
		expect(jsonSpy).to.have.been.calledWith({error: "image already exists"});
	});
});
