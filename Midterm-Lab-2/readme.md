MIDTERM LAB 2
In this assignment, I created a Python program that represents a network of locations using nodes and connections. Each location is treated as a node, and each route between locations has values for distance, time, and fuel consumption.

The program allows the user to input a starting node and a destination node. After that, the program calculates the shortest path between them.

APPROACH
As for my approach for this program i first made a graph to list all the nodes "from node" "to node" map. and the graph is stored by their distance, time, and fuel.

ALGORITHM
Dijkstra's Algorithm was used for this program. this algorithm works efficiently when finding the shortest path.

CHALLENGES
It was difficult for me to made the graph nodes as i just placed all the nodes in one array graph and that was the first mistake that i encountered, 
another challenge that i faced was understanding the routes to know the shortest path for example my starting node was dasma and destined to noveleta at first i thought
it would be "dasma-kawit-indang-silang-gentri = noveleta/D-58km" but the output was "dasma-silang-gentri = noveleta/D-32km" so after knowing my program output i was able 
to understand how Dijkstra's algorithm chooses the path with the smallest value.