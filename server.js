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
