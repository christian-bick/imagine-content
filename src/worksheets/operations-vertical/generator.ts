// --- PERMUTATION GENERATORS ---

import PermutationBuilder from "../../lib/permutation-builder.ts";
import {Ability, Area, Scope} from "edugraph-ts";
import {numScopes, withNegativesScope} from "../../lib/labels.ts";

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

function generateLabels(params: { [key: string]: any }) {
    const scopes = [
        Scope.ArabicNumerals,
        Scope.Base10,
        Scope.NumbersWithoutZero,
        ...numScopes([params.digitsNum1 || 5, params.digitsNum2 || 5]),
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

    return {
        Ability: [Ability.ProcedureMemorization, Ability.ProcedureExecution],
        Scope: scopes,
        Area: areas
    }
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
}