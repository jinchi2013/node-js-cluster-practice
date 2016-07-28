const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

console.log(cluster.isMaster);

//
if(cluster.isMaster){
	for(var i = 0; i < numCPUs; i++){
		cluster.fork();
	}

	cluster.on('online', (worker) => {
		console.log(`worker ${worker.process.pid} is online`);
	});

	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
	});
} else {
	http.createServer((req, res) => {
		console.log(`this process is pid ${process.pid}`);

		res.writeHead(200);
		res.end('hello world\n');
	}).listen(8000);
}