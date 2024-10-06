/**
 * Gracefully shuts down all workers in a cluster.
 * @param {Object} cluster - The cluster object to handle worker shutdown.
 */

let shuttingDown = false; // Flag to indicate if shutdown is in progress

const GracefulExit = (cluster) => {
    if (cluster.isPrimary && !shuttingDown) {
        shuttingDown = true; // Set the flag to indicate shutdown has started
        console.log('Master process received shutdown signal, gracefully shutting down workers...');

        // Send shutdown signal to all connected workers
        sendShutdownSignalToWorkers(cluster);

        // Setup event listeners to handle worker disconnect and exit
        setupClusterEventListeners(cluster);
    }
};

// Helper function to send shutdown signal to all workers
const sendShutdownSignalToWorkers = (cluster) => {
    for (const id in cluster.workers) {
        const worker = cluster.workers[id];
        if (worker.isConnected()) {
            console.log(`Sending shutdown signal to Worker ${worker.process.pid}...`);
            setTimeout(() => { // slight delay to avoid rapid concurrent communication issues
                try {
                    worker.send('shutdown');
                } catch (error) {
                    console.error(`Failed to send shutdown signal to Worker ${worker.process.pid}:`, error);
                }
            }, 100); // 100ms delay
        } else {
            console.log(`Worker ${worker.process.pid} is already disconnected.`);
        }
    }
};

// Helper function to set up event listeners for worker exit and disconnect events
const setupClusterEventListeners = (cluster) => {
    let disconnectedWorkers = 0;
    let exitedWorkers = 0;
    const totalWorkers = Object.keys(cluster.workers).length;

    // Handle worker disconnect event
    cluster.on('disconnect', (worker) => {
        disconnectedWorkers += 1;
        console.log(`Worker ${worker.process.pid} has disconnected.`);

        // If all workers have disconnected, check if they have also exited
        if (disconnectedWorkers === totalWorkers) {
            console.log('All workers have disconnected.');
            waitForAllWorkersToExit(exitedWorkers, totalWorkers);
        }
    });

    // Handle worker exit event
    cluster.on('exit', (worker, code, signal) => {
        exitedWorkers += 1;
        console.log(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}.`);

        // If all workers have exited, check if they were also disconnected
        if (exitedWorkers === totalWorkers && disconnectedWorkers === totalWorkers) {
            console.log('All workers have exited. Exiting master process.');
            process.exit(0);
        }
    });
};

// Helper function to wait for all workers to exit after they disconnect
const waitForAllWorkersToExit = (exitedWorkers, totalWorkers) => {
    // Wait a short period to ensure all exit events are logged
    setTimeout(() => {
        if (exitedWorkers === totalWorkers) {
            console.log('All workers have exited. Exiting master process.');
            process.exit(0);
        }
    }, 500); // 500ms delay to ensure all 'exit' events are captured
};

export default GracefulExit;