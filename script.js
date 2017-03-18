var http = require("http");
var fs = require("fs");
var url = require("url");
var path  = require("path");
var ps = require("ps-list");
var procfs = require("procfs-stats");
var process = require("process");
var port = process.env.PORT|| 8080;
var q = require("q");

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"};

var pidList = [];
var pidData = {};

var getData = function(res){
    var deferred = q.defer();
    pidData.length = res.length;
    pidData.processes = [];
    i = 0;
    while(i<res.length){
	getMemStat(res[i].pid).then(function(mem){
	    pidData.pid = res[i].pid;
	    pidData["pid"]["mem"] = mem;
	});
	//pidData.processes.pusH({ pid: res[i].pid});
	i++;
    }
    deferred.resolve(pidData);
    return deferred.promise;
}

var getMemStat = function(pid){
    var deferred = q.defer();
    var process = procfs(pid);
    process.statm(function(err, data){
	pidData.a = data;
	pidData.processes.push(data);
	deferred.resolve(data);
    });
    return deferred.promise;
}

ps().then(function(res){
    console.log("entry");
    getData(res).then(function(data){
	io.sockets.on('connection', function (socket) {
	    io.sockets.emit('position', data);
	});
	console.log("resolved");
    });
});


var server = http.createServer(function(req, res){
    // Wow never use res.write without headers
    var uri = url.parse(req.url).pathname
    var filename = path.join(process.cwd(), uri);
    fs.exists(filename, function(exists){
	if(!exists){
	    console.log("[404]" + filename);
	    res.writeHead(200, {'Content-Type': 'text/plain'});
	    res.write('404 Not Found\n');
	    res.end();
	}
	var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
	res.writeHead(200, {'Content-Type': mimeType });
	var fileStream = fs.createReadStream(filename);
	fileStream.pipe(res);
    });;

}).listen(port);

var io = require("socket.io").listen(server, {log: true});


setTimeout(function(){
},3000);
