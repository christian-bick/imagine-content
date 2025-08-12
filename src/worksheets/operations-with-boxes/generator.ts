// --- PERMUTATION GENERATORS ---

import PermutationBuilder from "../../lib/permutation-builder.ts";
import {Area, Scope, Ability} from "edugraph-ts";
import {numScopes, withNegativesScope} from "../../lib/labels.ts";

function generatePermutations() {
    return [
        // Same operations with same problem digits
        ...new PermutationBuilder()
            .applyRange(['digitsNum1', "digitsNum2"], [1, 3])
            .applyVariants('operations', ['add', 'subtract', 'multiply', 'divide'])
            .applyVariants('blankPart', ['answer', 'problem', 'problem-answer', 'random'])
            .applyVariants('allowNegatives', [false, true])
            .build(),

        // Same operations with random problem digits
        ...new PermutationBuilder()
            .applyVariants('operations', ['add', 'subtract', 'multiply', 'divide'])
            .applyVariants('blankPart', ['answer', 'problem', 'problem-answer'])
            .applyVariants('allowNegatives', [false, true])
            .build(),

        // Mixed operations with same digits
        ...new PermutationBuilder()
            .applyRange(['digitsNum1', "digitsNum2"], [1, 3])
            .applyVariants('operations', ['add,subtract', 'multiply,divide', 'add,subtract,multiply', 'add,subtract,multiply,divide'])
            .applyVariants('blankPart', ['answer', 'problem', 'problem-answer', 'operator', 'random'])
            .applyVariants('allowNegatives', [false, true])
            .build(),

        // Mixed operations with random digits
        ...new PermutationBuilder()
            .applyVariants('operations', ['add,subtract', 'multiply,divide', 'add,subtract,multiply', 'add,subtract,multiply,divide'])
            .applyVariants('blankPart', ['answer', 'problem', 'problem-answer', 'operator', 'random'])
            .applyVariants('allowNegatives', [false, true])
            .build(),
    ]
}

function generateName(params: { [key: string]: any }) {
    const {digitsNum1, digitsNum2, operations = 'all', allowNegatives, blankPart = 'answer'} = params;
    let name = `${digitsNum1 || 'R'}x${digitsNum2 || 'R'}_hide_${blankPart}_for_${operations.replaceAll(',', '-')}`;
    if (allowNegatives) {
        name += '_neg';
    }
    return name;
}

function generateLabels(params: { [key: string]: any }) {
    const scopes = [
        Scope.ArabicNumerals,
        Scope.Base10,
        Scope.NumbersWithoutZero,
        ...numScopes([params.digitsNum1 || 3, params.digitsNum2 || 3]),
        ...withNegativesScope(params.allowNegatives),
    ]

    const areas = params.operations.split(',').map((op: string) => {
        const mapping: { [key: string]: Area } = {
            add: Area.IntegerAdditon,
            subtract: Area.IntegerSubtraction,
            divide: Area.IntegerDivision,
            multiply: Area.IntegerMultiplication
        }
        return mapping[op]
    })

    const blank = params.blankPart
    const abilities = (blank === 'operator' || blank === 'random') ? [Ability.ProcedureIdentification] : []
    abilities.push(Ability.ProcedureApplication)

    return {
        Ability: abilities,
        Scope: scopes,
        Area: areas
    }
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
}
