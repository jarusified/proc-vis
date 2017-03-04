var ps = require("ps-list");
var fs = require("fs");
var procfs = require("procfs-stats");
var process = require("process");
var http = require("http");
var port = process.env.PORT || 8000;
var file = fs.readFileSync("index.html");
var io = require("socket.io").listen(server, {log: true});
var ip = "192.168.1.0";

var processList = [];
ps().then(function(res){
    for(var i = 0; i < res.length; i++){
	processList.push(res[i].pid);
    }
    getStats(processList)
});

function getStats(pids){
    for(var pid = 0; pid < pids.length; pid++){
	console.log(pids[pid]);
	var process = procfs(pids[pid]);
	procfs.meminfo(function(err, io){
	    console.log(io);
	});
    }
}

var server = http.createServer(function(req, res){
    res.writeHead(200, '{Content-Type: text/html}');
    res.write(file);
}).listen(port, ip);
