export default class PermutationBuilder {

    permutations = [{ params: {}}]

    applyRange(keys, range) {
        const newPermutations = []
        for (const permutation of this.permutations) {
            for (let i = range[0]; i <= range[1]; i++) {
                const params = {};
                for (const key of keys) {
                    params[key] = i;
                }
                newPermutations.push({
                    ...permutation,
                    params: {
                        ...permutation.params,
                        ...params
                    }
                })
            }
        }
        this.permutations = newPermutations
        return this
    }

    applyVariants(key, values) {
        const newPermutations = []
        for (const permutation of this.permutations) {
            for (const value of values) {
                newPermutations.push({
                    ...permutation,
                    params: {
                        ...permutation.params,
                        [key]: value
                    }
                })
            }
        }
        this.permutations = newPermutations
        return this;
    }

    build() {
        return this.permutations
    }
}