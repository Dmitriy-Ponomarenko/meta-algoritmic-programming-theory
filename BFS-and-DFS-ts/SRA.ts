// --- TYPES ---
type Graph = { [key: string]: string[] };
type NodePath = { node: string; path: string[] };
type DFSMetrics = { nodesExplored: number; maxDepth: number };
type BFSMetrics = { nodesExplored: number; queueSize: number };

// --- DFS ---
class DFS1 {
  graph: Graph;
  start: string;
  goal: string;
  depthThreshold: number;
  visited: Set<string>;
  stack: NodePath[];
  nodesExplored: number;
  maxDepth: number;

  constructor(graph: Graph, start: string, goal: string, depthThreshold = 10) {
    this.graph = graph;
    this.start = start;
    this.goal = goal;
    this.depthThreshold = depthThreshold;
    this.visited = new Set();
    this.stack = [{ node: start, path: [start] }];
    this.nodesExplored = 0;
    this.maxDepth = 0;
  }

  step(): string[] | "SWITCH" | null {
    if (this.stack.length === 0) return null;

    const { node, path } = this.stack.pop()!;
    this.visited.add(node);
    this.nodesExplored++;
    this.maxDepth = Math.max(this.maxDepth, path.length);

    if (node === this.goal) return path;
    if (path.length > this.depthThreshold) return "SWITCH";

    const neighbors = this.graph[node] || [];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const n = neighbors[i];
      if (!this.visited.has(n)) {
        this.stack.push({ node: n, path: [...path, n] });
      }
    }
    return null;
  }

  getMetrics(): DFSMetrics {
    return { nodesExplored: this.nodesExplored, maxDepth: this.maxDepth };
  }
}

// --- BFS ---
class BFS1 {
  graph: Graph;
  start: string;
  goal: string;
  memoryThreshold: number;
  visited: Set<string>;
  queue: NodePath[];
  nodesExplored: number;

  constructor(graph: Graph, start: string, goal: string, memoryThreshold = 50) {
    this.graph = graph;
    this.start = start;
    this.goal = goal;
    this.memoryThreshold = memoryThreshold;
    this.visited = new Set();
    this.queue = [{ node: start, path: [start] }];
    this.nodesExplored = 0;
  }

  step(): string[] | "SWITCH" | null {
    if (this.queue.length === 0) return null;

    const { node, path } = this.queue.shift()!;
    this.visited.add(node);
    this.nodesExplored++;

    if (node === this.goal) return path;
    if (this.queue.length > this.memoryThreshold) return "SWITCH";

    const neighbors = this.graph[node] || [];
    for (const n of neighbors) {
      if (!this.visited.has(n)) {
        this.queue.push({ node: n, path: [...path, n] });
      }
    }
    return null;
  }

  getMetrics(): BFSMetrics {
    return { nodesExplored: this.nodesExplored, queueSize: this.queue.length };
  }
}

// --- Self-Reflective Search ---
class SelfReflectiveSearch1 {
  graph: Graph;
  start: string;
  goal: string;
  depthThreshold: number;
  memoryThreshold: number;
  dfs: DFS;
  bfs: BFS;
  strategy: "DFS" | "BFS";

  constructor(
    graph: Graph,
    start: string,
    goal: string,
    depthThreshold = 10,
    memoryThreshold = 50
  ) {
    this.graph = graph;
    this.start = start;
    this.goal = goal;
    this.depthThreshold = depthThreshold;
    this.memoryThreshold = memoryThreshold;

    this.dfs = new DFS(graph, start, goal, depthThreshold);
    this.bfs = new BFS(graph, start, goal, memoryThreshold);
    this.strategy = "DFS";
  }

  search(): string[] | null {
    let result: string[] | "SWITCH" | null = null;

    while (true) {
      if (this.strategy === "DFS") {
        result = this.dfs.step();
        if (result === "SWITCH") this.strategy = "BFS";
      } else {
        result = this.bfs.step();
        if (result === "SWITCH") this.strategy = "DFS";
      }

      if (result && result !== "SWITCH") return result;
      if (this.dfs.stack.length === 0 && this.bfs.queue.length === 0)
        return null;
    }
  }

  getMetrics() {
    return {
      DFS: this.dfs.getMetrics(),
      BFS: this.bfs.getMetrics(),
      currentStrategy: this.strategy,
    };
  }
}
