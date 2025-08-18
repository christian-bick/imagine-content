import {Ability, Area, Scope} from "edugraph-ts";
import PermutationBuilder from "../../lib/permutation-builder.ts";

function generatePermutations() {
    return new PermutationBuilder()
        .applyVariants('bandLength', [10, 20])
        .applyVariants('decimal', ['true', 'false'])
        .build()
}

function generateName(params: { [key: string]: any }) {
    return `measure-length-${params.bandLength}cm`;
}

function generateLabels(params: { [key: string]: any }) {
    return {
        Area: [Area.MeasuringObjects],
        Ability: [Ability.ProcedureApplication, Ability.ProcedureExecution],
        Scope: [Scope.CentimeterScale, Scope.MilimeterScale, Scope.Tapemeter],
    };
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
};
