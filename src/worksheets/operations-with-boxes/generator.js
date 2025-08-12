// --- PERMUTATION GENERATORS ---

import PermutationBuilder from "../../lib/permutation-builder.js";

function generatePermutations() {
    return [
        // Same operations with same problem digits
        ...new PermutationBuilder()
            .applyRange(['digitsNum1', "digitsNum2"], [1, 3])
            .applyVariants('operations', ['add', 'subtract', 'multiply', 'divide'])
            .applyVariants('blankPart', ['answer', 'problem', 'problem-answer', 'random'])
            .applyVariants('allowNegatives', ['false', 'true'])
            .build(),

        // Same operations with random problem digits
        ...new PermutationBuilder()
            .applyVariants('operations', ['add', 'subtract', 'multiply', 'divide'])
            .applyVariants('blankPart', ['answer', 'problem', 'problem-answer'])
            .applyVariants('allowNegatives', ['false', 'true'])
            .build(),

        // Mixed operations with same digits
        ...new PermutationBuilder()
            .applyRange(['digitsNum1', "digitsNum2"], [1, 3])
            .applyVariants('operations', ['add,subtract', 'multiply,divide', 'add,subtract,multiply', 'add,subtract,multiply,divide'])
            .applyVariants('blankPart', ['answer', 'problem', 'problem-answer', 'operator', 'random'])
            .applyVariants('allowNegatives', ['false', 'true'])
            .build(),

        // Mixed operations with random digits
        ...new PermutationBuilder()
            .applyVariants('operations', ['add,subtract', 'multiply,divide', 'add,subtract,multiply', 'add,subtract,multiply,divide'])
            .applyVariants('blankPart', ['answer', 'problem', 'problem-answer', 'operator', 'random'])
            .applyVariants('allowNegatives', ['false', 'true'])
            .build(),
    ]
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
