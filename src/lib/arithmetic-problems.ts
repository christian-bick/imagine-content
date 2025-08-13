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
    answer: number;
    symbol?: string;
}

interface SubtractionConfig extends NumberGenerationParams {}

interface DivisionConfig extends NumberGenerationParams {}

interface MultiplicationConfig extends NumberGenerationParams {}

interface AdditionConfig extends NumberGenerationParams {}

interface ProblemSetConfig {
    operations: string[];
    problemCount: number;
    digitsNum1?: number;
    digitsNum2?: number;
    maxDigits?: number;
    allowNegatives?: boolean;
}

interface NumberGenerationParams {
    digitsNum1?: number;
    digitsNum2?: number;
    maxDigits: number;
    allowNegatives: boolean;
}

export function generateSubtraction(params: SubtractionConfig): Problem {
    const { digitsNum1, digitsNum2, maxDigits, allowNegatives } = params;

    const exp1 = digitsNum1 ? Math.min(digitsNum1, maxDigits) : Math.floor(Math.random() * maxDigits) + 1;
    let maxNum1 = Math.pow(10, exp1) - 1;
    let minNum1 = digitsNum1 ? Math.pow(10, exp1 - 1) || 0 : 1;

    if (allowNegatives) {
        const absMaxNum1 = Math.pow(10, exp1) - 1;
        const absMinNum1 = digitsNum1 ? Math.pow(10, exp1 - 1) || 0 : 1;

        minNum1 = -absMaxNum1;
        maxNum1 = absMaxNum1;
    }

    const num1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;

    const exp2 = digitsNum2 ? Math.min(digitsNum2, maxDigits) : Math.floor(Math.random() * maxDigits) + 1;
    let maxNum2 = Math.pow(10, exp2) - 1;
    let minNum2 = digitsNum2 ? Math.pow(10, exp2 - 1) || 0 : 1;

    if (allowNegatives) {
        const absMaxNum2 = Math.pow(10, exp2) - 1;
        const absMinNum2 = digitsNum2 ? Math.pow(10, exp2 - 1) || 0 : 1;

        minNum2 = -absMaxNum2;
        maxNum2 = absMaxNum2;
    }

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

export function generateDivision(params: DivisionConfig): Problem {
    const { digitsNum1, digitsNum2, maxDigits, allowNegatives } = params;

    let divisor, quotient;
    let tries = 0;
    const maxTries = 50;

    // Calculate minNum1, maxNum1 based on digitsNum1
    const exp1 = digitsNum1 ? Math.min(digitsNum1, maxDigits) : Math.floor(Math.random() * maxDigits) + 1;
    let maxNum1 = Math.pow(10, exp1) - 1;
    let minNum1 = digitsNum1 ? Math.pow(10, exp1 - 1) || 0 : 1;

    if (allowNegatives) {
        const absMaxNum1 = Math.pow(10, exp1) - 1;
        const absMinNum1 = digitsNum1 ? Math.pow(10, exp1 - 1) || 0 : 1;

        minNum1 = -absMaxNum1;
        maxNum1 = absMaxNum1;
    }

    // Calculate minNum2, maxNum2 based on digitsNum2
    const exp2 = digitsNum2 ? Math.min(digitsNum2, maxDigits) : Math.floor(Math.random() * maxDigits) + 1;
    let maxNum2 = Math.pow(10, exp2) - 1;
    let minNum2 = digitsNum2 ? Math.pow(10, exp2 - 1) || 0 : 1;

    if (allowNegatives) {
        const absMaxNum2 = Math.pow(10, exp2) - 1;
        const absMinNum2 = digitsNum2 ? Math.pow(10, exp2 - 1) || 0 : 1;

        minNum2 = -absMaxNum2;
        maxNum2 = absMaxNum2;
    }

    // Apply division-specific constraints for num2 (divisor)
    let divMaxNum2 = Math.min(maxNum2, Math.max(Math.pow(10, exp1 - 1), 5));
    let divMinNum2 = Math.min(minNum2, Math.max(Math.pow(10, exp1 - 2), 1));
    if (allowNegatives) {
        divMinNum2 = -divMaxNum2;
    }

    while (tries < maxTries) {
        tries++;

        divisor = Math.floor(Math.random() * (divMaxNum2 - divMinNum2 + 1)) + divMinNum2;
        if (divisor === 0) continue;

        let currentMaxQuotient, currentMinQuotient;

        if (divisor > 0) {
            currentMaxQuotient = Math.floor(maxNum1 / divisor);
            currentMinQuotient = Math.ceil(minNum1 / divisor);
        }
        else { // divisor < 0
            currentMaxQuotient = Math.floor(minNum1 / divisor);
            currentMinQuotient = Math.ceil(maxNum1 / divisor);
        }

        if (currentMaxQuotient < currentMinQuotient) continue;

        quotient = Math.floor(Math.random() * (currentMaxQuotient - currentMinQuotient + 1)) + currentMinQuotient;

        if (divisor > -2 && divisor < 2) continue;
        if (quotient > -2 && quotient < 2) continue;
        break;

    }
    if (tries >= maxTries) {
        throw new Error("Could not generate a valid division problem with the given constraints.");
    }

    return {
        num1: quotient * divisor,
        num2: divisor,
        answer: quotient,
    }
}


export function generateMultiplication(params: MultiplicationConfig): Problem {
    const { digitsNum1, digitsNum2, maxDigits, allowNegatives } = params;

    const exp1 = digitsNum1 ? Math.min(digitsNum1, maxDigits) : Math.floor(Math.random() * maxDigits) + 1;
    let maxNum1 = Math.pow(10, exp1) - 1;
    let minNum1 = digitsNum1 ? Math.pow(10, exp1 - 1) || 0 : 1;

    if (allowNegatives) {
        const absMaxNum1 = Math.pow(10, exp1) - 1;
        const absMinNum1 = digitsNum1 ? Math.pow(10, exp1 - 1) || 0 : 1;

        minNum1 = -absMaxNum1;
        maxNum1 = absMaxNum1;
    }

    const factor1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;

    const exp2 = digitsNum2 ? Math.min(digitsNum2, maxDigits) : Math.floor(Math.random() * maxDigits) + 1;
    let maxNum2 = Math.pow(10, exp2) - 1;
    let minNum2 = digitsNum2 ? Math.pow(10, exp2 - 1) || 0 : 1;

    if (allowNegatives) {
        const absMaxNum2 = Math.pow(10, exp2) - 1;
        const absMinNum2 = digitsNum2 ? Math.pow(10, exp2 - 1) || 0 : 1;

        minNum2 = -absMaxNum2;
        maxNum2 = absMaxNum2;
    }

    const factor2 = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;
    return {
        num1: factor1,
        num2: factor2,
        answer: factor1 * factor2,
    }
}

export function generateAddition(params: AdditionConfig): Problem {
    const { digitsNum1, digitsNum2, maxDigits, allowNegatives } = params;

    const exp1 = digitsNum1 ? Math.min(digitsNum1, maxDigits) : Math.floor(Math.random() * maxDigits) + 1;
    let maxNum1 = Math.pow(10, exp1) - 1;
    let minNum1 = digitsNum1 ? Math.pow(10, exp1 - 1) || 0 : 1;

    if (allowNegatives) {
        const absMaxNum1 = Math.pow(10, exp1) - 1;
        const absMinNum1 = digitsNum1 ? Math.pow(10, exp1 - 1) || 0 : 1;

        minNum1 = -absMaxNum1;
        maxNum1 = absMaxNum1;
    }

    const num1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;

    const exp2 = digitsNum2 ? Math.min(digitsNum2, maxDigits) : Math.floor(Math.random() * maxDigits) + 1;
    let maxNum2 = Math.pow(10, exp2) - 1;
    let minNum2 = digitsNum2 ? Math.pow(10, exp2 - 1) || 0 : 1;

    if (allowNegatives) {
        const absMaxNum2 = Math.pow(10, exp2) - 1;
        const absMinNum2 = digitsNum2 ? Math.pow(10, exp2 - 1) || 0 : 1;

        minNum2 = -absMaxNum2;
        maxNum2 = absMaxNum2;
    }

    const num2 = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;
    return {
        num1,
        num2,
        answer: num1 + num2
    }
}

export function generateProblem(op: string, config: ProblemSetConfig): Problem {

    const { digitsNum1, digitsNum2, maxDigits = 5, allowNegatives = false } = config;

    const numberGenParams = {
        digitsNum1,
        digitsNum2,
        maxDigits,
        allowNegatives,
    };
    let problem: Problem = {} as Problem;

    switch (op) {
        case 'subtract':
            problem = generateSubtraction(numberGenParams)
            break;

        case 'multiply':
            problem = generateMultiplication(numberGenParams)
            break;

        case 'divide':
            problem = generateDivision(numberGenParams)
            break;

        case 'add':
        default:
            problem = generateAddition(numberGenParams)
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