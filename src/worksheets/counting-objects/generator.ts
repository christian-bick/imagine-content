import {Ability, Area, Scope} from "edugraph-ts";

function generatePermutations() {
    return [
        {count: 5},
        {count: 10},
        {count: 15},
        {count: 20},
    ];
}

function generateName(params: { [key: string]: any }) {
    return `counting-${params.count}`;
}

function generateLabels(params: { [key: string]: any }) {
    return {
        Area: [Area.NumerationWithIntegers, Area.IntegerNotation],
        Ability: [Ability.ProcedureExecution],
        Scope: [
            Scope.Base10,
            Scope.ArabicNumerals,
            Scope.NumbersWithoutZero,
            Scope.NumbersWithoutNegatives,
            Scope.CountingSymbols,
            params.count <= 10 ? Scope.NumbersSmaller10 : Scope.NumbersSmaller20
        ],
    };
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
};
