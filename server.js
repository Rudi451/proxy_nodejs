const http = require('http');
const httpProxy = require('http-proxy');

//
// Setup proxy server with forwarding
//
httpProxy
	.createServer({
		target: {
			port: 7002,
			host: 'localhost',
		},
		forward: {
			port: 5000,
			host: 'localhost',
		},
	})
	.listen(7001);

//
// Target Http Server
//
http
	.createServer(function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(
			'request successfully proxied to: ' +
				req.url +
				'\n' +
				JSON.stringify(req.headers, true, 2)
		);
		res.end();
	})
	.listen(7002);

//
// Target Http Forwarding Server
//
http
	.createServer(function (req, res) {
		console.log('Receiving forward for:', req.url);
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(
			'request successfully forwarded to: ' +
				req.url +
				'\n' +
				JSON.stringify(req.headers, true, 2)
		);
		res.end();
	})
	.listen(5000);
