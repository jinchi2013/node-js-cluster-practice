# node-js-cluster-practice

cluster.fork is implemented on top of child_process.fork()

The extra stuff that cluster.fork brings is that, it will enable you to listen on a shared port.

So yeah, use cluster for web servers and child_process for workers

cluskter.fork() as an implementation if child_process.fork(),
the clusters can communicate with the parent via IPC and pass server handles back and forth

IPC: inter-process communication

So we have HTTP/HTTPS/NET => cluster

So a worker would be => child-process