# Node.js Clustering Performance Demo

This project demonstrates the power of clustering in Node.js applications, addressing the limitations of the single-threaded model. By leveraging the cluster module, we can significantly improve the performance and scalability of our server.

## Project Overview

Node.js, by default, runs on a single thread. While this model is efficient for I/O-bound operations, it can become a bottleneck for CPU-intensive tasks or high-concurrency scenarios. This project showcases how clustering can distribute the workload across multiple worker processes, utilizing multi-core systems more effectively.

## Key Features

- Clustered server implementation
- Single-threaded server for comparison
- Performance testing scripts
- Stress testing utility
- Inter-process communication demonstration

## Project Structure

- `main.js`: Entry point for the clustered server
- `server/app.js`: Single-threaded server implementation
- `test/cluster.js`: Performance comparison script
- `test/stress.js`: Stress testing script
- `cluster/`: Contains clustering-related modules
  - `GracefulExit.js`: Handles graceful shutdown of worker processes
- `server/`: Server-related modules and routes
  - `processRoutes.js`: Defines server routes and processing logic
- `cluster/process/`: Contains process-related modules
  - `sendMessage.js`: Handles inter-process communication

## Getting Started

### Prerequisites

- Node.js (version v20.10.0 or higher)
- npm (usually comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yingwei123/clustering-node.git
   cd node-clustering
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Running the Servers

1. To run the clustered server:
   ```bash
   node main.js
   ```

2. To run the single-threaded server:
   ```bash
   node server/app.js
   ```

### Performance Testing

Use the `test/cluster.js` script to compare the performance of the clustered and single-threaded servers:

```bash
node test/cluster.js
```

This script sends 100 concurrent requests to the `/cluster-test` endpoint and measures the total time taken to complete all requests. It's an excellent way to observe the performance difference between clustered and non-clustered setups.

### Stress Testing

For more intensive testing, use the `test/stress.js` script:

```bash
node test/stress.js
```

This script sends 1000 requests with a concurrency limit of 50. It's designed to push the server to its limits and is particularly useful for testing the clustered setup. Be cautious when running this on the single-threaded server, as it may become overwhelmed.

## Inter-Process Communication Demo

The project includes routes to demonstrate inter-process communication between worker processes and the master process. These routes are defined in `server/processRoutes.js`:

1. `/process/exit`: Initiates a graceful shutdown and restart of the worker process.
   ```bash
   GET http://localhost:3000/process/exit
   ```

2. `/process/disconnect`: Disconnects the worker from the master process and exits.
   ```bash
   GET http://localhost:3000/process/disconnect
   ```

3. `/process/message/ping`: Sends a 'ping' message to the master process and waits for a 'pong' response.
   ```bash
   GET http://localhost:3000/process/message/ping
   ```

These routes showcase different aspects of worker-master communication and process management in a clustered environment.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
