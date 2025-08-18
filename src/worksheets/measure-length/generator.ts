import {Ability, Area, Scope} from "edugraph-ts";

function generatePermutations() {
    return [
        {params: {bandLength: 10}},
        {params: {bandLength: 20}},
    ];
}

function generateName(params: { [key: string]: any }) {
    return `measure-length-${params.bandLength}cm`;
}

function generateLabels(params: { [key: string]: any }) {
    return {
        Area: [Area.MeasuringObjects],
        Ability: [Ability.ProcedureApplication, Ability.ReadingScales],
        Scope: [
            Scope.Base10,
            Scope.ArabicNumerals,
            Scope.NumbersWithoutZero,
            Scope.NumbersWithoutNegatives,
            Scope.CentimeterScale,
            Scope.MillimeterScale,
        ],
    };
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
};
