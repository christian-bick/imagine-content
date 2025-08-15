import PermutationBuilder from "../../lib/permutation-builder.ts";
import {Area, Scope} from "edugraph-ts";

function generatePermutations() {
    return [
        new PermutationBuilder()
            .applyVariants('max', [5, 9])
            .applyVariants('type', ['inc', 'dec', 'mixed'])
            .build()
    ];
}

function generateName(params: { [key: string]: any }) {
    return `counting-inc-dec-${params.max}-${params.type}`;
}

function generateLabels(params: { [key: string]: any }) {
    return {
        Area: [ Area.Numeration, Area.Increment ],
        Ability: [  ],
        Scope: [
            Scope.NumbersSmaller10,
            Scope.ArabicNumerals,
            Scope.Base10,
            Scope.NumbersWithoutZero,
            Scope.CountingSymbols
        ],
    };
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
};
