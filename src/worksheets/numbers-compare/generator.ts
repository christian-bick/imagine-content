// --- PERMUTATION GENERATORS ---

import PermutationBuilder from "../../lib/permutation-builder.ts";
import {Ability, Area, Scope} from "edugraph-ts";
import {numScopes} from "../../lib/labels.ts";

function generatePermutations() {
    return new PermutationBuilder()
        .applyRange(['digits'], [1, 3])
        .applyVariants('includesZero', ['true', 'false'])
        .build()
}

function generateName(params: { [key: string]: any }) {
    const {digits, includesZero} = params;
    let name = `${digits}-digit-comparison`;
    if (includesZero === 'true') {
        name += '_zero';
    }
    return name;
}

function generateLabels(params: { [key: string]: any }) {
    const scopes = [
        Scope.ArabicNumerals,
        Scope.Base10,
        Scope.NumbersWithoutNegatives,
        params.includesZero === 'true' ? Scope.NumbersWithZero : Scope.NumbersWithoutZero,
        ...numScopes([params.digits || 3]),
    ]

    return {
        Ability: [Ability.ProcedureExecution],
        Scope: scopes,
        Area: [Area.NumericComparison]
    }
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
}
