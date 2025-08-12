import "../style.css"
import "./worksheet.css"
import {getParams} from "../../lib/params.ts";
import {generateProblemSet, Problem} from "../../lib/arithmetic-problems.ts"

function getConfig() {
    const params = getParams(['operations', 'digitsNum1', 'digitsNum2', 'allowNegatives'])
    return {
        operations: params.operations ? params.operations.split(',') : [],
        digitsNum1: parseInt(params.digitsNum1 || '0', 10),
        digitsNum2: parseInt(params.digitsNum2 || '0', 10),
        allowNegatives: params.allowNegatives === 'true' || params.allowNegatives === '1',
        maxDigits: 5,
        problemCount: 15
    }
}

// --- HTML GENERATION HELPER ---
function createProblemHTML(problem: Problem) {
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

if (problemsContainer && answersContainer) {
    for (const [index, problem] of problemSet.entries()) {
        // For the first problem (i=0), show the answer. Otherwise, leave it blank.
        const answerForWorksheet = (index === 0) ? problem.answer : '';

        const problemHTML = createProblemHTML({...problem, answer: answerForWorksheet});
        const answerHTML = createProblemHTML({...problem});

        problemsContainer.innerHTML += problemHTML;
        answersContainer.innerHTML += answerHTML;
    }
}