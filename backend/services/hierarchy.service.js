const processHierarchies = (data) => {
    const validEdges = [];
    const invalidEntries = [];
    const duplicateEdgesArray = [];
    const seen = new Set();
    const duplicatesSet = new Set();
    const nodes = new Set();
    
    // We only take the first valid parent for multi-parent nodes
    const parentMap = {}; 
    const adjacencyList = {};

    if (!Array.isArray(data)) {
        return { error: 'Invalid data format. Expected an array of strings.' };
    }

    // 1. Validation & Graph Building
    for (const item of data) {
        if (typeof item !== 'string') {
            invalidEntries.push(item);
            continue;
        }

        const trimmed = item.trim();
        const regex = /^[A-Z]->[A-Z]$/;
        
        if (!regex.test(trimmed)) {
            invalidEntries.push(item);
            continue;
        }

        const left = trimmed[0];
        const right = trimmed[3];

        if (left === right) {
            invalidEntries.push(item); // Self-loops are invalid
            continue;
        }

        if (seen.has(trimmed)) {
            if (!duplicatesSet.has(trimmed)) {
                duplicatesSet.add(trimmed);
                duplicateEdgesArray.push(trimmed);
            }
            continue;
        }

        seen.add(trimmed);
        
        // Multi-parent case: if right already has a parent, ignore this edge silently
        if (parentMap[right]) {
            continue;
        }

        validEdges.push(trimmed);
        nodes.add(left);
        nodes.add(right);
        
        parentMap[right] = left;
        if (!adjacencyList[left]) adjacencyList[left] = [];
        adjacencyList[left].push(right);
        
        // Ensure all nodes are initialized in adjacencyList to prevent errors
        if (!adjacencyList[right]) adjacencyList[right] = [];
    }

    const allNodes = Array.from(nodes).sort();
    const roots = [];

    // Find roots (nodes with no parents)
    for (const node of allNodes) {
        if (!parentMap[node]) {
            roots.push(node);
        }
    }

    const visited = new Set();
    const hierarchies = [];
    let totalTrees = 0;
    let totalCycles = 0;
    let maxDepth = 0;
    let largestTreeRoot = "";

    // 2. Build Trees from Roots
    const buildTree = (node, depthObj) => {
        visited.add(node);
        const obj = {};
        let childMaxDepth = 0;

        // Sort to ensure deterministic order
        const children = adjacencyList[node].sort();
        for (const child of children) {
            const childDepthObj = { depth: 0 };
            obj[child] = buildTree(child, childDepthObj);
            if (childDepthObj.depth > childMaxDepth) {
                childMaxDepth = childDepthObj.depth;
            }
        }
        
        depthObj.depth = childMaxDepth + 1;
        return obj;
    };

    for (const root of roots) {
        const depthObj = { depth: 0 };
        const treeStructure = buildTree(root, depthObj);
        
        hierarchies.push({
            root: root,
            tree: Object.keys(treeStructure).length === 0 && !adjacencyList[root] ? {} : { [root]: treeStructure },
            depth: depthObj.depth
        });

        totalTrees++;

        if (depthObj.depth > maxDepth) {
            maxDepth = depthObj.depth;
            largestTreeRoot = root;
        } else if (depthObj.depth === maxDepth) {
            // Lexicographically smaller root on tie
            if (!largestTreeRoot || root < largestTreeRoot) {
                largestTreeRoot = root;
            }
        }
    }

    // 3. Detect remaining cycles using DFS with recursion stack
    // As per requirement: "Implement proper cycle detection using DFS with recursion stack."
    const recStack = new Set();
    
    // We already visited all trees. Any unvisited nodes must be part of cycles.
    // However, to strictly use DFS with recursion stack for cycle detection on unvisited nodes:
    for (const node of allNodes) {
        if (!visited.has(node)) {
            totalCycles++;
            
            const componentNodes = [];
            
            // Standard DFS cycle detection
            const dfsCycle = (n) => {
                if (recStack.has(n)) return; // Cycle closes here
                if (visited.has(n)) return;
                
                visited.add(n);
                recStack.add(n);
                componentNodes.push(n);
                
                if (adjacencyList[n]) {
                    // Sorting children for deterministic traversal
                    const children = adjacencyList[n].sort();
                    for (const child of children) {
                        dfsCycle(child);
                    }
                }
                
                recStack.delete(n);
            };
            
            dfsCycle(node);
            
            // "If no root (cycle case), pick lexicographically smallest node"
            const cycleRoot = componentNodes.sort()[0];
            
            hierarchies.push({
                root: cycleRoot,
                tree: {},
                has_cycle: true
            });
        }
    }

    return {
        user_id: "sushantkumar_23092004",
        email_id: "sk0754@srmist.edu.in",
        college_roll_number: "RA2311033010111",
        hierarchies,
        invalid_entries: invalidEntries,
        duplicate_edges: duplicateEdgesArray,
        summary: {
            total_trees: totalTrees,
            total_cycles: totalCycles,
            largest_tree_root: largestTreeRoot || null
        }
    };
};

module.exports = {
    processHierarchies
};
