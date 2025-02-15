const http = require('http');

const TARGET_URL = 'https://my-yoga.work:7001'; // Zieladresse für die Weiterleitung

const server = http.createServer((req, res) => {
	res.writeHead(302, {Location: TARGET_URL});
	res.end();
});

server.listen(7001, () => {
	console.log('Server läuft auf Port 7001 und leitet weiter nach', TARGET_URL);
});
