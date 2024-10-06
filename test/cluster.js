import http from 'http';

/**
 * Function to make 100 requests to /cluster-test endpoint
 */
const TestCluster = () => {
    const options = {
        hostname: 'localhost',
        port: 3000,            // Replace with your server's port
        path: '/cluster-test', // The endpoint to request
        method: 'GET',
        headers: {
            'Connection': 'close',
        },
    };

    let completedRequests = 0;
    const totalRequests = 100;
    const startTime = Date.now();

    for (let i = 0; i < totalRequests; i++) {
        const req = http.request(options, (res) => {
            let data = '';

            // Collect response data
            res.on('data', (chunk) => {
                data += chunk;
            });

            // Log response once it's complete
            res.on('end', () => {
                console.log(`Response ${i + 1}: ${data}`);
                completedRequests++;

                // If all requests are complete, log the total time taken
                if (completedRequests === totalRequests) {
                    const endTime = Date.now();
                    const totalTime = (endTime - startTime) / 1000; // Convert milliseconds to seconds
                    console.log(`All ${totalRequests} requests completed in ${totalTime} seconds.`);
                }
            });
        });

        // Handle request error
        req.on('error', (error) => {
            console.error(`Request ${i + 1} encountered an error:`, error.message);
            completedRequests++;

            // If all requests are complete (even with errors), log the total time taken
            if (completedRequests === totalRequests) {
                const endTime = Date.now();
                const totalTime = (endTime - startTime) / 1000; // Convert milliseconds to seconds
                console.log(`All ${totalRequests} requests completed in ${totalTime} seconds.`);
            }
        });

        // End the request
        req.end();
    }
};

// Run the test function
TestCluster();
