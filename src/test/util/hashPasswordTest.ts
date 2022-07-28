import chai, {expect} from "chai";
import sinon, {SinonSpy, SinonStub} from "sinon";
import sinonChai from "sinon-chai";
import crypto from "crypto";
import hashPassword from "../../util/hashPassword";

chai.use(sinonChai);

describe("hashPassword", function () {
	let randomBytesStub: SinonStub, scryptStub: SinonStub;
	before(function () {
		randomBytesStub = sinon.stub(crypto, "randomBytes");
		randomBytesStub.callsFake(() => Buffer.from("1111", "hex"));

		scryptStub = sinon.stub(crypto, "scrypt");
		scryptStub.callsFake(
			(
				pass: string,
				salt: string,
				n: number,
				cb: (err: Error | null, derivedKey: Buffer) => void
			) => {
				cb(null, Buffer.from("2222", "hex"));
			}
		);
	});
	after(function () {
		randomBytesStub.restore();
		scryptStub.restore();
	});
	it("return hashed password", async function () {
		const result = await hashPassword("test");
		expect(randomBytesStub).to.have.been.calledWith(16);
		expect(scryptStub).to.have.been.calledWith("test", "1111", 64);

		expect(result).to.be.equals("1111:2222");
	});
});
