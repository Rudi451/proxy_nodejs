const express = require('express');
const app = express();

const TARGET_URL = 'https://my-yoga.work:7002';

app.use((req, res) => {
	res.redirect(301, TARGET_URL);
});

app.listen(8080, () => {
	console.log(
		`Server läuft auf Port 8080 und leitet weiter nach ${TARGET_URL}`
	);
});
