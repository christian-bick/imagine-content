const DEFAULT_COUNT = 1

// --- PERMUTATION GENERATORS ---

function generateAdditionPermutations() {
    const permutations = [];
    for (let i = 2; i <= 5; i++) {
        permutations.push({
            digitsNum1: i,
            digitsNum2: i,
            operations: 'add',
            count: DEFAULT_COUNT
        });
    }
    permutations.push({
        operations: 'add',
        count: DEFAULT_COUNT
    });
    return permutations;
}

function generateSubtractionPermutations() {
    const permutations = [];
    for (let i = 2; i <= 5; i++) {
        permutations.push({
            digitsNum1: i,
            digitsNum2: i,
            operations: 'subtract',
            count: DEFAULT_COUNT
        });
        permutations.push({
            digitsNum1: i,
            digitsNum2: i,
            operations: 'subtract',
            count: DEFAULT_COUNT,
            allowNegatives: 1
        });
    }
    permutations.push({
        operations: 'subtract',
        count: DEFAULT_COUNT
    });
    permutations.push({
        operations: 'subtract',
        count: DEFAULT_COUNT,
        allowNegatives: 1
    });
    return permutations;
}

function generateDivisionPermutations() {
    const permutations = [];
    for (let i = 2; i <= 5; i++) {
        permutations.push({
            digitsNum1: i,
            digitsNum2: 1,
            operations: 'divide',
            count: DEFAULT_COUNT
        });
    }
    return permutations;
}

function generateMultiplicationPermutations() {
    const permutations = [];
    for (let i = 2; i <= 5; i++) {
        permutations.push({
            digitsNum1: i,
            digitsNum2: 1,
            operations: 'multiply',
            count: DEFAULT_COUNT
        });
    }
    return permutations;
}

function generateMixedAddSubtract() {
    const permutations = [];
    for (let i = 2; i <= 5; i++) {
        permutations.push({
            digitsNum1: i,
            digitsNum2: i,
            operations: 'add,subtract',
            count: DEFAULT_COUNT
        });
    }
    permutations.push({
        operations: 'add,subtract',
        count: DEFAULT_COUNT
    });
    return permutations;
}

function generateMixedMultiplyDivide() {
    const permutations = [];
    for (let i = 2; i <= 5; i++) {
        permutations.push({
            digitsNum1: i,
            digitsNum2: 1,
            operations: 'multiply,divide',
            count: DEFAULT_COUNT
        });
    }
    return permutations;
}

function generatePermutations() {
    return [
        ...generateAdditionPermutations(),
        ...generateSubtractionPermutations(),
        ...generateDivisionPermutations(),
        ...generateMultiplicationPermutations(),
        ...generateMixedAddSubtract(),
        ...generateMixedMultiplyDivide()
    ];
}

function generateName(params) {
    const {digitsNum1, digitsNum2, operations, allowNegatives} = params;
    let name = `${digitsNum1 || 'R'}x${digitsNum2 || 'R'}_${operations.replace(',', '-')}`;
    if (allowNegatives) {
        name += '_neg';
    }
    return name;
}

export const config = {
    generatePermutations,
    generateName,
}
