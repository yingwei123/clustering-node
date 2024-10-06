const NotifyExit = () => {
    if (process.send) {
        try {
            process.send({ type: 'exit', pid: process.pid });
            console.log(`Worker ${process.pid} sent exit notification to master.`);
        } catch (error) {
            console.error(`Failed to send exit notification for Worker ${process.pid}:`, error);
        }
    } else {
        console.warn(`Worker ${process.pid} is not running as part of a cluster, unable to notify master.`);
    }
};

export default NotifyExit;
