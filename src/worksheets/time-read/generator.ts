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
    else if (interval === 1800) intervalName = 'half-hour';
    else if (interval === 900) intervalName = 'quarter-hour';
    else if (interval === 300) intervalName = 'minute';
    else if (interval === 6) intervalName = 'second';
    return `time-read-${intervalName}`;
}

function generateLabels(params: { [key: string]: any }) {
    return {
        Ability: [Ability.MeasurementTime],
        Scope: [Scope.Time, Scope.Analog, Scope.Digital24Hour],
        Area: [Area.TimeReading]
    }
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
}
