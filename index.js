/**
 * Created by chi on 7/19/16.
 */
var cluster = require('cluster');
var http = require('http');
var numOfWorkers = require('os').cpus().length;
var factorial = function factorial(num){
    if(num === 1 || num === 0) {
        return 1;
    } else {
        return num * factorial(num-1);
    }
};

if(cluster.isMaster){
    console.log('Master cluster setting up ' + numOfWorkers + ' workers... ');

    for(var i = 0; i < numOfWorkers; i++){
        var worker =  cluster.fork();

        worker.on('message', function(message){
            console.log(message.from + ': ' + message.type + ' ' + message.data.number + ' = ' + message.data.result );
        });
    }

    cluster.on('online', function(worker){
        console.log('Worker ' + worker.process.pid + ' is online ');
    });

    for (var wid in cluster.workers){
        cluster.workers[wid].send({
            type:'factorial',
            from:'master',
            data: {
                number: Math.floor(Math.random() * 50)
            }
        });
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        var worker = cluster.fork();
        worker.on('message', function(message) {
            console.log(message.from + ': ' + message.type + ' ' + message.data.number + ' = ' + message.data.result);
        });
    });

} else {

    process.on('message', function(message){
        if(message.type === 'factorial'){
            process.send({
                type:'factorial',
                from: 'Worker ' + process.pid,
                data: {
                    number: message.data.number,
                    result: factorial(message.data.number)
                }
            });
        }
    });

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