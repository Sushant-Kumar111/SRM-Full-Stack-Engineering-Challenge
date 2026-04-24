const processHierarchies = (data) => {
    const validEdges = [];
    const invalidEntries = [];
    const duplicateEdgesArray = [];
    const seen = new Set();
    const duplicatesSet = new Set();
    const nodes = new Set();
    
   
    const parentMap = {}; 
    const adjacencyList = {};

    if (!Array.isArray(data)) {
        return { error: 'Invalid data format. Expected an array of strings.' };
    }

  
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
            invalidEntries.push(item); 
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
        
       
        if (parentMap[right]) {
            continue;
        }

        validEdges.push(trimmed);
        nodes.add(left);
        nodes.add(right);
        
        parentMap[right] = left;
        if (!adjacencyList[left]) adjacencyList[left] = [];
        adjacencyList[left].push(right);
        
      
        if (!adjacencyList[right]) adjacencyList[right] = [];
    }

    const allNodes = Array.from(nodes).sort();
    const roots = [];

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

    const buildTree = (node, depthObj) => {
        visited.add(node);
        const obj = {};
        let childMaxDepth = 0;

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
            if (!largestTreeRoot || root < largestTreeRoot) {
                largestTreeRoot = root;
            }
        }
    }

    const recStack = new Set();
    
    for (const node of allNodes) {
        if (!visited.has(node)) {
            totalCycles++;
            
            const componentNodes = [];
            
            const dfsCycle = (n) => {
                if (recStack.has(n)) return;
                if (visited.has(n)) return;
                
                visited.add(n);
                recStack.add(n);
                componentNodes.push(n);
                
                if (adjacencyList[n]) {
                    const children = adjacencyList[n].sort();
                    for (const child of children) {
                        dfsCycle(child);
                    }
                }
                
                recStack.delete(n);
            };
            
            dfsCycle(node);
            
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
