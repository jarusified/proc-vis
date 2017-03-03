var ps = require("ps-list");
var procfs = require("procfs-stats");
var process = require("process");

var i = 0;
ps().then(function(res){
    console.log(res[i].pid);
    return getStats(res[i].pid);
});

function getStats(pid){
    console.log(pid);
    var process = procfs(pid);
    process.meminfo(function(err, io){
	console.log(io);
    });
}
