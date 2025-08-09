import "../../style.css"
import "./worksheet.css"
import {getParams} from "../../lib/params.js";
import {generateProblemSet} from "../../lib/arithmetic-problems.js"

function getConfig() {
    const params = getParams(['operations', 'digitsNum1', 'digitsNum2', 'allowNegatives'])
    return {
        operations: params.operations ? params.operations.split(',') : [],
        digitsNum1: Math.min(parseInt(params.digitsNum1, 10) || 2, 6),
        digitsNum2: Math.min(parseInt(params.digitsNum2, 10) || 2, 6),
        allowNegatives: params.allowNegatives && (params.allowNegatives === "true" || parseInt(params.allowNegatives) === 1),
        problemCount: 15
    }
}

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
console.log(config)
const problemSet = generateProblemSet(config)

// --- DOM ELEMENTS ---
const problemsContainer = document.getElementById('problems-container');
const answersContainer = document.getElementById('answers-container');

for (const [index, problem] of problemSet.entries()) {
    // For the first problem (i=0), show the answer. Otherwise, leave it blank.
    const answerForWorksheet = (index === 0) ? problem.answer : '';

    const problemHTML = createProblemHTML({...problem, answer: answerForWorksheet});
    const answerHTML = createProblemHTML({...problem});

    problemsContainer.innerHTML += problemHTML;
    answersContainer.innerHTML += answerHTML;
}