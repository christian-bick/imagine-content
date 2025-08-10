const DEFAULT_COUNT = 1

// --- PERMUTATION GENERATORS ---

function generateAdditionPermutations() {
    const permutations = [];
    for (let i = 1; i <= 3; i++) {
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'add',
                blankPart: 'answer'
            },
            count: DEFAULT_COUNT
        });
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'add',
                blankPart: 'problem'
            },
            count: DEFAULT_COUNT
        });
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'add',
                blankPart: 'problem-answer'
            },
            count: DEFAULT_COUNT
        });
    }
    permutations.push({
        params: {
            operations: 'add',
            blankPart: 'answer'
        },
        count: DEFAULT_COUNT
    });
    permutations.push({
        params: {
            operations: 'add',
            blankPart: 'problem',
        },
        count: DEFAULT_COUNT
    });
    permutations.push({
        params: {
            operations: 'add',
            blankPart: 'problem-answer',
        },
        count: DEFAULT_COUNT
    });
    return permutations;
}

function generateSubtractionPermutations() {
    const permutations = [];
    for (let i = 1; i <= 3; i++) {
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'subtract',
                blankPart: 'answer'
            },
            count: DEFAULT_COUNT
        });
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'add',
                blankPart: 'subtract'
            },
            count: DEFAULT_COUNT
        });
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'subtract',
                blankPart: 'problem-answer'
            },
            count: DEFAULT_COUNT
        });
    }
    permutations.push({
        params: {
            operations: 'subtract',
            blankPart: 'answer'
        },
        count: DEFAULT_COUNT
    });
    permutations.push({
        params: {
            operations: 'subtract',
            blankPart: 'problem'
        },
        count: DEFAULT_COUNT
    });
    permutations.push({
        params: {
            operations: 'subtract',
            blankPart: 'problem-answer'
        },
        count: DEFAULT_COUNT
    });
    return permutations;
}

function generateDivisionPermutations() {
    const permutations = [];
    for (let i = 1; i <= 3; i++) {
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: 1,
                operations: 'divide'
            },
            count: DEFAULT_COUNT
        });
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: 1,
                operations: 'divide',
                blankPart: 'problem-answer'
            },
            count: DEFAULT_COUNT
        });
    }
    return permutations;
}

function generateMultiplicationPermutations() {
    const permutations = [];
    for (let i = 1; i <= 3; i++) {
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: 1,
                operations: 'multiply'
            },
            count: DEFAULT_COUNT
        });
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: 1,
                operations: 'problem-answer'
            },
            count: DEFAULT_COUNT
        });
    }
    return permutations;
}

function generateMixedAddSubtract() {
    const permutations = [];
    for (let i = 1; i <= 3; i++) {
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'add,subtract',
                blankPart: 'answer'
            },
            count: DEFAULT_COUNT
        });
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'add,subtract',
                blankPart: 'problem'
            },
            count: DEFAULT_COUNT
        });
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'add,subtract',
                blankPart: 'problem-answer'
            },
            count: DEFAULT_COUNT
        });
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'add,subtract',
                blankPart: 'random'
            },
            count: DEFAULT_COUNT
        });
    }
    return permutations;
}

function generateMixedMultiplyDivide() {
    const permutations = [];
    for (let i = 1; i <= 3; i++) {
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: 1,
                operations: 'multiply,divide',
                blankPart: 'random'
            },
            count: DEFAULT_COUNT
        });
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: 1,
                blankPart: 'operator'
            },
            count: DEFAULT_COUNT
        });
    }
    return permutations;
}

function generateMixedAll() {
    const permutations = [];
    for (let i = 1; i <= 3; i++) {
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: 1,
                blankPart: 'answers',
            },
            count: DEFAULT_COUNT
        });
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: 1,
                blankPart: 'operator',
            },
            count: DEFAULT_COUNT
        });
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: 1,
                blankPart: 'random',
            },
            count: DEFAULT_COUNT
        });
    }
    return permutations;
}

function generatePermutations() {
    return [
        //...generateAdditionPermutations(),
        //...generateSubtractionPermutations(),
        //...generateDivisionPermutations(),
        //...generateMultiplicationPermutations(),
        //...generateMixedAddSubtract(),
        //...generateMixedMultiplyDivide(),
        ...generateMixedAll(),
    ];
}

function generateName(params) {
    const {digitsNum1, digitsNum2, operations = 'all', allowNegatives, blankPart = 'answer'} = params;
    let name = `${digitsNum1 || 'R'}x${digitsNum2 || 'R'}_hide_${blankPart}_for_${operations.replaceAll(',', '-')}`;
    if (allowNegatives) {
        name += '_neg';
    }
    return name;
}

export default {
    generatePermutations,
    generateName,
}
