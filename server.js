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
const optionsMyYoga = {
	key: fs.readFileSync(path.join(PATH_MY_YOGA, 'my-yoga.work.key')),
	cert: fs.readFileSync(path.join(PATH_MY_YOGA, 'my-yoga.work.cer')),
	ca: fs.readFileSync(path.join(PATH_MY_YOGA, 'ca.cer')),
};

const optionsPingyBot = {
	key: fs.readFileSync(path.join(PATH_PINGY_BOT, 'privkey.pem')),
	cert: fs.readFileSync(path.join(PATH_PINGY_BOT, 'fullchain.pem')),
};

// HTTPS Server mit Routing auf Basis der Domain
const server = https.createServer((req, res) => {
	const host = req.headers.host;

	if (host === 'my-yoga.work') {
		// Proxy-Anfrage für my-yoga.work
		proxy.web(req, res, {
			target: 'http://localhost:7001',
			key: optionsMyYoga.key,
			cert: optionsMyYoga.cert,
			ca: optionsMyYoga.ca,
			changeOrigin: true,
		});
	} else if (host === 'pingybot.com') {
		// Proxy-Anfrage für pingybot.com
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

server.listen(8080, () => {
	console.log('HTTPS Proxy-Server läuft auf Port 8080 mit forwarding auf 443');
});
