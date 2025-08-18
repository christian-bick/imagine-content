// --- PERMUTATION GENERATORS ---

import PermutationBuilder from "../../lib/permutation-builder.ts";
import {Ability, Area, Scope} from "edugraph-ts";

function generatePermutations() {
    return new PermutationBuilder()
        .applyVariants('interval', [3600, 1800, 900, 60, 1])
        .build()
}

function generateName(params: { [key: string]: any }) {
    const {interval} = params;
    let intervalName = '';
    if (interval === 3600) intervalName = 'hour';
    else if (interval === 1800) intervalName = 'half';
    else if (interval === 900) intervalName = 'quarter';
    else if (interval === 60) intervalName = 'minute';
    else if (interval === 1) intervalName = 'second';
    return `time-read-${intervalName}`;
}

function generateLabels(params: { [key: string]: any }) {
    const {interval} = params;
    let intervalScope;
    if (interval < 60) {
        intervalScope = Scope.SecondIntervals
    } else if (interval < interval < 3600) {
        intervalScope = Scope.MinuteIntervals
    } else {
        intervalScope = Scope.HourIntervals
    }
    return {
        Area: [Area.MeasuringTime],
        Ability: [Ability.ProcedureApplication, Ability.ProcedureExecution],
        Scope: [Scope.AnalogClock, intervalScope],
    }
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
}
