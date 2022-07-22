import "dotenv/config";
import express from "express";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

if (process.env.NODE_ENV === "production") {
	app.use(express.static(__dirname + "/public"));
	app.get("/", (req, res) => {
		res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
	});
}

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`app listening in port ${port}`);
});
