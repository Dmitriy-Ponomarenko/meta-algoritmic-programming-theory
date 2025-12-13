// --- DFS ---
class DFS {
  constructor(graph, start, goal, depthThreshold = 10) {
    this.graph = graph;
    this.start = start;
    this.goal = goal;
    this.depthThreshold = depthThreshold;
    this.visited = new Set();
    this.stack = [{ node: start, path: [start] }];
    this.nodesExplored = 0;
    this.maxDepth = 0;
  }

  step() {
    if (this.stack.length === 0) return null;

    const { node, path } = this.stack.pop();
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

  getMetrics() {
    return { nodesExplored: this.nodesExplored, maxDepth: this.maxDepth };
  }
}

// --- BFS ---
class BFS {
  constructor(graph, start, goal, memoryThreshold = 50) {
    this.graph = graph;
    this.start = start;
    this.goal = goal;
    this.memoryThreshold = memoryThreshold;
    this.visited = new Set();
    this.queue = [{ node: start, path: [start] }];
    this.nodesExplored = 0;
  }

  step() {
    if (this.queue.length === 0) return null;

    const { node, path } = this.queue.shift();
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

  getMetrics() {
    return { nodesExplored: this.nodesExplored, queueSize: this.queue.length };
  }
}

// --- Self-Reflective Algorithm ---
class SelfReflectiveSearch {
  constructor(graph, start, goal, depthThreshold = 10, memoryThreshold = 50) {
    this.graph = graph;
    this.start = start;
    this.goal = goal;
    this.depthThreshold = depthThreshold;
    this.memoryThreshold = memoryThreshold;

    this.dfs = new DFS(graph, start, goal, depthThreshold);
    this.bfs = new BFS(graph, start, goal, memoryThreshold);

    this.strategy = "DFS";
  }

  search() {
    let result = null;
    while (true) {
      if (this.strategy === "DFS") {
        result = this.dfs.step();
        if (result === "SWITCH") this.strategy = "BFS";
      } else if (this.strategy === "BFS") {
        result = this.bfs.step();
        if (result === "SWITCH") this.strategy = "DFS";
      }

      if (result && result !== "SWITCH") return result;
      if (this.dfs.stack.length === 0 && this.bfs.queue.length === 0) {
        return null;
      }
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

// DATA TO BE ANALIZED
const graph1 = {
  A: ["B", "C", "D"],
  B: ["E", "F"],
  C: ["G", "H"],
  D: ["I", "J"],
  E: ["K"],
  F: ["L", "M"],
  G: [],
  H: ["N"],
  I: [],
  J: ["O", "P"],
  K: [],
  L: [],
  M: ["Q"],
  N: [],
  O: [],
  P: [],
  Q: [],
};

const graph2 = {
  A: ["B", "C", "D", "E", "F", "G"],
  B: ["H", "I", "J"],
  C: ["K", "L", "M"],
  D: ["N", "O"],
  E: ["P", "Q", "R"],
  F: ["S", "T"],
  G: ["U", "V", "W"],
  H: ["X", "Y"],
  I: ["Z", "AA"],
  J: ["AB", "AC"],
  K: ["AD", "AE"],
  L: ["AF"],
  M: ["AG", "AH"],
  N: ["AI"],
  O: ["AJ", "AK"],
  P: ["AL", "AM", "AN"],
  Q: ["AO"],
  R: ["AP", "AQ"],
  S: ["AR"],
  T: ["AS", "AT"],
  U: ["AU"],
  V: ["AV", "AW"],
  W: ["AX", "AY"],
  X: [],
  Y: [],
  Z: [],
  AA: [],
  AB: [],
  AC: [],
  AD: [],
  AE: [],
  AF: [],
  AG: [],
  AH: [],
  AI: [],
  AJ: [],
  AK: [],
  AL: [],
  AM: [],
  AN: [],
  AO: [],
  AP: [],
  AQ: [],
  AR: [],
  AS: [],
  AT: [],
  AU: [],
  AV: [],
  AW: [],
  AX: [],
  AY: [],
};

// TESTING
const startNode = "A";
const goalNode = "F";

console.log("=== TEST START ===");

// DFS
const dfs = new DFS(graph2, startNode, goalNode); // PUT YOUR GRAPH NANE HERE
console.time("DFS Time");
const dfsPath = (() => {
  let result;
  while (!(result = dfs.step())) {}
  return result;
})();
console.timeEnd("DFS Time");
console.log("DFS Path:", dfsPath);
console.log("DFS Metrics:", dfs.getMetrics());
console.log("-------------------");

// BFS
const bfs = new BFS(graph2, startNode, goalNode); // PUT YOUR GRAPH NANE HERE
console.time("BFS Time");
const bfsPath = (() => {
  let result;
  while (!(result = bfs.step())) {}
  return result;
})();
console.timeEnd("BFS Time");
console.log("BFS Path:", bfsPath);
console.log("BFS Metrics:", bfs.getMetrics());
console.log("-------------------");

// SRA
const sra = new SelfReflectiveSearch(graph2, startNode, goalNode); // PUT YOUR GRAPH NANE HERE
console.time("SRA Time");
const sraPath = sra.search();
console.timeEnd("SRA Time");
console.log("SRA Path:", sraPath);
console.log("SRA Metrics:", sra.getMetrics());
console.log("=== TEST END ===");
