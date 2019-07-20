try {
	const express = require("express");
	const path = require("path");

	const app = express();

	app.use("/", express.static(path.join(__dirname, ".")));
	app.listen(process.env.PORT || 8080, () => {
		console.log("server running");
	});
	console.log("finish");
} catch (e) {
	console.error(e);
}
