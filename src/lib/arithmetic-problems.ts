// --- PROBLEM GENERATION ---

const operatorList = ['add', 'subtract', 'multiply', 'divide'];
const operatorSymbols: { [key: string]: string } = {
    add: '+',
    subtract: '−', // Using minus sign, not hyphen
    multiply: '×',
    divide: '÷'
};

export interface Problem {
    num1: number;
    num2: number;
    answer: number | string;
    symbol?: string;
}

interface SubtractionConfig {
    minNum1: number;
    maxNum1: number;
    minNum2: number;
    maxNum2: number;
}

interface DivisionConfig {
    minNum1: number;
    maxNum1: number;
    minNum2: number;
    maxNum2: number;
}

interface MultiplicationConfig {
    minNum1: number;
    maxNum1: number;
    minNum2: number;
    maxNum2: number;
}

interface AdditionConfig {
    minNum1: number;
    maxNum1: number;
    minNum2: number;
    maxNum2: number;
}

interface ProblemSetConfig {
    operations: string[];
    problemCount: number;
    digitsNum1?: number;
    digitsNum2?: number;
    maxDigits?: number;
    allowNegatives?: boolean;
}

export function generateSubtraction({minNum1, maxNum1, minNum2, maxNum2}: SubtractionConfig, allowNegatives = false): Problem {
    const num1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;
    let num2;
    if (allowNegatives) {
        num2 = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;
    } else {
        const maxForNum2 = Math.min(num1, maxNum2);
        num2 = Math.floor(Math.random() * (maxForNum2 - minNum2 + 1)) + minNum2;
    }
    const answer = num1 - num2;
    return {num1, num2, answer}
}

export function generateDivision({maxNum1, minNum2, maxNum2}: DivisionConfig): Problem {
    let divisor;
    let quotient = 0; // Initialize quotient to ensure the loop runs correctly
    let tries = 0;
    const maxTries = 50; // Circuit breaker limit

    do {
        if (tries >= maxTries) {
            throw new Error("Could not generate a valid division problem with the given constraints.");
        }

        divisor = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;
        const maxQuotient = Math.floor(maxNum1 / divisor);

        // If a valid quotient (>1) cannot be found with this divisor, try again.
        if (maxQuotient > -2 && maxQuotient < 2) {
            tries++;
            continue;
        }

        quotient = Math.floor(Math.random() * maxQuotient);
        tries++;
    } while (1 >= divisor && divisor >= -1 || 1 >= quotient && quotient >= -1);

    return {
        num1: quotient * divisor,
        num2: divisor,
        answer: quotient,
    }
}


export function generateMultiplication({minNum1, maxNum1, minNum2, maxNum2}: MultiplicationConfig): Problem {
    const factor1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;
    const factor2 = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;
    return {
        num1: factor1,
        num2: factor2,
        answer: factor1 * factor2,
    }
}

export function generateAddition({minNum1, maxNum1, minNum2, maxNum2}: AdditionConfig): Problem {
    const num1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;
    const num2 = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;
    return {
        num1,
        num2,
        answer: num1 + num2
    }
}

export function generateProblem(op: string, {digitsNum1, digitsNum2, maxDigits = 5, allowNegatives = false}: ProblemSetConfig): Problem {

    const exp1 = digitsNum1 ? Math.min(digitsNum1, maxDigits) : Math.floor(Math.random() * maxDigits) + 1
    const maxNum1 = Math.pow(10, exp1) - 1;
    const minNum1 = digitsNum1 ? Math.pow(10, exp1 - 1) || 0 : 1

    const exp2 = digitsNum2 ? Math.min(digitsNum2, maxDigits) : Math.floor(Math.random() * maxDigits) + 1
    const maxNum2 = Math.pow(10, exp2) - 1;
    const minNum2 = digitsNum2 ? Math.pow(10, exp2 - 1) || 0 : 1

    const defaultBoundaries = {
        maxNum1: maxNum1,
        // If negatives are allowed, min is -max, otherwise it's based on digits
        minNum1: allowNegatives ? -maxNum1 : minNum1,

        maxNum2: maxNum2,
        // If negatives are allowed, min is -max, otherwise it's based on digits
        minNum2: allowNegatives ? -maxNum2 : minNum2,
    }
    let problem: Problem = {} as Problem;

    switch (op) {
        case 'subtract':
            problem = generateSubtraction({
                maxNum1: maxNum1,
                minNum1: minNum1,
                maxNum2: allowNegatives ? maxNum2 : Math.min(maxNum2, maxNum1),
                minNum2: allowNegatives ? minNum2 : Math.min(minNum2, minNum1),
            }, allowNegatives)
            break;

        case 'multiply':
            problem = generateMultiplication(defaultBoundaries)
            break;

        case 'divide':
            problem = generateDivision({
                maxNum1: maxNum1,
                minNum1: minNum1,
                maxNum2: Math.min(maxNum2, Math.max(Math.pow(10, exp1 - 1), 5)),
                minNum2: Math.min(minNum2, Math.max(Math.pow(10, exp1 - 2), 1)),
            })
            break;

        case 'add':
        default:
            problem = generateAddition(defaultBoundaries)
            break;
    }
    problem.symbol = operatorSymbols[op];
    return problem;
}

export function getNextOperator(operations: string[]): string {
    if (operations.length === 0) {
        return operatorList[Math.floor(Math.random() * operatorList.length)]
    } else if (operations.length === 1) {
        return operations[0]
    } else {
        return operations[Math.floor(Math.random() * operations.length)]
    }
}

export function generateProblemSet(config: ProblemSetConfig): Problem[] {
    const existingProblemKeys = new Set<string>();
    const generatedProblems: Problem[] = []
    for (let i = 0; i < config.problemCount; i++) {
        // If in mixed mode, pick a random operator for each problem
        const currentOperation = getNextOperator(config.operations);

        let problem: Problem, problemKey: string;
        do {
            problem = generateProblem(currentOperation, config);
            // Make the key unique for mixed mode (e.g., "10-5" is different from "10+5")
            problemKey = `${problem.num1},${currentOperation},${problem.num2}`;
        } while (existingProblemKeys.has(problemKey));
        existingProblemKeys.add(problemKey);
        generatedProblems.push(problem)
    }
    return generatedProblems
}