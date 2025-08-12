// --- PERMUTATION GENERATORS ---

import PermutationBuilder from "../../lib/permutation-builder.js";

function generateAdditionPermutations() {
    const permutations = [];
    for (let i = 2; i <= 5; i++) {
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'add',
            }
        });
    }
    permutations.push({
        params: {
            operations: 'add',
        }
    });
    return permutations;
}

function generateSubtractionPermutations() {
    const permutations = [];
    for (let i = 2; i <= 5; i++) {
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'subtract'
            }
        });
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'subtract',
                allowNegatives: 1
            }
        });
    }
    permutations.push({
        params: {
            operations: 'subtract',
        }
    });
    permutations.push({
        params: {
            operations: 'subtract',
            allowNegatives: 1
        }
    });
    return permutations;
}

function generateDivisionPermutations() {
    const permutations = [];
    for (let i = 2; i <= 5; i++) {
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: 1,
                operations: 'divide'
            }
        });
    }
    return permutations;
}

function generateMultiplicationPermutations() {
    const permutations = [];
    for (let i = 2; i <= 5; i++) {
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: 1,
                operations: 'multiply',
            }
        });
    }
    return permutations;
}

function generateMixedAddSubtract() {
    const permutations = [];
    for (let i = 2; i <= 5; i++) {
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: i,
                operations: 'add,subtract',
            }
        });
    }
    permutations.push({
        params: {
            operations: 'add,subtract'
        }
    });
    return permutations;
}

function generateMixedMultiplyDivide() {
    const permutations = [];
    for (let i = 2; i <= 5; i++) {
        permutations.push({
            params: {
                digitsNum1: i,
                digitsNum2: 1,
                operations: 'multiply,divide',
            }
        });
    }
    return permutations;
}

function generatePermutations() {
    return [
        // Same operations with same problem digits
        ...new PermutationBuilder()
            .applyRange(['digitsNum1', "digitsNum2"], [2, 5])
            .applyVariants('operations', ['add', 'subtract'])
            .applyVariants('allowNegatives', ['false', 'true'])
            .build(),

        ...new PermutationBuilder()
            .applyParams({digitsNum2: 1})
            .applyRange(['digitsNum1'], [2, 5])
            .applyVariants('operations', ['multiply', 'divide'])
            .build(),
    ]
}

function generateName(params) {
    const {digitsNum1, digitsNum2, operations, allowNegatives} = params;
    let name = `${digitsNum1 || 'R'}x${digitsNum2 || 'R'}_${operations.replaceAll(',', '-')}`;
    if (allowNegatives) {
        name += '_neg';
    }
    return name;
}

export default {
    generatePermutations,
    generateName,
}