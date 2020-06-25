var port = process.argv[2] || 80;
var toport = process.argv[3] || 8123;

var http = require('http');
var httpProxy = require('http-proxy');

var clients = {};

var LOG = function (msg) { console.log(new Date() + ' :: ' + msg); }

var proxy = httpProxy.createProxyServer({target:'http://localhost:'+toport});
proxy.on('error', function(err) { LOG(err); });
proxy.on('proxyReq', function (proxyReq,req,res,options) { 
    var ip=req.connection.remoteAddress; 
    if (!clients[ip]) { clients[ip]=1; LOG("New IP Seen: "+ip); } else { clients[ip]++; }
});

var proxyServer = http.createServer(function (req,res) { proxy.web(req, res, {}); });
proxyServer.on('upgrade', function (req,socket,head) { proxy.ws(req,socket,head); });
proxyServer.listen(port);

LOG('Web Proxy Started :: ' + port + ' -> ' + toport);