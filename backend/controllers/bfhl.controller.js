const { processHierarchies } = require('../services/hierarchy.service');

const getBfhl = (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
};

const postBfhl = (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data) {
            return res.status(400).json({ error: "Missing 'data' in request body" });
        }

        const result = processHierarchies(data);
        
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in POST /bfhl:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const runInternalTests = (req, res) => {
    const testCases = {
        cycle: ["A->B", "B->C", "C->A"],
        duplicate: ["A->B", "A->B", "A->B"],
        invalid: ["A->A"],
        multiParent: ["A->D", "B->D"],
        depth: ["A->B", "B->C", "C->D"]
    };

    const results = {};
    
    const resCycle = processHierarchies(testCases.cycle);
    results.cycle_test = {
        passed: resCycle.summary.total_cycles === 1 && resCycle.summary.total_trees === 0,
        output: resCycle.hierarchies
    };

    const resDup = processHierarchies(testCases.duplicate);
    results.duplicate_test = {
        passed: resDup.duplicate_edges.length === 1 && resDup.duplicate_edges[0] === "A->B",
        output: resDup.duplicate_edges
    };

    const resInv = processHierarchies(testCases.invalid);
    results.invalid_test = {
        passed: resInv.invalid_entries.length === 1 && resInv.invalid_entries[0] === "A->A",
        output: resInv.invalid_entries
    };

    const resMulti = processHierarchies(testCases.multiParent);
    results.multi_parent_test = {
        passed: resMulti.summary.total_trees === 1 && resMulti.hierarchies.length === 1 && resMulti.hierarchies[0].root === "A",
        targetAchieved: true 
    };

    const resDepth = processHierarchies(testCases.depth);
    results.depth_test = {
        passed: resDepth.summary.largest_tree_root === "A" && resDepth.hierarchies[0].depth === 4,
        max_depth: resDepth.hierarchies[0].depth
    };

    return res.status(200).json({
        message: "Internal Test Suite Results",
        tests: results
    });
};

module.exports = {
    getBfhl,
    postBfhl,
    runInternalTests
};
