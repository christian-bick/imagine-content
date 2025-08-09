import "../../style.css"
import "./worksheet.css"
import {getParams} from "../../lib/params.js";
import {generateProblemSet} from "../../lib/arithmetic-problems.js"

function getConfig() {
    const params = getParams(['operator', 'digits'])
    return {
        isMixedMode: !params.operator,
        operator: params.operator || 'add',
        maxDigits: Math.min(parseInt(params.digits, 10) || 2, 6),
        problemCount: 15
    }
}

const operatorName = {
    add: 'Addition',
    subtract: 'Subtraction',
    multiply: 'Multiplication',
    divide: 'Division'
};

// --- HTML GENERATION HELPER ---
function createProblemHTML(problem) {
    return `
        <div class="problem">
            <span class="number">${problem.num1}</span>
            <span class="number">
                <span class="operator">${problem.symbol}</span>${problem.num2}
            </span>
            <div class="line"></div>
            <div class="answer-box">${problem.answer}</div>
        </div>`;
}

const config = getConfig()
const problemSet = generateProblemSet(config)

// --- DOM ELEMENTS ---
const problemsContainer = document.getElementById('problems-container');
const answersContainer = document.getElementById('answers-container');
const headerTitleElements = document.getElementsByClassName('header-title')

// --- SET TITLES ---
headerTitleElements[0].textContent = `Base Operations`;
headerTitleElements[1].textContent = `Base Operations Answers`;

for (const [index, problem] of problemSet.entries()) {
    // For the first problem (i=0), show the answer. Otherwise, leave it blank.
    const answerForWorksheet = (index === 0) ? problem.answer : '';

    const problemHTML = createProblemHTML({...problem, answer: answerForWorksheet});
    const answerHTML = createProblemHTML({...problem});

    problemsContainer.innerHTML += problemHTML;
    answersContainer.innerHTML += answerHTML;
}