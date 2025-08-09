// --- PROBLEM GENERATION ---

const operatorList = ['add', 'subtract', 'multiply', 'divide'];
const operatorSymbols = {
    add: '+',
    subtract: '−', // Using minus sign, not hyphen
    multiply: '×',
    divide: '÷'
};

export function generateProblem(op, {maxArg1, maxArg2}) {
    let num1, num2, answer;
    const maxNum1 = Math.pow(10, maxArg1) - 1;
    const minNum1 = Math.pow(10, maxArg1 - 1) || 0;

    const maxNum2 = Math.pow(10, maxArg2) - 1;
    const minNum2 = Math.pow(10, maxArg2 - 1) || 0;

    switch (op) {
        case 'subtract':
            num1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;
            const maxSubtracted = Math.min(num1, maxNum2)
            num2 = Math.floor(Math.random() * maxSubtracted) + 1;
            answer = num1 - num2;
            break;

        case 'multiply':
            const factor1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;
            const factor2 = Math.floor(Math.random() * maxNum2) + 1;
            num1 = factor1;
            num2 = factor2;
            answer = num1 * num2;
            break;

        case 'divide':
            let divisor, quotient;

            do {
                divisor = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;
                const maxQuotient = Math.floor(maxNum1 / divisor);
                quotient = Math.floor(Math.random() * maxQuotient);
            } while (1 >= divisor || 1 >= quotient);
            answer = quotient
            num1 = quotient * divisor
            num2 = divisor
            break;

        case 'add':
        default:
            num1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1)) + minNum1;
            num2 = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;
            answer = num1 + num2;
            break;
    }
    const symbol = operatorSymbols[op];
    return {num1, num2, answer, symbol};
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