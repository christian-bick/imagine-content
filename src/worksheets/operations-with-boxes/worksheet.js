import "../style.css"
import "./worksheet.css"
import {getParams} from "../../lib/params.js";
import {generateProblemSet} from "../../lib/arithmetic-problems.js"

function getConfig() {
    const params = getParams(['operations', 'digitsNum1', 'digitsNum2', 'allowNegatives'])
    return {
        operations: params.operations ? params.operations.split(',') : [],
        digitsNum1: parseInt(params.digitsNum1, 10) || 0,
        digitsNum2: parseInt(params.digitsNum2, 10) || 0,
        allowNegatives: params.allowNegatives && (params.allowNegatives === "true" || parseInt(params.allowNegatives) === 1),
        maxDigits: 3,
        problemCount: 8
    }
}

// --- HTML GENERATION HELPER ---
function createProblemHTML(problem) {
    return `
        <div class="problem">
            <div class="box">${problem.num1}</div>
            <div class="symbol">${problem.symbol}</div>
            <div class="box">${problem.num2}</div>
            <div class="symbol">=</div>
            <div class="box answer-box">${problem.answer}</div>
        </div>`;
}

const config = getConfig()
const problemSet = generateProblemSet(config)

// --- DOM ELEMENTS ---
const problemsContainer = document.getElementById('problems-container');
const answersContainer = document.getElementById('answers-container');

for (const [index, problem] of problemSet.entries()) {
    // For the first problem (i=0), show the answer. Otherwise, leave it blank.al
    const answerForWorksheet = (index === 0) ? problem.answer : '';

    const problemHTML = createProblemHTML({...problem, answer: answerForWorksheet});
    const answerHTML = createProblemHTML({...problem});

    problemsContainer.innerHTML += problemHTML;
    answersContainer.innerHTML += answerHTML;
}
