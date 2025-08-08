import "../../style.css"
import "./worksheet.css"

const urlParams = new URLSearchParams(window.location.search);
const specifiedOperator = urlParams.get('operator');
const isMixedMode = !specifiedOperator;
const operator = specifiedOperator || 'add'; // Fallback for single-operator mode
const maxDigits = Math.min(parseInt(urlParams.get('digits'), 10) || 2, 6); // Limit to 6 digits
const problemCount = 15;

const operatorList = ['add', 'subtract', 'multiply', 'divide'];
const operatorSymbols = {
    add: '+',
    subtract: '−', // Using minus sign, not hyphen
    multiply: '×',
    divide: '÷'
};
const operatorName = {
    add: 'Addition',
    subtract: 'Subtraction',
    multiply: 'Multiplication',
    divide: 'Division'
};

// --- DOM ELEMENTS ---
const problemsContainer = document.getElementById('problems-container');
const answersContainer = document.getElementById('answers-container');
const headerTitleElements = document.getElementsByClassName('header-title')

// --- SET TITLES ---
if (isMixedMode) {
    headerTitleElements[0].textContent = 'Mixed Math Practice';
    headerTitleElements[1].textContent = 'Mixed Math Answers';
} else {
    headerTitleElements[0].textContent = `${operatorName[operator]} Practice`;
    headerTitleElements[1].textContent = `${operatorName[operator]} Answers`;
}

// --- PROBLEM GENERATION ---
function generateProblem(op, digits) {
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
    return {num1, num2, answer};
}

// --- HTML GENERATION HELPER ---
function createProblemHTML(problem, symbol, displayedAnswer) {
    return `
        <div class="problem">
            <span class="number">${problem.num1}</span>
            <span class="number">
                <span class="operator">${symbol}</span>${problem.num2}
            </span>
            <div class="line"></div>
            <div class="answer-box">${displayedAnswer}</div>
        </div>`;
}

// --- POPULATE WORKSHEET ---
const existingProblems = new Set();
for (let i = 0; i < problemCount; i++) {
    // If in mixed mode, pick a random operator for each problem
    const currentOperator = isMixedMode ? operatorList[Math.floor(Math.random() * operatorList.length)] : operator;

    let p, problemKey;
    do {
        p = generateProblem(currentOperator, maxDigits);
        // Make the key unique for mixed mode (e.g., "10-5" is different from "10+5")
        problemKey = `${p.num1},${currentOperator},${p.num2}`;
    } while (existingProblems.has(problemKey));
    existingProblems.add(problemKey);

    const symbol = operatorSymbols[currentOperator];

    // For the first problem (i=0), show the answer. Otherwise, leave it blank.
    const answerForWorksheet = (i === 0) ? p.answer : '';

    const problemHTML = createProblemHTML(p, symbol, answerForWorksheet);
    const answerHTML = createProblemHTML(p, symbol, p.answer);

    problemsContainer.innerHTML += problemHTML;
    answersContainer.innerHTML += answerHTML;
}