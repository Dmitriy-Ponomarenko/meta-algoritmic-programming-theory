from collections import deque
import time


# --- DFS ---
class DFS:
    def __init__(self, graph, start, goal, depth_threshold=10):
        self.graph = graph
        self.start = start
        self.goal = goal
        self.depth_threshold = depth_threshold
        self.visited = set()
        self.stack = [(start, [start])]
        self.nodes_explored = 0
        self.max_depth = 0

    def step(self):
        if not self.stack:
            return None

        node, path = self.stack.pop()
        self.visited.add(node)
        self.nodes_explored += 1
        self.max_depth = max(self.max_depth, len(path))

        if node == self.goal:
            return path

        if len(path) > self.depth_threshold:
            return "SWITCH"

        neighbors = self.graph.get(node, [])
        for n in reversed(neighbors):
            if n not in self.visited:
                self.stack.append((n, path + [n]))

        return None

    def get_metrics(self):
        return {"nodesExplored": self.nodes_explored, "maxDepth": self.max_depth}


# --- BFS ---
class BFS:
    def __init__(self, graph, start, goal, memory_threshold=50):
        self.graph = graph
        self.start = start
        self.goal = goal
        self.memory_threshold = memory_threshold
        self.visited = set()
        self.queue = deque([(start, [start])])
        self.nodes_explored = 0

    def step(self):
        if not self.queue:
            return None

        node, path = self.queue.popleft()
        self.visited.add(node)
        self.nodes_explored += 1

        if node == self.goal:
            return path

        if len(self.queue) > self.memory_threshold:
            return "SWITCH"

        for n in self.graph.get(node, []):
            if n not in self.visited:
                self.queue.append((n, path + [n]))

        return None

    def get_metrics(self):
        return {"nodesExplored": self.nodes_explored, "queueSize": len(self.queue)}


# --- Self-Reflective Algorithm ---
class SelfReflectiveSearch:
    def __init__(self, graph, start, goal, depth_threshold=10, memory_threshold=50):
        self.graph = graph
        self.start = start
        self.goal = goal

        self.dfs = DFS(graph, start, goal, depth_threshold)
        self.bfs = BFS(graph, start, goal, memory_threshold)

        self.strategy = "DFS"

    def search(self):
        while True:
            if self.strategy == "DFS":
                result = self.dfs.step()
                if result == "SWITCH":
                    self.strategy = "BFS"
            else:
                result = self.bfs.step()
                if result == "SWITCH":
                    self.strategy = "DFS"

            if result and result != "SWITCH":
                return result

            if not self.dfs.stack and not self.bfs.queue:
                return None

    def get_metrics(self):
        return {
            "DFS": self.dfs.get_metrics(),
            "BFS": self.bfs.get_metrics(),
            "currentStrategy": self.strategy,
        }


# --- DATA ---
graph1 = {
    "A": ["B", "C", "D"],
    "B": ["E", "F"],
    "C": ["G", "H"],
    "D": ["I", "J"],
    "E": ["K"],
    "F": ["L", "M"],
    "G": [],
    "H": ["N"],
    "I": [],
    "J": ["O", "P"],
    "K": [],
    "L": [],
    "M": ["Q"],
    "N": [],
    "O": [],
    "P": [],
    "Q": [],
}

graphMonster = {
    "A": ["B", "C", "D", "A1", "A2"],
    "B": ["E", "F", "B1"],
    "C": ["G", "H", "C1", "C2"],
    "D": ["I", "J"],
    "E": ["K", "L", "A"],
    "F": ["M", "N", "F1"],
    "G": ["O", "P"],
    "H": ["Q", "R", "C"],
    "I": ["S"],
    "J": ["T", "U"],
    "K": ["V", "W", "K1"],
    "L": ["X"],
    "M": ["Y", "Z"],
    "N": ["AA", "AB"],
    "O": ["AC"],
    "P": ["AD", "AE"],
    "Q": ["AF"],
    "R": ["AG", "H"],
    "S": ["AH", "AI"],
    "T": ["AJ"],
    "U": ["AK", "AL"],
    "V": ["AM"],
    "W": ["AN", "AO"],
    "X": ["AP"],
    "Y": ["AQ"],
    "Z": ["AR"],
    "AA": ["AS"],
    "AB": ["AT"],
    "AC": ["AU"],
    "AD": ["AV"],
    "AE": ["AW", "B"],
    "AF": ["AX"],
    "AG": ["AY"],
    "AH": ["AZ"],
    "AI": ["BA"],
    "AJ": ["BB"],
    "AK": ["BC"],
    "AL": ["BD"],
    "AM": ["BE"],
    "AN": ["BF"],
    "AO": ["BG"],
    "AP": ["BH"],
    "AQ": ["BI"],
    "AR": ["BJ"],
    "AS": ["BK"],
    "AT": ["BL"],
    "AU": ["BM"],
    "AV": ["BN"],
    "AW": ["BO"],
    "AX": ["BP"],
    "AY": ["BQ"],
    "AZ": ["BR"],
    "BA": ["BS"],
    "BB": ["BT"],
    "BC": ["BU"],
    "BD": ["BV"],
    "BE": ["BW"],
    "BF": ["BX"],
    "BG": ["BY"],
    "BH": ["BZ"],
    "BI": ["CA"],
    "BJ": ["CB"],
    "BK": ["CC"],
    "BL": ["CD"],
    "BM": ["CE"],
    "BN": ["CF"],
    "BO": ["CG"],
    "BP": ["CH"],
    "BQ": ["CI"],
    "BR": ["CJ"],
    "BS": ["CK"],
    "BT": ["CL"],
    "BU": ["CM"],
    "BV": ["CN"],
    "BW": ["CO"],
    "BX": ["CP"],
    "BY": ["CQ"],
    "BZ": ["CR"],
    "CA": ["CS"],
    "CB": ["CT"],
    "CC": ["CU"],
    "CD": ["CV"],
    "CE": ["CW"],
    "CF": ["CX"],
    "CG": ["CY"],
    "CH": ["CZ"],
    "CI": ["DA"],
    "CJ": ["DB"],
    "CK": ["DC"],
    "CL": ["DD"],
    "CM": ["DE"],
    "CN": ["DF"],
    "CO": ["DG"],
    "CP": ["DH"],
    "CQ": ["DI"],
    "CR": ["DJ"],
    "CS": ["DK"],
    "CT": ["DL"],
    "CU": ["DM"],
    "CV": ["DN"],
    "CW": ["DO"],
    "CX": ["DP"],
    "CY": ["DQ"],
    "CZ": ["DR"],
    "DA": ["DS"],
    "DB": ["DT"],
    "DC": ["DU"],
    "DD": ["DV"],
    "DE": ["DW"],
    "DF": ["DX"],
    "DG": ["DY"],
    "DH": ["DZ"],
    "DI": ["EA"],
    "DJ": ["EB"],
    "EA": ["A", "M", "X"],
    "EB": ["Q", "R", "EB1"],
    "EB1": ["EB"],
    "A1": [],
    "A2": [],
    "B1": [],
    "C1": [],
    "C2": [],
    "F1": [],
    "K1": [],
}


# --- TESTING ---
start_node = "A"
goal_node = "Q"

print("=== TEST START ===")

# DFS
dfs = DFS(graph1, start_node, goal_node)
start = time.perf_counter()
while True:
    res = dfs.step()
    if res:
        dfs_path = res
        break
end = time.perf_counter()
print("DFS Time:", end - start)
print("DFS Path:", dfs_path)
print("DFS Metrics:", dfs.get_metrics())
print("-------------------")

# BFS
bfs = BFS(graph1, start_node, goal_node)
start = time.perf_counter()
while True:
    res = bfs.step()
    if res:
        bfs_path = res
        break
end = time.perf_counter()
print("BFS Time:", end - start)
print("BFS Path:", bfs_path)
print("BFS Metrics:", bfs.get_metrics())
print("-------------------")

# SRA
sra = SelfReflectiveSearch(graph1, start_node, goal_node)
start = time.perf_counter()
sra_path = sra.search()
end = time.perf_counter()
print("SRA Time:", end - start)
print("SRA Path:", sra_path)
print("SRA Metrics:", sra.get_metrics())

print("=== TEST END ===")
