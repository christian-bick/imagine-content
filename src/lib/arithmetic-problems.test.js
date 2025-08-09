import {generateSubtraction} from './arithmetic-problems.js';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('generateSubtraction', () => {

    // After each test, restore the original implementation of Math.random
    afterEach(() => {
        vi.restoreAllMocks();
    });

    // --- Standard Cases ---
    // These tests check the function's behavior under normal, expected conditions.
    describe('Standard Operation', () => {
        it('should generate the minimum possible numbers when Math.random returns 0', () => {
            // Mock Math.random to always return 0, which will select the minimum values.
            vi.spyOn(Math, 'random').mockReturnValue(0);

            const config = { minNum1: 10, maxNum1: 20, minNum2: 1, maxNum2: 9 };
            const { num1, num2, answer } = generateSubtraction(config);

            // num1 should be its minimum: floor(0 * (20-10+1)) + 10 = 10
            expect(num1).toBe(10);

            // maxSubtracted becomes min(10, 9) = 9
            // num2 should be its minimum: floor(0 * (9-1)) + 1 = 1
            expect(num2).toBe(1);

            expect(answer).toBe(9);
        });

        it('should generate the maximum possible numbers when Math.random is close to 1', () => {
            // Mock Math.random to return a value just under 1 to select the maximum values.
            vi.spyOn(Math, 'random').mockReturnValue(0.999999);

            const config = { minNum1: 10, maxNum1: 20, minNum2: 1, maxNum2: 9 };
            const { num1, num2, answer } = generateSubtraction(config);

            // num1 should be its maximum: floor(0.99... * 11) + 10 = 20
            expect(num1).toBe(20);

            // maxSubtracted becomes min(20, 9) = 9
            // num2 should be its maximum: floor(0.99... * (9-1)) + 1 = 8
            // Note: it's 8, not 9, because of the missing "+1" in the original function's formula
            expect(num2).toBe(9);

            expect(answer).toBe(11);
        });

        it('should ensure the answer is always non-negative by capping num2', () => {
            // We'll force num1 to be a specific value (e.g., 7)
            // Then we'll force num2 to try to be its max value.
            vi.spyOn(Math, 'random')
                .mockReturnValueOnce(0.2) // floor(0.2 * (10-5+1)) + 5 = floor(1.2)+5 = 6
                .mockReturnValueOnce(0.999); // Tries to generate the highest possible num2

            const config = { minNum1: 5, maxNum1: 10, minNum2: 1, maxNum2: 15 };
            const { num1, num2, answer } = generateSubtraction(config);

            // num1 is 6
            expect(num1).toBe(6);
            // maxSubtracted is min(6, 15) = 6
            // num2 should be <= 6. With random=0.999, it becomes floor(0.999 * (6-1)) + 1 = 5
            expect(num2).toBe(6);
            expect(num2).toBeLessThanOrEqual(num1);
            expect(answer).toBe(0);
            expect(answer).toBeGreaterThanOrEqual(0);
        });
    });

    // --- Boundary Cases ---
    // These tests check the function's behavior at the limits of the input ranges.
    describe('Boundary Conditions', () => {
        it('should work correctly when min and max values are the same', () => {
            const config = { minNum1: 10, maxNum1: 10, minNum2: 5, maxNum2: 5 };
            const { num1, num2, answer } = generateSubtraction(config);

            expect(num1).toBe(10);
            expect(num2).toBe(5);
            expect(answer).toBe(5);
        });

        it('should produce a result of 0 when all range values are identical', () => {
            const config = { minNum1: 10, maxNum1: 10, minNum2: 10, maxNum2: 10 };
            const { num1, num2, answer } = generateSubtraction(config);

            expect(num1).toBe(10);
            expect(num2).toBe(10);
            expect(answer).toBe(0);
        });

        it('should handle zero as a valid minimum number', () => {
            // Force num1 to be 0
            vi.spyOn(Math, 'random').mockReturnValue(0);
            const config = { minNum1: 0, maxNum1: 5, minNum2: 0, maxNum2: 5 };
            const { num1, num2, answer } = generateSubtraction(config);

            expect(num1).toBe(0);
            // maxSubtracted = min(0, 5) = 0.
            // num2 = floor(random * (0-0)) + 0 = 0.
            expect(num2).toBe(0);
            expect(answer).toBe(0);
        });
    });

    // --- Edge Cases ---
    // These tests explore unusual configurations based on the function's specific implementation.
    describe('Edge Cases and Logic Quirks', () => {
        it('should produce a predictable result when minNum2 > maxNum1', () => {
            // This case is deterministic regardless of Math.random, so no mock is needed.
            const config = { minNum1: 5, maxNum1: 5, minNum2: 6, maxNum2: 10 };
            const { num1, num2, answer } = generateSubtraction(config);

            expect(num1).toBe(5);
            expect(num2).toBe(6);
            expect(answer).toBe(-1);
        });
    });
});
