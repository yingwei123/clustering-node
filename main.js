import cluster from 'cluster';
import os from 'os';
import GracefulExit from './cluster/GracefulExit.js';

cluster.schedulingPolicy = cluster.SCHED_RR; //use round robin scheduling of requests
const numCPUs = os.cpus().length;

// Add error handling for cluster fork
cluster.on('error', (error) => {
    console.error('Cluster error:', error);
});

// Function to run in the master process
const runMaster = () => {
    console.log(`Master ${process.pid} is running`);

    // Fork workers and set up handlers
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();
        console.log(`Cluster ${i} is forked with PID ${worker.process.pid}`);

        // Add error handling for individual workers
        worker.on('error', (error) => {
            console.error(`Worker ${worker.process.pid} encountered an error:`, error);
        });

        // Use the helper function to set up message handlers and pipe output
        setupWorker(worker);
    }

    // Handle shutdown signals
    process.on('SIGTERM', () => {
        console.log('Received SIGTERM, initiating graceful shutdown...');
        GracefulExit(cluster);
    });

    process.on('SIGINT', () => {
        console.log('Received SIGINT, initiating graceful shutdown...');
        GracefulExit(cluster);
    });
};

// Function to run in the worker process
const runWorker = async () => {
    try {
        await import('./server/app.js');
        console.log(`Worker ${process.pid} has started.`);
    } catch (err) {
        console.error(`Error starting worker ${process.pid}:`, err);
    }
};

// Helper function to setup worker for handling messages
const setupWorker = (worker) => {
    handleWorkerMessages(worker);
};

// Helper function to handle worker messages
const handleWorkerMessages = (worker) => {
    worker.on('message', (msg) => {
        if (msg.type === 'exit') {
            console.log(`Master received exit message from Worker ${msg.pid}. Killing the worker...`);
            worker.kill('SIGTERM');
            console.log(`Worker ${worker.process.pid} killed`);

            // Fork a new worker to replace the killed one
            const newWorker = cluster.fork();
            console.log(`New worker forked with PID ${newWorker.process.pid}`);
            handleWorkerMessages(newWorker); // Attach message handler to the new worker
        }

        if (msg.type === 'disconnect') {
            console.log(`Master received disconnect message from Worker ${msg.pid}. Killing the worker...`);
            worker.kill('SIGTERM');
            console.log(`Worker ${worker.process.pid} killed`);

            // Optionally, fork a new worker and set up message handler
            const newWorker = cluster.fork();
            console.log(`New worker forked with PID ${newWorker.process.pid}`);
            handleWorkerMessages(newWorker); // Attach message handler to the new worker
        }

        if (msg.type === 'message') {
            console.log(`Master received message from Worker ${msg.pid}. Message: ${msg.message}`);
            worker.send({ type: 'pong', content: 'pong' });
        }
    });
};

// Run the appropriate function based on whether the current process is the master or a worker
if (cluster.isPrimary) {
    runMaster();
} else {
    runWorker();
}
