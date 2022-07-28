import {faker} from "@faker-js/faker";
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

interface dataT {
	url: string;
	label: string;
	createdAt: Date;
}

function randomNum(min: number, max: number) {
	const diff = max - min;
	let random = Math.random();
	random = Math.floor(random * diff);
	random += min;
	return random;
}

function createFakeData(numOfRecord: number) {
	const records: dataT[] = [];
	const imageWidth = randomNum(500, 1920);
	const imageHeight = randomNum(500, 1080);
	for (let i = 0; i < numOfRecord; i++) {
		const newRecord: dataT = {
			url: faker.image.image(imageWidth, imageHeight, true),
			label: faker.lorem.words(),
			createdAt: new Date(faker.date.recent(30))
		};
		records.push(newRecord);
	}

	return records;
}

async function populateDb(numOfRecord: number) {
	console.log("deleting old records...");
	await prisma.image.deleteMany({});

	console.log("creating fake data...");
	const fakeData = createFakeData(numOfRecord);

	console.log("saving data...");
	await prisma.image.createMany({
		data: fakeData,
		skipDuplicates: true
	});

	console.log("Done");
}

populateDb(200);
