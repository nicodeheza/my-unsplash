import chai, {expect} from "chai";
import {NextFunction, Request, Response} from "express";
import sinon, {SinonFake, SinonSpy, SinonStub} from "sinon";
import sinonChai from "sinon-chai";
import isAdmin from "../../middlewares/isAdmin";
import * as checkPassword from "../../util/checkPassword";

chai.use(sinonChai);

const req = {
	body: {
		password: ""
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

describe("isAdmin", function () {
	let checkStub: SinonStub, statusSpy: SinonSpy, jsonSpy: SinonSpy, nextFake: SinonSpy;
	this.beforeEach(function () {
		checkStub = sinon.stub(checkPassword, "default");
		statusSpy = sinon.spy(res, "status");
		jsonSpy = sinon.spy(res, "json");
		nextFake = sinon.fake();
	});
	this.afterEach(function () {
		// checkStub.restore();
		// statusSpy.restore();
		// jsonSpy.restore();
		// nextFake.restore();
		sinon.restore();
	});
	it("not password", async function () {
		req.body.password = "";
		await isAdmin(req as Request, res as Response, nextFake as NextFunction);
		expect(checkStub).to.not.have.been.called;
		expect(nextFake).to.not.have.been.called;
		expect(statusSpy).to.have.been.calledWith(401);
		expect(jsonSpy).to.have.been.calledWith({message: "empty password sended"});
	});
	it("incorrect password", async function () {
		req.body.password = "bad";
		checkStub.resolves(false);
		await isAdmin(req as Request, res as Response, nextFake as NextFunction);
		expect(checkStub).to.have.been.calledWith("bad");
		expect(nextFake).to.not.have.been.called;
		expect(statusSpy).to.have.been.calledWith(401);
		expect(jsonSpy).to.have.been.calledWith({message: "incorrect password"});
	});
	it("correct password", async function () {
		req.body.password = "good";
		checkStub.resolves(true);
		await isAdmin(req as Request, res as Response, nextFake as NextFunction);
		expect(checkStub).to.have.been.calledWith("good");
		expect(nextFake).to.have.been.called;
		expect(statusSpy).to.have.not.been.called;
		expect(jsonSpy).to.have.not.been.called;
	});
	it("not admin password set", async function () {
		req.body.password = "good";
		const testError = new Error("testError");
		checkStub.rejects(testError);
		await isAdmin(req as Request, res as Response, nextFake as NextFunction);
		expect(checkStub).to.have.been.calledWith("good");
		expect(nextFake).to.not.have.been.called;
		expect(statusSpy).to.have.been.calledWith(500);
		expect(jsonSpy).to.have.been.calledWith(testError);
	});
});
