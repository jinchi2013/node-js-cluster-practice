/**
 * Created by chi on 7/19/16.
 */
var cluster = require('cluster');
var http = require('http');
var numOfWorkers = require('os').cpus().length;

if(cluster.isMaster){
    console.log('Master cluster setting up ' + numOfWorkers + ' workers... ');

    for(var i = 0; i < numOfWorkers; i++){
        cluster.fork();
    }

    cluster.on('online', function(worker){
        console.log('Worker ' + worker.process.pid + ' is online ');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });

} else {
    var app = require('express')();
    app.all('/*', function(req, res) {
        res
            .send('process ' + process.pid + ' says hello!')
            .end();
    });

    var server = app.listen(8000, function() {
        console.log('Process ' + process.pid + ' is listening to all incoming requests');
    });
}