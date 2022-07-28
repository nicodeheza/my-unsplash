import "dotenv/config";
import chai, {expect} from "chai";
import sinon, {SinonStub} from "sinon";
import sinonChai from "sinon-chai";
import checkPassword from "../../util/checkPassword";
import crypto from "crypto";

chai.use(sinonChai);

describe("checkPassword", function () {
	let scryptStub: SinonStub;
	this.beforeEach(function () {
		scryptStub = sinon.stub(crypto, "scrypt");
	});
	this.afterEach(function () {
		scryptStub.restore();
	});

	it("if not password set in env throw an error", async function () {
		process.env.ADMIN_PASSWORD = "";
		try {
			await checkPassword("test");
		} catch (error) {
			expect(error).to.be.an("error");
		}
	});
	it("if password is correct return true", async function () {
		process.env.ADMIN_PASSWORD = "1111:2222";
		scryptStub.callsFake(
			(
				pass: string,
				salt: string,
				n: number,
				cb: (err: Error | null, buffer: Buffer) => void
			) => {
				cb(null, Buffer.from("2222", "hex"));
			}
		);
		const result = await checkPassword("2222");
		expect(result).to.be.equal(true);
		expect(scryptStub).to.have.been.calledWith("2222", "1111", 64);
	});
	it("if password is incorrect return false", async function () {
		process.env.ADMIN_PASSWORD = "1111:2222";
		scryptStub.callsFake(
			(
				pass: string,
				salt: string,
				n: number,
				cb: (err: Error | null, buffer: Buffer) => void
			) => {
				cb(null, Buffer.from("5555", "hex"));
			}
		);
		const result = await checkPassword("5555");
		expect(result).to.be.equal(false);
		expect(scryptStub).to.have.been.calledWith("5555", "1111", 64);
	});
});
