import {
    generateSubtraction,
    generateAddition,
    generateDivision,
    generateMultiplication
} from './arithmetic-problems.ts';
import {describe, it, expect, vi, afterEach} from 'vitest';

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

            const config = {minNum1: 10, maxNum1: 20, minNum2: 1, maxNum2: 9};
            const {num1, num2, answer} = generateSubtraction(config);

            // num1 should be its minimum: floor(0 * (20-10+1)) + 10 = 10
            expect(num1).toBe(10);

            // maxSubtracted becomes min(10, 9) = 9
            // num2 should be its minimum: floor(0 * (9-1+1)) + 1 = 1
            expect(num2).toBe(1);

            expect(answer).toBe(9);
        });

        it('should generate the maximum possible numbers when Math.random is close to 1', () => {
            // Mock Math.random to return a value just under 1 to select the maximum values.
            vi.spyOn(Math, 'random').mockReturnValue(0.999999);

            const config = {minNum1: 10, maxNum1: 20, minNum2: 1, maxNum2: 9};
            const {num1, num2, answer} = generateSubtraction(config);

            // num1 should be its maximum: floor(0.99... * 11) + 10 = 20
            expect(num1).toBe(20);

            // maxSubtracted becomes min(20, 9) = 9
            // num2 should be its maximum: floor(0.99... * (9-1+1)) + 1 = 9
            expect(num2).toBe(9);

            expect(answer).toBe(11);
        });

        it('should ensure the answer is always non-negative by capping num2', () => {
            // Force num1 to be a specific value, then try to generate the highest possible num2.
            vi.spyOn(Math, 'random')
                .mockReturnValueOnce(0.2) // Generates num1: floor(0.2 * (10-5+1)) + 5 = 6
                .mockReturnValueOnce(0.999); // Tries to generate the highest possible num2

            const config = {minNum1: 5, maxNum1: 10, minNum2: 1, maxNum2: 15};
            const {num1, num2, answer} = generateSubtraction(config);

            // With num1=6, maxSubtracted is min(6, 15) = 6.
            // num2's max is floor(0.999 * (6-1+1)) + 1 = 6.
            expect(num1).toBe(6);
            expect(num2).toBe(6);
            expect(num2).toBeLessThanOrEqual(num1);
            expect(answer).toBe(0);
            expect(answer).toBeGreaterThanOrEqual(0);
        });
    });

    describe('when allowNegatives is true', () => {
        it('should produce a negative answer when subtracting a larger positive number', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0); // Selects minimums
            const config = { minNum1: 5, maxNum1: 10, minNum2: 15, maxNum2: 20 };
            const { num1, num2, answer } = generateSubtraction(config, true);

            expect(num1).toBe(5);
            expect(num2).toBe(15);
            expect(answer).toBe(-10);
        });

        it('should correctly subtract a negative number from a positive number (e.g., 10 - (-5))', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0); // Selects minimums
            const config = { minNum1: 10, maxNum1: 10, minNum2: -5, maxNum2: -5 };
            const { num1, num2, answer } = generateSubtraction(config, true);

            expect(num1).toBe(10);
            expect(num2).toBe(-5);
            expect(answer).toBe(15);
        });
    });

    describe('when allowNegatives is false', () => {
        it('should still prevent negative answers even if boundaries are negative', () => {
            vi.spyOn(Math, 'random')
                .mockReturnValueOnce(0) // num1 = -10
                .mockReturnValueOnce(0.999); // Tries to generate max num2

            // Here, num1 will be -10. The logic should cap num2 at -10.
            const config = { minNum1: -10, maxNum1: -5, minNum2: -20, maxNum2: -8 };
            const { num1, num2, answer } = generateSubtraction(config, false);

            expect(num1).toBe(-10);
            // maxForNum2 is min(-10, -8) = -10. So num2's max is -10.
            expect(num2).toBe(-10);
            expect(answer).toBe(0);
        });
    });

    // --- Casual Use Cases ---
    // These tests check common, straightforward scenarios.
    describe('Casual Use Cases', () => {
        it('should correctly subtract single-digit numbers', () => {
            const config = {minNum1: 5, maxNum1: 5, minNum2: 2, maxNum2: 2};
            const {num1, num2, answer} = generateSubtraction(config);
            expect(num1).toBe(5);
            expect(num2).toBe(2);
            expect(answer).toBe(3);
        });

        it('should correctly subtract two-digit numbers', () => {
            const config = {minNum1: 50, maxNum1: 50, minNum2: 25, maxNum2: 25};
            const {num1, num2, answer} = generateSubtraction(config);
            expect(num1).toBe(50);
            expect(num2).toBe(25);
            expect(answer).toBe(25);
        });

        it('should correctly subtract a 3-digit number from a 4-digit number', () => {
            const config = {minNum1: 1234, maxNum1: 1234, minNum2: 567, maxNum2: 567};
            const {num1, num2, answer} = generateSubtraction(config);
            expect(num1).toBe(1234);
            expect(num2).toBe(567);
            expect(answer).toBe(667);
        });
    });

    // --- Boundary Cases ---
    // These tests check the function's behavior at the limits of the input ranges.
    describe('Boundary Conditions', () => {
        it('should work correctly when min and max values are the same', () => {
            const config = {minNum1: 10, maxNum1: 10, minNum2: 5, maxNum2: 5};
            const {num1, num2, answer} = generateSubtraction(config);

            expect(num1).toBe(10);
            expect(num2).toBe(5);
            expect(answer).toBe(5);
        });

        it('should produce a result of 0 when all range values are identical', () => {
            const config = {minNum1: 10, maxNum1: 10, minNum2: 10, maxNum2: 10};
            const {num1, num2, answer} = generateSubtraction(config);

            expect(num1).toBe(10);
            expect(num2).toBe(10);
            expect(answer).toBe(0);
        });

        it('should handle zero as a valid minimum number', () => {
            // Force num1 to be 0
            vi.spyOn(Math, 'random').mockReturnValue(0);
            const config = {minNum1: 0, maxNum1: 5, minNum2: 0, maxNum2: 5};
            const {num1, num2, answer} = generateSubtraction(config);

            // maxSubtracted = min(0, 5) = 0.
            // num2 = floor(random * (0-0+1)) + 0 = 0.
            expect(num1).toBe(0);
            expect(num2).toBe(0);
            expect(answer).toBe(0);
        });
    });

    // --- Edge Cases ---
    // These tests explore unusual configurations.
    describe('Edge Cases', () => {
        it('should produce a negative answer if minNum2 > maxNum1', () => {
            // This case is deterministic regardless of Math.random.
            const config = {minNum1: 5, maxNum1: 5, minNum2: 6, maxNum2: 10};
            const {num1, num2, answer} = generateSubtraction(config);

            // num1 is 5. maxSubtracted is min(5, 10) = 5.
            // num2 range is (5-6+1)=0. So num2 is always 6.
            expect(num1).toBe(5);
            expect(num2).toBe(6);
            expect(answer).toBe(-1);
        });
    });
});

describe('generateAddition', () => {
    // --- Standard Cases ---
    it('should generate the minimum possible numbers when Math.random returns 0', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);
        const config = {minNum1: 10, maxNum1: 20, minNum2: 5, maxNum2: 15};
        const {num1, num2, answer} = generateAddition(config);

        expect(num1).toBe(10);
        expect(num2).toBe(5);
        expect(answer).toBe(15);
    });

    it('should generate the maximum possible numbers when Math.random is close to 1', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.999999);
        const config = {minNum1: 10, maxNum1: 20, minNum2: 5, maxNum2: 15};
        const {num1, num2, answer} = generateAddition(config);

        expect(num1).toBe(20);
        expect(num2).toBe(15);
        expect(answer).toBe(35);
    });

    // --- Casual Use Cases ---
    it('should correctly add single-digit numbers', () => {
        const config = {minNum1: 8, maxNum1: 8, minNum2: 1, maxNum2: 1};
        const {num1, num2, answer} = generateAddition(config);
        expect(num1).toBe(8);
        expect(num2).toBe(1);
        expect(answer).toBe(9);
    });

    it('should correctly add two-digit numbers', () => {
        const config = {minNum1: 25, maxNum1: 25, minNum2: 75, maxNum2: 75};
        const {num1, num2, answer} = generateAddition(config);
        expect(num1).toBe(25);
        expect(num2).toBe(75);
        expect(answer).toBe(100);
    });

    it('should correctly add two negative numbers', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0); // Selects minimum values
        const config = { minNum1: -20, maxNum1: -10, minNum2: -15, maxNum2: -5 };
        const { num1, num2, answer } = generateAddition(config);

        expect(num1).toBe(-20);
        expect(num2).toBe(-15);
        expect(answer).toBe(-35);
    });

    it('should correctly add a positive and a negative number', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.999999); // Selects maximum values
        const config = { minNum1: 10, maxNum1: 20, minNum2: -15, maxNum2: -5 };
        const { num1, num2, answer } = generateAddition(config);

        expect(num1).toBe(20);
        expect(num2).toBe(-5);
        expect(answer).toBe(15);
    });
});

describe('generateMultiplication', () => {
    // --- Standard Cases ---
    it('should generate the minimum possible factors when Math.random returns 0', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);
        const config = {minNum1: 3, maxNum1: 10, minNum2: 4, maxNum2: 10};
        const {num1, num2, answer} = generateMultiplication(config);

        expect(num1).toBe(3); // factor1
        expect(num2).toBe(4); // factor2
        expect(answer).toBe(12);
    });

    it('should generate the maximum possible factors when Math.random is close to 1', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.999999);
        const config = {minNum1: 3, maxNum1: 10, minNum2: 4, maxNum2: 10};
        const {num1, num2, answer} = generateMultiplication(config);

        expect(num1).toBe(10); // factor1
        expect(num2).toBe(10); // factor2
        expect(answer).toBe(100);
    });

    it('should produce a positive result when multiplying two negative numbers', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0); // Selects minimums
        const config = { minNum1: -10, maxNum1: -5, minNum2: -4, maxNum2: -2 };
        const { num1, num2, answer } = generateMultiplication(config);

        expect(num1).toBe(-10);
        expect(num2).toBe(-4);
        expect(answer).toBe(40);
    });

    it('should produce a negative result when multiplying a positive and a negative number', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.999999); // Selects maximums
        const config = { minNum1: 5, maxNum1: 10, minNum2: -8, maxNum2: -2 };
        const { num1, num2, answer } = generateMultiplication(config);

        expect(num1).toBe(10);
        expect(num2).toBe(-2);
        expect(answer).toBe(-20);
    });

    // --- Boundary Cases ---
    it('should handle multiplication by zero', () => {
        const config = {minNum1: 5, maxNum1: 5, minNum2: 0, maxNum2: 0};
        const {num1, num2, answer} = generateMultiplication(config);
        expect(num1).toBe(5);
        expect(num2).toBe(0);
        expect(answer).toBe(0);
    });
});

describe('generateDivision', () => {
    // --- Standard Cases ---
    it('should generate a valid problem on the first attempt', () => {
        // Mock random to generate divisor=4, then quotient=2
        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0.5) // floor(0.5 * (6-2+1)) + 2 = 4. Divisor is 4.
            .mockReturnValueOnce(0.5); // maxQuotient=floor(20/4)=5. quotient=floor(0.5*5)=2.

        const config = {minNum1: 10, maxNum1: 20, minNum2: 2, maxNum2: 6};
        const {num1, num2, answer} = generateDivision(config);

        expect(num2).toBe(4); // divisor
        expect(answer).toBe(2); // quotient
        expect(num1).toBe(8); // quotient * divisor
    });

    // --- Edge Cases & Loop Behavior ---
    it('should re-generate if the first divisor is 1', () => {
        vi.spyOn(Math, 'random')
            // First attempt:
            .mockReturnValueOnce(0)      // Generates divisor = 1, which causes the loop to repeat.
            .mockReturnValueOnce(0.5)    // This generates quotient = 10. The loop condition (1 >= 1) is met.
            // Second attempt:
            .mockReturnValueOnce(0.5)    // Generates divisor = 3.
            .mockReturnValueOnce(0.4);   // With maxQuotient=6, this generates quotient = floor(0.4*6) = 2.

        const config = {minNum1: 10, maxNum1: 20, minNum2: 1, maxNum2: 5};
        const {num1, num2, answer} = generateDivision(config);

        // The test confirms the final, valid result after the loop
        expect(num2).toBe(3); // divisor
        expect(answer).toBe(2); // quotient
        expect(num1).toBe(6); // quotient * divisor
        expect(Math.random).toHaveBeenCalledTimes(4);
    });

    it('should re-generate if the first quotient is 0 or 1', () => {
        vi.spyOn(Math, 'random')
            // First attempt:
            .mockReturnValueOnce(0.5) // Generates divisor = 4.
            .mockReturnValueOnce(0.1) // With maxQuotient=5, this generates quotient = 0, which causes the loop to repeat.
            // Second attempt:
            .mockReturnValueOnce(0.8) // Generates divisor = 5.
            .mockReturnValueOnce(0.5); // With maxQuotient=4, this generates quotient = 2.

        const config = {minNum1: 10, maxNum1: 20, minNum2: 2, maxNum2: 5};
        const {num1, num2, answer} = generateDivision(config);

        expect(num2).toBe(5); // Final divisor
        expect(answer).toBe(2); // Final quotient
        expect(num1).toBe(10);
        expect(Math.random).toHaveBeenCalledTimes(4);
    });

    // This test now checks that the function throws an error instead of looping infinitely.
    it('should throw an error if a valid problem cannot be generated', () => {
        const config = {minNum1: 5, maxNum1: 5, minNum2: 6, maxNum2: 10};

        // Create a function wrapper to test the throwing behavior.
        const badCall = () => generateDivision(config);

        // Assert that calling the function with these impossible constraints throws the expected error.
        expect(badCall).toThrow("Could not generate a valid division problem with the given constraints.");
    });

    it('should correctly divide when the divisor is negative', () => {
        // This test mocks Math.random to produce a specific, non-trivial result.
        // 1st call to random() generates the divisor.
        // 2nd call to random() generates the quotient.
        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0)      // Will produce divisor = -5.
            .mockReturnValueOnce(0.5);   // With maxQuotient=-10, will produce quotient = -5.

                const config = {minNum1: 10, maxNum1: 50, minNum2: -5, maxNum2: -2};
        const {num1, num2, answer} = generateDivision(config);

        expect(num2).toBe(-5);   // divisor
        expect(answer).toBe(-5); // quotient
        expect(num1).toBe(25);   // quotient * divisor
    })

    it('should correctly divide a negative number by a positive number', () => {
        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0) // divisor = 2
            .mockReturnValueOnce(0.5); // quotient = floor(0.5 * -25) = -13

        // This test requires minNum1 to be passed for negative dividends
        const config = { minNum1: -50, maxNum1: -50, minNum2: 2, maxNum2: 5 };
        const { num1, num2, answer } = generateDivision(config);

        expect(num2).toBe(2);
        expect(answer).toBe(-13);
        expect(num1).toBe(-26);
    });
});