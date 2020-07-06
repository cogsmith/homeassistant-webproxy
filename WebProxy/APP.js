var port = process.argv[2] || 80;
var toport = process.argv[3] || 8123;

var http = require('http');
var httpProxy = require('http-proxy');

var App = {};

App.Run = function () {
    var clients = {};
    var LOG = function (msg) { console.log(msg); };

    var proxy = httpProxy.createProxyServer({target:'http://localhost:'+toport});
    proxy.on('error', function(err) { LOG(err); });
    proxy.on('proxyReq', function (proxyReq,req,res,options) { 
        var ip=req.connection.remoteAddress;
        if (!clients[ip]) { clients[ip]=1; LOG('WebProxy.NewIP:'+ip); } else { clients[ip]++; }
        //LOG('WebProxy:'+ip+':'+proxyReq.path);

        //if (proxyReq.path.startsWith('/local_')) { proxyReq.path='/hassio/ingress'+proxyReq.path; };
        if (proxyReq.path=='/local_hxjs') { proxyReq.path='/hassio/ingress/local_hxjs'; };
    });

    var proxyServer = http.createServer(function (req,res) {
        var ip=req.connection.remoteAddress;

                if (ip.substr(0,3)=='10.') { return proxy.web(req,res,{}); }
        if (ip.substr(0,10)=='::ffff:10.') { return proxy.web(req,res,{}); }

                if (ip.substr(0,8)=='192.168.') { return proxy.web(req,res,{}); }
        if (ip.substr(0,15)=='::ffff:192.168.') { return proxy.web(req,res,{}); }

        res.end('DENY:'+ip);
    });

    proxyServer.on('upgrade', function (req,socket,head) { proxy.ws(req,socket,head); });
    proxyServer.listen(port);

    LOG('WebProxy:'+port+'->'+toport);
};

App.Run();