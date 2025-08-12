import {describe, it, expect} from 'vitest';

import PermutationBuilder from './permutation-builder.js';

describe('PermutationBuilder', () => {
    it('should return an empty object permutation by default', () => {
        const builder = new PermutationBuilder();
        expect(builder.build()).toEqual([{ params: {} }]);
    });

    it('should apply a single range correctly', () => {
        const builder = new PermutationBuilder()
            .applyRange(['digitsNum1'], [1, 2]);
        expect(builder.build()).toEqual([
            { params: { digitsNum1: 1 } },
            { params: { digitsNum1: 2 } },
        ]);
    });

    it('should apply multiple keys in a range correctly', () => {
        const builder = new PermutationBuilder()
            .applyRange(['digitsNum1', 'digitsNum2'], [1, 2]);
        expect(builder.build()).toEqual([
            { params: { digitsNum1: 1, digitsNum2: 1 } },
            { params: { digitsNum1: 2, digitsNum2: 2 } },
        ]);
    });

    it('should apply variants correctly', () => {
        const builder = new PermutationBuilder()
            .applyVariants('operations', ['add', 'subtract']);
        expect(builder.build()).toEqual([
            { params: { operations: 'add' } },
            { params: { operations: 'subtract' } },
        ]);
    });

    it('should chain applyRange and applyVariants correctly', () => {
        const builder = new PermutationBuilder()
            .applyRange(['digitsNum1'], [1, 2])
            .applyVariants('operations', ['add', 'subtract']);
        expect(builder.build()).toEqual([
            { params: { digitsNum1: 1, operations: 'add' } },
            { params: { digitsNum1: 1, operations: 'subtract' } },
            { params: { digitsNum1: 2, operations: 'add' } },
            { params: { digitsNum1: 2, operations: 'subtract' } },
        ]);
    });

    it('should chain applyVariants and applyRange correctly', () => {
        const builder = new PermutationBuilder()
            .applyVariants('operations', ['add', 'subtract'])
            .applyRange(['digitsNum1'], [1, 2]);
        expect(builder.build()).toEqual([
            { params: { operations: 'add', digitsNum1: 1 } },
            { params: { operations: 'add', digitsNum1: 2 } },
            { params: { operations: 'subtract', digitsNum1: 1 } },
            { params: { operations: 'subtract', digitsNum1: 2 } },
        ]);
    });

    it('should handle multiple applyRange calls', () => {
        const builder = new PermutationBuilder()
            .applyRange(['digitsNum1'], [1, 2])
            .applyRange(['digitsNum2'], [3, 4]);
        expect(builder.build()).toEqual([
            { params: { digitsNum1: 1, digitsNum2: 3 } },
            { params: { digitsNum1: 1, digitsNum2: 4 } },
            { params: { digitsNum1: 2, digitsNum2: 3 } },
            { params: { digitsNum1: 2, digitsNum2: 4 } },
        ]);
    });

    it('should handle multiple applyVariants calls', () => {
        const builder = new PermutationBuilder()
            .applyVariants('operations', ['add', 'subtract'])
            .applyVariants('blankPart', ['answer', 'problem']);
        expect(builder.build()).toEqual([
            { params: { operations: 'add', blankPart: 'answer' } },
            { params: { operations: 'add', blankPart: 'problem' } },
            { params: { operations: 'subtract', blankPart: 'answer' } },
            { params: { operations: 'subtract', blankPart: 'problem' } },
        ]);
    });

    it('should handle empty range', () => {
        const builder = new PermutationBuilder()
            .applyRange(['digitsNum1'], [1, 0]); // Invalid range
        expect(builder.build()).toEqual([]);
    });

    it('should handle empty variants', () => {
        const builder = new PermutationBuilder()
            .applyVariants('operations', []);
        expect(builder.build()).toEqual([]);
    });

    it('should handle initial empty permutations array', () => {
        const builder = new PermutationBuilder();
        builder.permutations = []; // Simulate an empty initial state
        builder.applyRange(['digitsNum1'], [1, 2]);
        expect(builder.build()).toEqual([]);
    });

    // New tests for applyParams
    it('should apply static parameters correctly', () => {
        const builder = new PermutationBuilder()
            .applyParams({ type: 'math', difficulty: 'easy' });
        expect(builder.build()).toEqual([
            { params: { type: 'math', difficulty: 'easy' } },
        ]);
    });

    it('should chain applyParams calls correctly', () => {
        const builder = new PermutationBuilder()
            .applyParams({ type: 'math' })
            .applyParams({ difficulty: 'medium' });
        expect(builder.build()).toEqual([
            { params: { type: 'math', difficulty: 'medium' } },
        ]);
    });

    it('should applyParams before applyRange', () => {
        const builder = new PermutationBuilder()
            .applyParams({ type: 'math' })
            .applyRange(['digitsNum1'], [1, 2]);
        expect(builder.build()).toEqual([
            { params: { type: 'math', digitsNum1: 1 } },
            { params: { type: 'math', digitsNum1: 2 } },
        ]);
    });

    it('should applyParams after applyRange', () => {
        const builder = new PermutationBuilder()
            .applyRange(['digitsNum1'], [1, 2])
            .applyParams({ type: 'math' });
        expect(builder.build()).toEqual([
            { params: { type: 'math', digitsNum1: 1 } },
            { params: { type: 'math', digitsNum1: 2 } },
        ]);
    });

    it('should applyParams before applyVariants', () => {
        const builder = new PermutationBuilder()
            .applyParams({ type: 'math' })
            .applyVariants('operations', ['add', 'subtract']);
        expect(builder.build()).toEqual([
            { params: { type: 'math', operations: 'add' } },
            { params: { type: 'math', operations: 'subtract' } },
        ]);
    });

    it('should applyParams after applyVariants', () => {
        const builder = new PermutationBuilder()
            .applyVariants('operations', ['add', 'subtract'])
            .applyParams({ type: 'math' });
        expect(builder.build()).toEqual([
            { params: { type: 'math', operations: 'add' } },
            { params: { type: 'math', operations: 'subtract' } },
        ]);
    });

    it('should overwrite existing parameters with applyParams', () => {
        const builder = new PermutationBuilder()
            .applyParams({ type: 'old_type', difficulty: 'easy' })
            .applyParams({ type: 'new_type' });
        expect(builder.build()).toEqual([
            { params: { type: 'new_type', difficulty: 'easy' } },
        ]);
    });
});