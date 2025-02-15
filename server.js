const http = require('http');
const httpProxy = require('http-proxy');

// Erstelle einen Proxy-Server
const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
	const host = req.headers.host;

	// Routing basierend auf der Domain
	if (host === 'my-yoga.work') {
		proxy.web(req, res, {target: 'http://localhost:7002', secure: false});
	} else if (host === 'pingybot.com') {
		proxy.web(req, res, {target: 'http://localhost:5000', secure: false});
	} else {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end('Domain nicht gefunden');
	}
});

server.listen(7001, () => {
	console.log('Proxy-Server läuft auf Port 7001');
});
