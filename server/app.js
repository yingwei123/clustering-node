import express from 'express';
import processRouter from './processRoutes.js';
import GracefulProcessExit from '../cluster/process/gracefulProcessExit.js';

const app = express();

app.use('/process', processRouter);

app.get('/', (req, res) =>{
    res.send('Hello World')
})

app.get('/cluster-test', (req, res) => {
    console.log(`Worker ${process.pid} is starting`);

    // Blocking delay of .5 second (500 milliseconds)
    const start = Date.now();
    while (Date.now() - start < 500) {
        // Busy wait - blocking the event loop
    }

    console.log(`Worker ${process.pid} is done`);
    res.send(`Worker ${process.pid} is done`);
});

app.listen(3000, () => {
    console.log(`Worker ${process.pid} is listening on port 3000`);
});

GracefulProcessExit(app);

export default app;