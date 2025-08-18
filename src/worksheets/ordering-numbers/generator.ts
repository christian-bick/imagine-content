import {Ability, Area, Scope} from "edugraph-ts";

// --- GENERATOR CONFIGURATION ---
function generatePermutations() {
    return [
        {params: {includesZero: true}},
        {params: {includesZero: false}},
    ];
}

function generateName(params: { [key: string]: any }) {
    return `ordering-numbers-${params.includesZero ? 'with-zero' : 'without-zero'}`;
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