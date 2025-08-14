import {Ability, Area} from "edugraph-ts";

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
        Area: [ Area.NumerationWithIntegers, Area.IntegerNotation ],
        Ability: [ Ability. ],
        Scope: [],
    };
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
};
