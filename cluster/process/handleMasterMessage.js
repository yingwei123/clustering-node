const HandleMasterMessage = () => {
    return new Promise((resolve, reject) => {
        process.on('message', (msg) => {
            if (msg.type === 'pong') {
                resolve(msg.content);
            }
        });

        // Add a timeout to prevent hanging
        setTimeout(() => {
            reject(new Error('No response from master within timeout period.'));
        }, 5000); // 5-second timeout
    });
};

export default HandleMasterMessage;
