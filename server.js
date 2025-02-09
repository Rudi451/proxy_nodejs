const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

const server = http.createServer((req, res) => {
	const host = req.headers.host;

	const targetMap = {
		'my-yoga.work': 'http://localhost:7001',
		'pingybot.com/*': 'http://localhost:5000',
		// 'pingybot.com/.well-known/acme-challenge/KZ6x1S-MB47Njq-_a5_OR8TSZfP5SP4Ba0etjawsM1w'
	};

	if (targetMap[host]) {
		proxy.web(
			req,
			res,
			{target: targetMap[host], changeOrigin: true},
			(err) => {
				console.error(`Fehler beim Proxying zu ${targetMap[host]}:`, err);
				res.writeHead(404, {'Content-Type': 'text/plain'});
				res.end('404 - Zielserver nicht erreichbar');
			}
		);
	} else {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end('404 - Domain nicht gefunden');
	}
});

server.listen(8080, () => {
	console.log('Proxy-Server läuft auf Port 8080');
});
