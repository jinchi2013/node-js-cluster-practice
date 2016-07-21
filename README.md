# node-js-cluster-practice

cluster.fork is implemented on top of child_process.fork()

The extra stuff that cluster.fork brings is that, it will enable you to listen on a shared port.

So yeah, use cluster for web servers and child_process for workers