// --- PROBLEM GENERATION ---

const operatorList = ['add', 'subtract', 'multiply', 'divide'];
const operatorSymbols = {
    add: '+',
    subtract: '−', // Using minus sign, not hyphen
    multiply: '×',
    divide: '÷'
};

export function generateSubtraction({minNum1, maxNum1, minNum2, maxNum2}) {
    const num1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;
    const maxSubtracted = Math.min(num1, maxNum2)
    const num2 = Math.floor(Math.random() * (maxSubtracted - minNum2 + 1)) + minNum2;
    const answer = num1 - num2;
    return {num1, num2, answer}
}

export function generateDivision({minNum1, maxNum1, minNum2, maxNum2}) {
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
        if (maxQuotient < 2) {
            tries++;
            continue;
        }

        quotient = Math.floor(Math.random() * maxQuotient);
        tries++;
    } while (1 >= divisor || 1 >= quotient);

    return {
        num1: quotient * divisor,
        num2: divisor,
        answer: quotient,
    }
}


export function generateMultiplication({minNum1, maxNum1, minNum2, maxNum2}) {
    const factor1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;
    const factor2 = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;
    return {
        num1: factor1,
        num2: factor2,
        answer: factor1 * factor2,
    }
}

export function generateAddition({minNum1, maxNum1, minNum2, maxNum2}) {
    const num1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;
    const num2 = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;
    return {
        num1,
        num2,
        answer: num1 + num2
    }
}

export function generateProblem(op, {maxArg1, maxArg2}) {
    const boundaries = {
        maxNum1: Math.pow(10, maxArg1) - 1,
        minNum1: Math.pow(10, maxArg1 - 1) || 0,

        maxNum2: Math.pow(10, maxArg2) - 1,
        minNum2: Math.pow(10, maxArg2 - 1) || 0,
    }

    let problem = {}

    switch (op) {
        case 'subtract':
            problem = generateSubtraction(boundaries)
            break;

        case 'multiply':
            problem = generateMultiplication(boundaries)
            break;

        case 'divide':
            problem = generateDivision(boundaries)
            break;

        case 'add':
        default:
            problem = generateAddition(boundaries)
            break;
    }
    problem.symbol = operatorSymbols[op];
    return problem;
}

export function generateProblemSet(config) {
    const existingProblemKeys = new Set();
    const generatedProblems = []
    for (let i = 0; i < config.problemCount; i++) {
        // If in mixed mode, pick a random operator for each problem
        const currentOperator = config.isMixedMode ? operatorList[Math.floor(Math.random() * operatorList.length)] : config.operator;

        let problem, problemKey;
        do {
            problem = generateProblem(currentOperator, config);
            // Make the key unique for mixed mode (e.g., "10-5" is different from "10+5")
            problemKey = `${problem.num1},${currentOperator},${problem.num2}`;
        } while (existingProblemKeys.has(problemKey));
        existingProblemKeys.add(problemKey);
        generatedProblems.push(problem)
    }
    return generatedProblems
}