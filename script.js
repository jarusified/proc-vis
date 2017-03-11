var http = require("http");
var fs = require("fs");
var url = require("url");
var path  = require("path");
var ps = require("ps-list");
var procfs = require("procfs-stats");
var process = require("process");
var port = process.env.PORT || 8001;

var file = fs.readFileSync("index.html");
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"};

var processList = [];
ps().then(function(res){
    for(var i = 0; i < res.length; i++){
	processList.push(res[i].pid);
    }
    getStats(processList)
});

function getStats(pids){
    for(var pid = 0; pid < 3; pid++){
	var process = procfs(pids[pid]);
	process.statm(function(err, data){
	   //console.log(data);
	});
    }
}


var server = http.createServer(function(req, res){
    // Wow never use res.write without headers
    var uri = url.parse(req.url).pathname
    var filename = path.join(process.cwd(), uri);
    console.log(filename);
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

io.sockets.on('connection', function (socket) {
    socket.on('process', function (data) {
	io.sockets.emit('update', data);
    });
});
