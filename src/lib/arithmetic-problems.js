// --- PROBLEM GENERATION ---

const operatorList = ['add', 'subtract', 'multiply', 'divide'];
const operatorSymbols = {
    add: '+',
    subtract: '−', // Using minus sign, not hyphen
    multiply: '×',
    divide: '÷'
};
export function generateProblem(op, digits) {
    let num1, num2, answer;
    const maxNum = Math.pow(10, digits) - 1;
    const minNum = Math.pow(10, digits - 1) || 0;

    switch (op) {
        case 'subtract':
            num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
            num2 = Math.floor(Math.random() * num1) + 1; // Ensure num2 <= num1 for non-negative result
            answer = num1 - num2;
            break;

        case 'multiply':
            const factor1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
            const factor2Max = Math.min(maxNum, 9);
            const factor2 = Math.floor(Math.random() * factor2Max) + 1;
            num1 = factor1;
            num2 = factor2;
            answer = num1 * num2;
            break;

        case 'divide':
            const divisorMax = Math.min(maxNum, 9);
            const divisor = Math.floor(Math.random() * (divisorMax - 2)) + 2; // Avoid 0, 1
            const quotientMax = Math.floor(maxNum / divisor);
            const quotient = Math.floor(Math.random() * (quotientMax - 1)) + 1;

            num1 = divisor * quotient; // This is the dividend
            num2 = divisor;
            answer = quotient;
            break;

        case 'add':
        default:
            num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
            num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
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
            problem = generateProblem(currentOperator, config.maxDigits);
            // Make the key unique for mixed mode (e.g., "10-5" is different from "10+5")
            problemKey = `${problem.num1},${currentOperator},${problem.num2}`;
        } while (existingProblemKeys.has(problemKey));
        existingProblemKeys.add(problemKey);
        generatedProblems.push(problem)
    }
    return generatedProblems
}