import Router from 'express';
import NotifyExit from '../cluster/process/notifyExit.js';
import NotifyDisconnect from '../cluster/process/notifyDisconnect.js';
import HandleMasterMessage from '../cluster/process/handleMasterMessage.js';
import SendMessage from '../cluster/process/sendMessage.js';
const processRouter = Router();

processRouter.get('/exit', (req, res) => {
    res.send(`Worker ${process.pid} is initiating graceful shutdown`);
    NotifyExit();
});

processRouter.get('/disconnect', (req, res) => {
    res.send(`Worker ${process.pid} is initiating disconnecting`);
    NotifyDisconnect();
});

processRouter.get('/message/ping', async (req, res) => {
    SendMessage('ping');
    try {
        const masterMessage = await HandleMasterMessage();
        res.send(`Worker ${process.pid} received response from master: ${masterMessage}`);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

export default processRouter;
