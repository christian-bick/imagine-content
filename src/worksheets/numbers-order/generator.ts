import {Ability, Area, Scope} from "edugraph-ts";
import PermutationBuilder from "../../lib/permutation-builder.ts";

// --- GENERATOR CONFIGURATION ---
function generatePermutations() {
    return new PermutationBuilder()
        .applyVariants('includesZero', ['true', 'false'])
        .applyVariants('desc', ['true', 'false'])
        .build()
}

function generateName(params: { [key: string]: any }) {
    const zeroPart = params.includesZero === 'true' ? 'with-zero' : 'without-zero';
    const orderPart = params.desc === 'true' ? 'desc' : 'asc';
    return `ordering-numbers-${zeroPart}-${orderPart}`;
}

function generateLabels(params: { [key: string]: any }) {
    const scope = [
        Scope.ArabicNumerals,
        Scope.NumbersSmaller10,
        Scope.Base10,
        Scope.NumbersWithoutNegatives,
        params.includesZero ? Scope.NumbersWithZero : Scope.NumbersWithoutZero
    ];
    return {
        Area: [Area.NumericOrder],
        Ability: [Ability.ProcedureExecution],
        Scope: scope,
    };
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
};