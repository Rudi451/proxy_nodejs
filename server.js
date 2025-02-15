const https = require('https');
const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');

// Erstelle einen Proxy-Server
const proxy = httpProxy.createProxyServer({});

const PATH_MY_YOGA = path.join(process.cwd(), '..', 'pingy_ver1', 'cert');
const PATH_PINGY_BOT = path.join(process.cwd(), '..', 'pingy2', 'cert');
// Lese Zertifikate für beide Domains ein
console.log('Path my yoga:', PATH_MY_YOGA);
console.log('Path pingybot:', PATH_PINGY_BOT);
const optionsMyYoga = {};
const optionsPingyBot = {};

try {
	optionsMyYoga.key = fs.readFileSync(
		path.join(PATH_MY_YOGA, 'my-yoga.work.key')
	);
	optionsMyYoga.cert = fs.readFileSync(
		path.join(PATH_MY_YOGA, 'my-yoga.work.cer')
	);
	optionsMyYoga.ca = fs.readFileSync(path.join(PATH_MY_YOGA, 'ca.cer'));
} catch (err) {
	console.log('Fehler beim Laden von optionsMyYoga:', err);
}

try {
	optionsPingyBot.key = fs.readFileSync(
		path.join(PATH_PINGY_BOT, 'privkey.pem')
	);
	optionsPingyBot.cert = fs.readFileSync(
		path.join(PATH_PINGY_BOT, 'fullchain.pem')
	);
} catch (err) {
	console.log('Fehler beim Laden von optionsPingyBot:', err);
}

// HTTPS Server mit Routing auf Basis der Domain
const server = https.createServer(optionsMyYoga, (req, res) => {
	const host = req.headers.host;

	if (host === 'my-yoga.work') {
		// Proxy-Anfrage für my-yoga.work
		console.log('my yoga abgerufen');
		proxy.web(req, res, {
			target: 'http://localhost:7002',
			key: optionsMyYoga.key,
			cert: optionsMyYoga.cert,
			ca: optionsMyYoga.ca,
			changeOrigin: true,
		});
	} else if (host === 'pingybot.com') {
		// Proxy-Anfrage für pingybot.com
		console.log('pingybot ist abgerufen');
		proxy.web(req, res, {
			target: 'http://localhost:5000',
			key: optionsPingyBot.key,
			cert: optionsPingyBot.cert,
			changeOrigin: true,
		});
	} else {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end('Domain nicht gefunden');
	}
});

server.listen(7001, () => {
	console.log('HTTPS Proxy-Server läuft auf Port  auf 7001');
});
