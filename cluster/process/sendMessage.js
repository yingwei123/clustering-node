const SendMessage = (message) => {
    if (process.send) {
        try {
            process.send({ type: 'message', message: message });
        } catch (error) {
            console.error(`Failed to send message to master:`, error);
        }
    }
};

export default SendMessage;
