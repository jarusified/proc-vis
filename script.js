var ps = require("ps-list");
var fs = require("fs");
var procfs = require("procfs-stats");
var process = require("process");
var http = require("http");
var port = process.env.PORT || 8001;
var file = fs.readFileSync("index.html");
var io = require("socket.io").listen(server, {log: true});

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
	procfs.meminfo(function(err, io){
	    //console.log(io);
	});
    }
}

var server = http.createServer(function(req, res){
    // Wow never use res.write without headers
    res.setHeader('Content-Type', 'text/html');
    console.log(file);
    res.end(file);
}).listen(port);
