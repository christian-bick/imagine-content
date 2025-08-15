import PermutationBuilder from "../../lib/permutation-builder.ts";
import {Ability, Area, Scope} from "edugraph-ts";

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
    let areas;
    if (params.type === 'inc') {
        areas = [Area.Increment]
    } else if (params.type === 'dec') {
        areas = [Area.Decrement]
    } else {
        areas = [Area.Increment, Area.Decrement]
    }
    return {
        Area: [Area.Numeration, ...areas],
        Ability: [Ability.Formalization, Ability.ProcedureIdentification, Ability.ProcedureExecution],
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
