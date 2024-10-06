const NotifyDisconnect = () => {
    if (process.send) {
        try {
            process.send({ type: 'disconnect', pid: process.pid });
            console.log(`Worker ${process.pid} sent disconnect notification to master.`);
        } catch (error) {
            console.error(`Failed to send disconnect notification for Worker ${process.pid}:`, error);
        }
    } else {
        console.warn(`Worker ${process.pid} is not running as part of a cluster, unable to notify master.`);
    }
};

export default NotifyDisconnect;
