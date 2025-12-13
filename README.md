# Self-Reflective Algorithm (SRA) for Graph Traversal

## Overview

Traditional graph traversal algorithms, DFS and BFS, have fixed behaviors:

- **DFS** explores deep paths efficiently but can get stuck in long branches.
- **BFS** guarantees shortest paths in unweighted graphs but consumes more memory.

SRA addresses these limitations by **self-reflection**:

- Tracks search metrics in real time.
- Dynamically switches between DFS and BFS when thresholds are exceeded.
- Ensures a balance between execution time and memory usage.

This makes SRA suitable for heterogeneous graph structures, including sparse, dense, linear, and tree-like graphs.

## Motivation

Many applications rely on graph traversal, such as:

- Social network analysis
- Transportation and logistics
- Machine learning on graph-structured data
- Pathfinding in games and simulations

Choosing the optimal traversal strategy beforehand is often impossible.  
SRA introduces **meta-algorithmic programming**, where the algorithm adapts itself dynamically to the problem.

## Features

- Adaptive switching between DFS and BFS.
- Runtime monitoring of key metrics: depth, visited nodes, memory usage.
- Extensible architecture: new traversal strategies can be added easily.
- Implemented in JavaScript, TypeScript, and Python.
- Designed for experiments, benchmarking, and research in adaptive algorithms.

## Project Structure

BFS-and-DFS-js/
├── SRA.js
├── README.md

BFS-and-DFS-ts/
├── SRA.ts
├── README.md

BFS-and-DFS-py/
├── SRA.py
├── README.md

- `SRA.js / SRA.ts / SRA.py`: main implementations of Self-Reflective Algorithm.
- `README.md`: documentation and usage guide.

## Usage

**JavaScript**

```bash
node SRA.js
```

**TypeScript**

```bash
tsc SRA.ts
node SRA.js
```

**Python**

```bash
python3 SRA.py
```

## Examples

### Graph structure example:

```javascript
const graph = {
  'A': ['B', 'C'],
  'B': ['D', 'E'],
  'C': ['F'],
  'D': [],
  'E': ['F'],
  'F': []
};

SRA will automatically choose DFS or BFS depending on the depth and memory usage during the search.

## Metrics & Performance

SRA tracks:

- `nodesExplored`: total nodes visited
- `maxDepth`: maximum depth reached in DFS
- `queueSize`: maximum queue size in BFS
- `currentStrategy`: the currently active strategy

These metrics allow for performance analysis and comparison with fixed DFS or BFS implementations.

## Contributing

Contributions are welcome! You can:

- Add new traversal strategies
- Improve performance
- Extend metric tracking for benchmarking

Please follow standard GitHub workflow: **fork → branch → pull request**.
```
