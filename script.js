var http = require("http");
var fs = require("fs");
var url = require("url");
var path  = require("path");
var ps = require("ps-list");
var procfs = require("procfs-stats");
var process = require("process");
var port = process.env.PORT || 8000;
var io = require("socket.io").listen(server, {log: true});

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
    for(var pid = 0; pid < pids.length; pid++){
	//console.log(pids[pid]);
	var process = procfs(pids[pid]);
	process.stat(function(res){
	    console.log(res);
	});
	/*procfs.meminfo(function(err, io){
	    //console.log(io);
	});*/
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
