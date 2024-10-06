import axios from 'axios';
import pLimit from 'p-limit';

const url = 'http://localhost:3000/cluster-test'; // Replace with your server URL
const totalRequests = 1000;
const concurrentLimit = 50;

const runTest = async () => {
    // Set the concurrency limit to 50
    const limit = pLimit(concurrentLimit);

    // Create an array of requests, limited by the concurrency limit
    const requests = Array.from({ length: totalRequests }, (_, i) => 
        limit(async () => {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'Connection': 'close' // Disable keep-alive to force new connections
                    }
                });
                console.log(`Response ${i + 1}: ${response.data}`);
            } catch (error) {
                console.error(`Request ${i + 1} encountered an error:`, error.message);
            }
        })
    );

    // Run all the requests
    const startTime = Date.now();
    await Promise.all(requests);
    const endTime = Date.now();
    
    console.log(`All ${totalRequests} requests completed in ${(endTime - startTime) / 1000} seconds.`);
};

// Run the test
runTest();
