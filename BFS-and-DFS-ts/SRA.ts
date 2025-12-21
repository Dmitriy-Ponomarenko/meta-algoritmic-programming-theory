// --- TYPES ---
type Graph = { [key: string]: string[] };

type NodePath = {
  node: string;
  path: string[];
};

type DFSMetrics = {
  nodesExplored: number;
  maxDepth: number;
};

type BFSMetrics = {
  nodesExplored: number;
  queueSize: number;
};

type StepResult = string[] | "SWITCH" | null;

// --- DFS ---
class DFS {
  graph: Graph;
  start: string;
  goal: string;
  depthThreshold: number;

  visited: Set<string>;
  stack: NodePath[];

  nodesExplored: number;
  maxDepth: number;

  constructor(graph: Graph, start: string, goal: string, depthThreshold = 100) {
    this.graph = graph;
    this.start = start;
    this.goal = goal;
    this.depthThreshold = depthThreshold;

    this.visited = new Set();
    this.stack = [{ node: start, path: [start] }];

    this.nodesExplored = 0;
    this.maxDepth = 0;
  }

  step(): StepResult {
    if (this.stack.length === 0) return null;

    const { node, path } = this.stack.pop()!;
    this.visited.add(node);
    this.nodesExplored++;
    this.maxDepth = Math.max(this.maxDepth, path.length);

    if (node === this.goal) return path;
    if (path.length > this.depthThreshold) return "SWITCH";

    const neighbors = this.graph[node] ?? [];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const n = neighbors[i];
      if (!n) continue;
      if (!this.visited.has(n)) {
        this.stack.push({ node: n, path: [...path, n] });
      }
    }
    return null;
  }

  getMetrics(): DFSMetrics {
    return {
      nodesExplored: this.nodesExplored,
      maxDepth: this.maxDepth,
    };
  }

  get isEmpty(): boolean {
    return this.stack.length === 0;
  }
}

// --- BFS ---
class BFS {
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

  step(): StepResult {
    if (this.queue.length === 0) return null;

    const { node, path } = this.queue.shift()!;
    this.visited.add(node);
    this.nodesExplored++;

    if (node === this.goal) return path;
    if (this.queue.length > this.memoryThreshold) return "SWITCH";

    const neighbors = this.graph[node] ?? [];
    for (const n of neighbors) {
      if (!n) continue;
      if (!this.visited.has(n)) {
        this.queue.push({ node: n, path: [...path, n] });
      }
    }
    return null;
  }

  getMetrics(): BFSMetrics {
    return {
      nodesExplored: this.nodesExplored,
      queueSize: this.queue.length,
    };
  }

  get isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

// --- SELF-REFLECTIVE ---
class SelfReflectiveSearch {
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
    this.dfs = new DFS(graph, start, goal, depthThreshold);
    this.bfs = new BFS(graph, start, goal, memoryThreshold);
    this.strategy = "DFS";
  }

  search(): string[] | null {
    let result: StepResult = null;

    while (true) {
      if (this.strategy === "DFS") {
        result = this.dfs.step();
        if (result === "SWITCH") this.strategy = "BFS";
      } else {
        result = this.bfs.step();
        if (result === "SWITCH") this.strategy = "DFS";
      }

      if (Array.isArray(result)) return result;

      if (this.dfs.isEmpty && this.bfs.isEmpty) {
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

// --- DATA ---
const graph1: Graph = {
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

const graphMonster: Graph = {
  A: ["B", "C", "D", "A1", "A2"],
  B: ["E", "F", "B1"],
  C: ["G", "H", "C1", "C2"],
  D: ["I", "J"],
  E: ["K", "L", "A"],
  F: ["M", "N", "F1"],
  G: ["O", "P"],
  H: ["Q", "R", "C"],
  I: ["S"],
  J: ["T", "U"],
  K: ["V", "W", "K1"],
  L: ["X"],
  M: ["Y", "Z"],
  N: ["AA", "AB"],
  O: ["AC"],
  P: ["AD", "AE"],
  Q: ["AF"],
  R: ["AG", "H"],
  S: ["AH", "AI"],
  T: ["AJ"],
  U: ["AK", "AL"],
  V: ["AM"],
  W: ["AN", "AO"],
  X: ["AP"],
  Y: ["AQ"],
  Z: ["AR"],
  AA: ["AS"],
  AB: ["AT"],
  AC: ["AU"],
  AD: ["AV"],
  AE: ["AW", "B"],
  AF: ["AX"],
  AG: ["AY"],
  AH: ["AZ"],
  AI: ["BA"],
  AJ: ["BB"],
  AK: ["BC"],
  AL: ["BD"],
  AM: ["BE"],
  AN: ["BF"],
  AO: ["BG"],
  AP: ["BH"],
  AQ: ["BI"],
  AR: ["BJ"],
  AS: ["BK"],
  AT: ["BL"],
  AU: ["BM"],
  AV: ["BN"],
  AW: ["BO"],
  AX: ["BP"],
  AY: ["BQ"],
  AZ: ["BR"],
  BA: ["BS"],
  BB: ["BT"],
  BC: ["BU"],
  BD: ["BV"],
  BE: ["BW"],
  BF: ["BX"],
  BG: ["BY"],
  BH: ["BZ"],
  BI: ["CA"],
  BJ: ["CB"],
  BK: ["CC"],
  BL: ["CD"],
  BM: ["CE"],
  BN: ["CF"],
  BO: ["CG"],
  BP: ["CH"],
  BQ: ["CI"],
  BR: ["CJ"],
  BS: ["CK"],
  BT: ["CL"],
  BU: ["CM"],
  BV: ["CN"],
  BW: ["CO"],
  BX: ["CP"],
  BY: ["CQ"],
  BZ: ["CR"],
  CA: ["CS"],
  CB: ["CT"],
  CC: ["CU"],
  CD: ["CV"],
  CE: ["CW"],
  CF: ["CX"],
  CG: ["CY"],
  CH: ["CZ"],
  CI: ["DA"],
  CJ: ["DB"],
  CK: ["DC"],
  CL: ["DD"],
  CM: ["DE"],
  CN: ["DF"],
  CO: ["DG"],
  CP: ["DH"],
  CQ: ["DI"],
  CR: ["DJ"],
  DI: ["EA"],
  DJ: ["EB"],
  EA: ["A", "M", "X"],
  EB: ["Q", "R", "EB1"],
  EB1: ["EB"],
  A1: [],
  A2: [],
  B1: [],
  C1: [],
  C2: [],
  F1: [],
  K1: [],
};

// --- TESTS ---
const startNode = "A";
const goalNode = "Q";

console.log("=== TEST START ===");

// DFS
const dfs = new DFS(graph1, startNode, goalNode); // PUT YOUR GRAPH NAME HERE
console.time("DFS Time");
let dfsResult: StepResult;
while (!(dfsResult = dfs.step())) {}
console.timeEnd("DFS Time");
console.log("DFS Path:", dfsResult);
console.log("DFS Metrics:", dfs.getMetrics());
console.log("-------------------");

// BFS
const bfs = new BFS(graph1, startNode, goalNode); // PUT YOUR GRAPH NAME HERE
console.time("BFS Time");
let bfsResult: StepResult;
while (!(bfsResult = bfs.step())) {}
console.timeEnd("BFS Time");
console.log("BFS Path:", bfsResult);
console.log("BFS Metrics:", bfs.getMetrics());
console.log("-------------------");

// SRA
const sra = new SelfReflectiveSearch(graph1, startNode, goalNode); // PUT YOUR GRAPH NAME HERE
console.time("SRA Time");
const sraPath = sra.search();
console.timeEnd("SRA Time");
console.log("SRA Path:", sraPath);
console.log("SRA Metrics:", sra.getMetrics());

console.log("=== TEST END ===");
