const express = require('express');
const app = express();

const TARGET_URL = 'https://my-yoga.work:7002';

app.get('/', (req, res) => {
	res.send('hallochen');
});
app.use((req, res) => {
	res.redirect(301, TARGET_URL);
});

app.listen(7001, () => {
	console.log(
		`Server läuft auf Port 7001 und leitet weiter nach ${TARGET_URL}`
	);
});
