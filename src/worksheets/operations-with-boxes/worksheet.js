import "../style.css"
import "./worksheet.css"
import {getParams} from "../../lib/params.js";
import {generateProblemSet} from "../../lib/arithmetic-problems.js"

function getConfig() {
    const params = getParams(['operations', 'digitsNum1', 'digitsNum2', 'allowNegatives', 'blankPart'])
    return {
        operations: params.operations ? params.operations.split(',') : [],
        digitsNum1: parseInt(params.digitsNum1, 10) || 0,
        digitsNum2: parseInt(params.digitsNum2, 10) || 0,
        allowNegatives: params.allowNegatives && (params.allowNegatives === "true" || parseInt(params.allowNegatives) === 1),
        maxDigits: 3,
        problemCount: 8,
        blankPart: params.blankPart || 'answer'
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
    const worksheetProblem = { ...problem };

    // For all problems except the first one, which serves as an example, blank out a part of the problem.
    if (index > 0) {
        switch (config.blankPart) {
            case 'problem': {
                const parts = ['num1', 'num2'];
                const partToBlank = parts[Math.floor(Math.random() * parts.length)];
                worksheetProblem[partToBlank] = '';
                break;
            }
            case 'operator':
                worksheetProblem.symbol = '';
                break;
            case 'random': {
                const allParts = ['num1', 'num2', 'answer', 'symbol'];
                const randomPartToBlank = allParts[Math.floor(Math.random() * allParts.length)];
                if (randomPartToBlank === 'symbol') {
                    worksheetProblem.symbol = '';
                } else {
                    worksheetProblem[randomPartToBlank] = '';
                }
                break;
            }
            case 'answer':
            default:
                worksheetProblem.answer = '';
                break;
        }
    }

    const problemHTML = createProblemHTML(worksheetProblem);
    const answerHTML = createProblemHTML(problem); // The answer sheet always shows the full problem

    problemsContainer.innerHTML += problemHTML;
    answersContainer.innerHTML += answerHTML;
}
