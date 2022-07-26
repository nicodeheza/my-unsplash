import chai, {expect} from "chai";
import sinon, {SinonSpy, SinonStub} from "sinon";
import sinonChai from "sinon-chai";
import imageServices from "../../services/imageService";
import deletePhoto from "../../controllers/deletePhoto";
import {Request, Response} from "express";

const req = {
	params: {
		id: 1
	}
};
const badReq = {
	params: {
		id: undefined
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

chai.use(sinonChai);

describe("deletePhoto", function () {
	let statusSpy: SinonSpy, jsonSpy: SinonSpy, deleteStub: SinonStub;
	this.beforeEach(function () {
		statusSpy = sinon.spy(res, "status");
		jsonSpy = sinon.spy(res, "json");
		deleteStub = sinon.stub(imageServices, "deleteImage");
	});
	this.afterEach(function () {
		statusSpy.restore();
		jsonSpy.restore();
		deleteStub.restore();
	});
	it("delete photo successfully", async function () {
		deleteStub.callsFake(() => Promise.resolve(true));
		await deletePhoto(req as unknown as Request, res as Response);

		expect(deleteStub).to.have.been.calledWith(1);
		expect(statusSpy).to.have.been.calledWith(200);
		expect(jsonSpy).to.have.been.calledWith({message: "image deleted successfully"});
	});
	it("delete photo unsuccessfully", async function () {
		const testError = new Error("test error");
		deleteStub.callsFake(() => Promise.reject(testError));
		await deletePhoto(req as unknown as Request, res as Response);

		expect(deleteStub).to.have.been.calledWith(1);
		expect(statusSpy).to.have.been.calledWith(500);
		expect(jsonSpy).to.have.been.calledWith(testError);
	});
	it("send req with no id", async function () {
		deleteStub.callsFake(() => Promise.resolve(true));
		await deletePhoto(badReq as unknown as Request, res as Response);

		expect(deleteStub).to.have.not.been.called;
		expect(statusSpy).to.have.been.calledWith(400);
		expect(jsonSpy).to.have.been.calledWith({message: "id is required"});
	});
});
