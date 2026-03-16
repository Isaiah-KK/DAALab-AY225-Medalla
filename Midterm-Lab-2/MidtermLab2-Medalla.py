import heapq

# Graph data based on the table
graph = {
    "IMUS": [
        {"node": "BACOOR", "distance": 10, "time": 15, "fuel": 1.2},
        {"node": "NOVELETA", "distance": 10, "time": 15, "fuel": 1.2}
    ],
    "BACOOR": [
        {"node": "DASMA", "distance": 12, "time": 25, "fuel": 1.5},
        {"node": "SILANG", "distance": 10, "time": 25, "fuel": 1.3}
    ],
    "DASMA": [
        {"node": "KAWIT", "distance": 12, "time": 25, "fuel": 1.5},
        {"node": "SILANG", "distance": 12, "time": 25, "fuel": 1.5}
    ],
    "KAWIT": [
        {"node": "INDANG", "distance": 12, "time": 25, "fuel": 1.2}
    ],
    "INDANG": [
        {"node": "SILANG", "distance": 14, "time": 25, "fuel": 1.5}
    ],
    "SILANG": [
        {"node": "GENTRI", "distance": 10, "time": 25, "fuel": 1.3},
        {"node": "BACOOR", "distance": 10, "time": 25, "fuel": 1.3},
        {"node": "KAWIT", "distance": 14, "time": 25, "fuel": 1.2}
    ],
    "GENTRI": [
        {"node": "NOVELETA", "distance": 10, "time": 25, "fuel": 1.5}
    ],
    "NOVELETA": [
        {"node": "IMUS", "distance": 10, "time": 15, "fuel": 1.2},
        {"node": "BACOOR", "distance": 10, "time": 15, "fuel": 1.2}
    ]
}


def shortest_path(graph, start, end, weight="distance"):
    queue = [(0, start, [])]
    visited = set()

    while queue:
        cost, node, path = heapq.heappop(queue)

        if node in visited:
            continue

        visited.add(node)
        path = path + [node]

        if node == end:
            return cost, path

        for neighbor in graph.get(node, []):
            next_node = neighbor["node"]
            weight_value = neighbor[weight]

            heapq.heappush(queue, (cost + weight_value, next_node, path))

    return float("inf"), []


# User input
start = input("Enter start node: ").upper()
end = input("Enter destination node: ").upper()

# Choose optimization criteria
print("\nOptimize by:")
print("1 - Distance")
print("2 - Time")
print("3 - Fuel")

choice = input("Choice: ")

if choice == "1":
    weight = "distance"
elif choice == "2":
    weight = "time"
else:
    weight = "fuel"


cost, path = shortest_path(graph, start, end, weight)

print("\nShortest Path Result")
print("Path:", " -> ".join(path))
print("Total", weight.capitalize(), ":", cost)