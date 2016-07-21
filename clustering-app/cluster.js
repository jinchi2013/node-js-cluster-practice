const cluster = require('cluster');
const workerCount = process.env.WORKER_COUNT || 2;

//Defines what each worker needs to run
//In this case, it's app.js a simple node http app
cluster.setupMaster({exec: 'app.js'});

function numWorkers(){
	return Object.keys(cluster.workers).length;
}

var stopping = false;

//Forks off the workers unless the server is stopping
function forkNewWorkers(){
	if(!stopping){
		for( var i = numWorkers(); i < workerCount; i++){
			cluster.fork();
		}
	}
}

//A list of workers queued for a restart
var workersToStop = [];

//Stops a single worker
//Gives 60 secons after disconnect before SIGTERM
function stopWorker(worker){
	console.log('stopping', worker.process.pid);
	worker.disconnect();
	var killTimer = setTimeout(()=> {
		worker.kill();
	}, 5000);

	//Ensure we don't stay up just for this setTimeout
	killTimer.unref();
}

function stopNextWorker(){
	var i = workersToStop.pop();
	var worker = cluster.workers[i];
	if(worker){
		stopWorker(worker);
	}
}

function stopAllWorkers(){
	stopping = true;
	console.log('stopping all workers');
	for(var id in cluster.workers){
		stopWorker(cluster.workers[id]);
	}
}

cluster.on('listening', stopNextWorker);

cluster.on('disconnect', forkNewWorkers);

//HUP signal sent to the master process to start restarting all the workers sequentially
process.on('SIGHUP', function(){
	console.log('restarting all workers');
	workersToStop = Object.keys(cluster.workers);
	stopNextWorker();
});

// Kill all the workers at once
process.on('SIGTERM', stopAllWorkers);

//Fork off the initial workers
forkNewWorkers();
console.log('app master', process.pid, 'booted');