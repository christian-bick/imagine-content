function generatePermutations() {
    return [
        { order: 'default' },
        { order: 'random' },
    ];
}

function generateName(params: { [key: string]: any }) {
    return `writing-numbers-${params.order}`;
}

function generateLabels(params: { [key: string]: any }) {
    return {
        Ability: [],
        Scope: [],
        Area: []
    };
}

export default {
    generatePermutations,
    generateName,
    generateLabels,
};