import {
    generateAddition,
    generateSubtraction,
    generateMultiplication,
    generateDivision
} from './single-digit-problems.ts';
import {describe, it, expect} from 'vitest';

describe('generateAddition', () => {
    it('should generate a problem with carry and no zero', () => {
        for (let i = 0; i < 100; i++) {
            const {num1, num2, answer} = generateAddition(true, false);
            expect(answer).toBeGreaterThanOrEqual(10);
            expect(num1).not.toBe(0);
            expect(num2).not.toBe(0);
            expect(answer).not.toBe(0);
        }
    });

    it('should generate a problem with no carry and no zero', () => {
        for (let i = 0; i < 100; i++) {
            const {num1, num2, answer} = generateAddition(false, false);
            expect(answer).toBeLessThan(10);
            expect(num1).not.toBe(0);
            expect(num2).not.toBe(0);
        }
    });

    it('should generate a problem with no carry and with zero', () => {
        for (let i = 0; i < 100; i++) {
            const {num1, num2, answer} = generateAddition(false, true);
            expect(answer).toBeLessThan(10);
            expect(num1 === 0 || num2 === 0 || answer === 0).toBe(true);
        }
    });
});

describe('generateSubtraction', () => {
    it('should generate a problem with borrow (carry) and no zero', () => {
        for (let i = 0; i < 100; i++) {
            const {num1, num2} = generateSubtraction(true, false, true);
            expect(num1).toBeLessThan(num2);
            expect(num1).not.toBe(0);
            expect(num2).not.toBe(0);
        }
    });

    it('should generate a problem with no borrow (carry) and no zero', () => {
        for (let i = 0; i < 100; i++) {
            const {num1, num2} = generateSubtraction(false, false, false);
            expect(num1).toBeGreaterThanOrEqual(num2);
            expect(num1).not.toBe(0);
            expect(num2).not.toBe(0);
        }
    });

    it('should generate a problem with no borrow (carry) and with zero', () => {
        for (let i = 0; i < 100; i++) {
            const {num1, num2, answer} = generateSubtraction(false, true, false);
            expect(num1).toBeGreaterThanOrEqual(num2);
            expect(num1 === 0 || num2 === 0 || answer === 0).toBe(true);
        }
    });
});

describe('generateMultiplication', () => {
    it('should generate a problem with carry and no zero', () => {
        for (let i = 0; i < 100; i++) {
            const {num1, num2, answer} = generateMultiplication(true, false);
            expect(answer).toBeGreaterThanOrEqual(10);
            expect(num1).not.toBe(0);
            expect(num2).not.toBe(0);
            expect(answer).not.toBe(0);
        }
    });

    it('should generate a problem with no carry and no zero', () => {
        for (let i = 0; i < 100; i++) {
            const {num1, num2, answer} = generateMultiplication(false, false);
            expect(answer).toBeLessThan(10);
            expect(num1).not.toBe(0);
            expect(num2).not.toBe(0);
        }
    });

    it('should generate a problem with no carry and with zero', () => {
        for (let i = 0; i < 100; i++) {
            const {num1, num2, answer} = generateMultiplication(false, true);
            expect(answer).toBeLessThan(10);
            expect(num1 === 0 || num2 === 0 || answer === 0).toBe(true);
        }
    });
});

describe('generateDivision', () => {
    it('should generate a division problem with carry (dividend >= 10)', () => {
        for (let i = 0; i < 100; i++) {
            const {num1, num2, answer} = generateDivision(true);
            expect(num1 / num2).toBe(answer);
            expect(num1).toBeGreaterThanOrEqual(10);
            expect(num2).toBeGreaterThan(0);
            expect(answer).toBeGreaterThan(0);
        }
    });

    it('should generate a division problem with no carry (dividend < 10)', () => {
        for (let i = 0; i < 100; i++) {
            const {num1, num2, answer} = generateDivision(false);
            expect(num1 / num2).toBe(answer);
            expect(num1).toBeLessThan(10);
            expect(num1).toBeGreaterThan(0);
            expect(num2).toBeGreaterThan(0);
            expect(answer).toBeGreaterThan(0);
        }
    });
});
