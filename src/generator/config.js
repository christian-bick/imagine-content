// src/generator/config.js

// --- BASE CONFIGURATIONS ---


const baseSettings = {
    digits: {
        single: { digitsNum1: 1, digitsNum2: 1 },
        double: { digitsNum1: 2, digitsNum2: 2 },
        mixed: { digitsNum1: 2, digitsNum2: 1 },
    },
    operations: {
        add_subtract: { operations: 'add,subtract' },
        multiply: { operations: 'multiply' },
        divide: { operations: 'divide' },
    }
};

// --- PERMUTATION DEFINITIONS ---

let permutations = [
    { ...baseSettings.digits.double, ...baseSettings.operations.add_subtract, count: 3 },
    { ...baseSettings.digits.single, ...baseSettings.operations.multiply, count: 2 },
    { ...baseSettings.digits.mixed, ...baseSettings.operations.divide, count: 5 }
];

// --- MODIFIERS ---

function withNegatives(perms) {
    const negativePerms = perms.map(p => ({
        ...p,
        allowNegatives: true,
    }));
    return [...perms, ...negativePerms];
}

permutations = withNegatives(permutations);

// --- NAME GENERATION ---

function generateName(params) {
    const { digitsNum1, digitsNum2, operations, allowNegatives } = params;
    let name = `${digitsNum1}x${digitsNum2}_${operations.replace(',', '-')}`;
    if (allowNegatives) {
        name += '_neg';
    }
    return name;
}

// --- EXPORT ---

export function getConfigurations() {
    const moduleName = 'operations-vertical';
    const combinations = [];
    for (const perm of permutations) {
        const { count, ...params } = perm;
        const name = generateName(params);
        for (let i = 1; i <= count; i++) {
            combinations.push({
                params: params,
                filename: `${moduleName}_${name}_v${i}.pdf`
            });
        }
    }
    return combinations;
}