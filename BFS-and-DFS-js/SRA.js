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
  AY: ["ALS", "AMS", "ANS", "ALS", "AMS", "ANS", "ALS", "AMS", "ZNS"],
  ZNS: ["weqwe"],
};

const graphMonster = {
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
  CS: ["DK"],
  CT: ["DL"],
  CU: ["DM"],
  CV: ["DN"],
  CW: ["DO"],
  CX: ["DP"],
  CY: ["DQ"],
  CZ: ["DR"],
  DA: ["DS"],
  DB: ["DT"],
  DC: ["DU"],
  DD: ["DV"],
  DE: ["DW"],
  DF: ["DX"],
  DG: ["DY"],
  DH: ["DZ"],
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

// TESTING
const startNode = "A";
const goalNode = "EB1";

console.log("=== TEST START ===");

// DFS
const dfs = new DFS(graphMonster, startNode, goalNode); // PUT YOUR GRAPH NAME HERE
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
const bfs = new BFS(graphMonster, startNode, goalNode); // PUT YOUR GRAPH NAME HERE
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
const sra = new SelfReflectiveSearch(graphMonster, startNode, goalNode); // PUT YOUR GRAPH NAME HERE
console.time("SRA Time");
const sraPath = sra.search();
console.timeEnd("SRA Time");
console.log("SRA Path:", sraPath);
console.log("SRA Metrics:", sra.getMetrics());
console.log("=== TEST END ===");
