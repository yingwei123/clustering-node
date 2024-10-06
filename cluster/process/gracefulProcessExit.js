/**
 * Attaches graceful shutdown behavior to a server in a worker process.
 * @param {Object} server - The server instance to manage graceful shutdown.
 */
const GracefulProcessExit = (server) => {
    console.log(`GracefulProcessExit attached to Worker ${process.pid}`);

    // Listen for 'shutdown' message from the master process
    process.on('message', (msg) => {
        if (msg === 'shutdown') {
            initiateGracefulShutdown(server);
        }
    });
};

/**
 * Initiates the graceful shutdown process for the worker server.
 * @param {Object} server - The server instance to close gracefully.
 */
const initiateGracefulShutdown = (server) => {
    console.log(`Worker ${process.pid} is shutting down...`);

    // Stop accepting new connections and close the server gracefully
    server.close(() => {
        console.log(`Worker ${process.pid} has closed server and is disconnecting.`);
        disconnectFromMaster();
    });

    // Set a timeout to forcefully exit if shutdown takes too long
    enforceShutdownTimeout();
};

/**
 * Disconnects the worker process from the master.
 * Ensures that the worker is properly disconnected after closing the server.
 */
const disconnectFromMaster = () => {
    try {
        process.disconnect();
        console.log(`Worker ${process.pid} has successfully disconnected from the master.`);
    } catch (error) {
        console.error(`Failed to disconnect Worker ${process.pid}:`, error);
    }
};

/**
 * Forces the worker process to exit if it fails to shut down gracefully within the timeout.
 * This ensures that no worker is left hanging indefinitely.
 */
const enforceShutdownTimeout = () => {
    setTimeout(() => {
        console.error(`Worker ${process.pid} did not close in time. Forcefully shutting down.`);
        process.exit(1);
    }, 5000); // 5-second timeout to enforce shutdown
};

export default GracefulProcessExit;
