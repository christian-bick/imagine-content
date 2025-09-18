import {describe, it, expect} from 'vitest';
import generator from './generator.ts';

describe('measure-length/generator', () => {
    it('should generate unique names for all permutations', () => {
        const permutations = generator.generatePermutations();
        const names = permutations.map(p => generator.generateName(p.params));
        const uniqueNames = new Set(names);
        expect(uniqueNames.size).toEqual(names.length);
    });
});
