import chai, {expect} from "chai";
import sinon, {SinonSpy, SinonStub} from "sinon";
import sinonChai from "sinon-chai";
import imageServices from "../../services/imageService";
import getPhotos from "../../controllers/getPhotos";
import {Request, Response} from "express";

const req1 = {
	query: {
		page: 0,
		label: "test"
	}
};
const req2 = {
	query: {
		page: 0,
		label: ""
	}
};
const badReq = {
	query: {
		page: undefined
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
const oneDay = 1000 * 60 * 60 * 24;
const images = new Array(10).fill(true).map((image, i) => ({
	id: i + 1,
	createdAt: new Date(Date.now() - (oneDay + i)),
	url: `https://test.com/${i + 1}`,
	label: `test image ${i + 1}`
}));

chai.use(sinonChai);

describe("getPhotos", function () {
	let jsonSpy: SinonSpy, statusSpy: SinonSpy, getStub: SinonStub;
	this.beforeEach(function () {
		jsonSpy = sinon.spy(res, "json");
		statusSpy = sinon.spy(res, "status");
		getStub = sinon.stub(imageServices, "getImages");
	});
	this.afterEach(function () {
		jsonSpy.restore();
		statusSpy.restore();
		getStub.restore();
	});
	it("get images successfully with page and label", async function () {
		getStub.callsFake(() => Promise.resolve(images));

		await getPhotos(req1 as unknown as Request, res as Response);
		expect(getStub).to.have.been.calledWith(0, "test");
		expect(statusSpy).to.have.been.calledWith(200);
		expect(jsonSpy).to.have.been.calledWith(images);
	});
	it("get images successfully only with page ", async function () {
		getStub.callsFake(() => Promise.resolve(images));

		await getPhotos(req2 as unknown as Request, res as Response);
		expect(getStub).to.have.been.calledWith(0, "");
		expect(statusSpy).to.have.been.calledWith(200);
		expect(jsonSpy).to.have.been.calledWith(images);
	});
	it("get images unsuccessfully", async function () {
		const testError = new Error("test error");
		getStub.callsFake(() => Promise.reject(testError));

		await getPhotos(req1 as unknown as Request, res as Response);
		expect(getStub).to.have.been.calledWith(0, "test");
		expect(statusSpy).to.have.been.calledWith(500);
		expect(jsonSpy).to.have.been.calledWith(testError);
	});
	it("try get images without page", async function () {
		getStub.callsFake(() => Promise.resolve(images));

		await getPhotos(badReq as unknown as Request, res as Response);
		expect(getStub).to.have.not.been.called;
		expect(statusSpy).to.have.been.calledWith(400);
		expect(jsonSpy).to.have.been.calledWith({message: "page is required"});
	});
});
