const http = require('http');
const httpProxy = require('http-proxy');
const net = require('net');
const url = require('url');

// Erstelle einen Proxy-Server
const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
	const host = req.headers.host;
	console.log('host from req.headers. host:', host);

	const parsedUrl2 = url.parse(req.url);
	console.log('parsedUrl: ', parsedUrl2);
	const target2 = parsedUrl2.protocol + '//' + parsedUrl2.hostname;
	console.log('target2: ', target2);
});

server.listen(7001, () => {
	console.log('Proxy-Server läuft auf Port 7001');
});

server.on('connect', (req, socket) => {
	console.log('Receiving reverse proxy request for: ', req.url);

	const serverUrl = url.parse('https://' + req.url);

	const srvSocket = net.connect(serverUrl.port, serverUrl.hostname, () => {
		socket.write(
			'HTTP/1.1 200 Connection Established\r\n' +
				'Proxy-agent: Node-Proxy\r\n' +
				'\r\n'
		);
		srvSocket.pipe(socket);
		socket.pipe(srvSocket);
	});
});
