import {Ability, Area, Scope} from "edugraph-ts";

function generatePermutations() {
    return [
        {params: {order: 'default'}},
        {params: {order: 'random'}},
    ];
}

function generateName(params: { [key: string]: any }) {
    return `writing-numbers-${params.order}`;
}

function generateLabels(params: { [key: string]: any }) {
    return {
        Area: [Area.NumberNotation],
        Ability: [Ability.Formalization],
        Scope: [
            Scope.ArabicNumerals,
            Scope.NumbersSmaller10,
            Scope.Base10,
            Scope.NumbersWithoutNegatives,
            Scope.CountingSymbols,
            Scope.TenFrame
        ],
    };
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
};