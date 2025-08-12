// --- PERMUTATION GENERATORS ---

import PermutationBuilder from "../../lib/permutation-builder.ts";

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

function generateName(params: { [key: string]: any }) {
    const {digitsNum1, digitsNum2, operations, allowNegatives} = params;
    let name = `${digitsNum1 || 'R'}x${digitsNum2 || 'R'}_${operations.replaceAll(',', '-')}`;
    if (allowNegatives) {
        name += '_neg';
    }
    return name;
}

function generateLabels() {
    return {}
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
}