graph = {
    1: {2: (10, 15, 1.2), 6: (10, 15, 1.2)},
    2: {1: (10, 15, 1.2), 3: (12, 25, 1.5), 5: (12, 25, 1.5), 6: (10, 15, 1.2)},
    3: {2: (12, 25, 1.5), 4: (12, 25, 1.5), 5: (14, 25, 1.5)},
    4: {}, 
    5: {2: (12, 25, 1.5), 3: (12, 25, 1.5), 4: (14, 25, 1.2), 6: (10, 25, 1.5)},
    6: {1: (10, 15, 1.2), 2: (10, 15, 1.2), 3: (10, 25, 1.3), 4: (10, 25, 1.5), 5: (10, 25, 1.5)}
}

def print_divider():
    print("+----------+----------+----------+----------+")

def analyze_node(node_id):
    if node_id not in graph:
        print("Invalid Node ID.")
        return

    neighbors = graph[node_id]
    if not neighbors:
        print(f"\nNode {node_id} is a sink node.")
        return

    print(f"\n--- Analysis for Node {node_id} ---")
    print_divider()
    print(f"| Target   | Dist     | Time     | Fuel     |")
    print_divider()
    
    d, t, f = [], [], []
    for neighbor, values in neighbors.items():
        print(f"| {neighbor:<8} | {values[0]:<8} | {values[1]:<8} | {values[2]:<8} |")
        d.append(values[0]); t.append(values[1]); f.append(values[2])
    
    print_divider()
    print(f"| Totals   | {sum(d):<8} | {sum(t):<8} | {sum(f):<8} |")
    print_divider()

def show_full_table():
    print(f"\n{'| From':<8} | {'To':<8} | {'Dist':<8} | {'Time':<8} | {'Fuel':<8} |")
    print("+--------+--------+--------+--------+--------+")
    for node, neighbors in graph.items():
        for target, vals in neighbors.items():
            print(f"| {node:<6} | {target:<6} | {vals[0]:<6} | {vals[1]:<6} | {vals[2]:<6} |")
    print("+--------+--------+--------+--------+--------+")

def main():
    while True:
        print("\n--- Network Explorer ---")
        print("1. Analyze Specific Node")
        print("2. Show Complete Network Table")
        print("3. Quit")
        
        choice = input("Select an option: ").lower()
        if choice == '1':
            try:
                node = int(input("Enter Node ID: "))
                analyze_node(node)
                input("\nPress Enter to reset")
            except ValueError:
                print("Invalid input.")
        elif choice == '2':
            show_full_table()
            input("\nPress Enter to reset")
        elif choice == '3':
            break

if __name__ == "__main__":
    main()