from collections import deque
from typing import Dict, List, Optional, Union

Graph = Dict[str, List[str]]


class DFS:
    def __init__(self, graph: Graph, start: str, goal: str, depth_threshold: int = 10):
        self.graph = graph
        self.start = start
        self.goal = goal
        self.depth_threshold = depth_threshold
        self.visited = set()
        self.stack = [(start, [start])]
        self.nodes_explored = 0
        self.max_depth = 0

    def step(self) -> Optional[Union[List[str], str]]:
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
        for neighbor in reversed(self.graph.get(node, [])):
            if neighbor not in self.visited:
                self.stack.append((neighbor, path + [neighbor]))
        return None

    def get_metrics(self):
        return {"nodes_explored": self.nodes_explored, "max_depth": self.max_depth}


class BFS:
    def __init__(self, graph: Graph, start: str, goal: str, memory_threshold: int = 50):
        self.graph = graph
        self.start = start
        self.goal = goal
        self.memory_threshold = memory_threshold
        self.visited = set()
        self.queue = deque([(start, [start])])
        self.nodes_explored = 0

    def step(self) -> Optional[Union[List[str], str]]:
        if not self.queue:
            return None
        node, path = self.queue.popleft()
        self.visited.add(node)
        self.nodes_explored += 1
        if node == self.goal:
            return path
        if len(self.queue) > self.memory_threshold:
            return "SWITCH"
        for neighbor in self.graph.get(node, []):
            if neighbor not in self.visited:
                self.queue.append((neighbor, path + [neighbor]))
        return None

    def get_metrics(self):
        return {"nodes_explored": self.nodes_explored, "queue_size": len(self.queue)}


class SelfReflectiveSearch:
    def __init__(
        self,
        graph: Graph,
        start: str,
        goal: str,
        depth_threshold: int = 10,
        memory_threshold: int = 50,
    ):
        self.graph = graph
        self.start = start
        self.goal = goal
        self.depth_threshold = depth_threshold
        self.memory_threshold = memory_threshold
        self.dfs = DFS(graph, start, goal, depth_threshold)
        self.bfs = BFS(graph, start, goal, memory_threshold)
        self.strategy = "DFS"

    def search(self) -> Optional[List[str]]:
        while True:
            if self.strategy == "DFS":
                result = self.dfs.step()
                if result == "SWITCH":
                    self.strategy = "BFS"
                elif result is not None:
                    return result
            else:
                result = self.bfs.step()
                if result == "SWITCH":
                    self.strategy = "DFS"
                elif result is not None:
                    return result

            if not self.dfs.stack and not self.bfs.queue:
                return None

    def get_metrics(self):
        return {
            "DFS": self.dfs.get_metrics(),
            "BFS": self.bfs.get_metrics(),
            "current_strategy": self.strategy,
        }
