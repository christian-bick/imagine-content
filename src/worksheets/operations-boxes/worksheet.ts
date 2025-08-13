import "./worksheet.scss"
import {getParams} from "../../lib/params.ts";
import {generateProblemSet, Problem} from "../../lib/arithmetic-problems.ts"

function getConfig() {
    const params = getParams(['operations', 'digitsNum1', 'digitsNum2', 'allowNegatives', 'blankPart'])
    return {
        operations: params.operations ? params.operations.split(',') : [],
        digitsNum1: parseInt(params.digitsNum1 || '0', 10),
        digitsNum2: parseInt(params.digitsNum2 || '0', 10),
        allowNegatives: params.allowNegatives === 'true' || params.allowNegatives === '1',
        maxDigits: 3,
        problemCount: 8,
        blankPart: params.blankPart || 'answer'
    }
}

// --- HTML GENERATION HELPER ---
function createProblemHTML(problem: Problem, highlightKey = '') {
    const isHighlighted = (key: string) => key === highlightKey ? 'highlight' : '';

    return `
        <div class="problem">
            <div class="box ${isHighlighted('num1')}">${problem.num1}</div>
            <div class="symbol ${isHighlighted('symbol')}">${problem.symbol}</div>
            <div class="box ${isHighlighted('num2')}">${problem.num2}</div>
            <div class="symbol">=</div>
            <div class="box answer-box ${isHighlighted('answer')}">${problem.answer}</div>
        </div>`;
}

const config = getConfig()
const problemSet = generateProblemSet(config)

// --- DOM ELEMENTS ---
const problemsContainer = document.getElementById('problems-container');
const answersContainer = document.getElementById('answers-container');

if (problemsContainer && answersContainer) {
    for (const [index, problem] of problemSet.entries()) {
        const worksheetProblem: Problem = { ...problem };
        let blankPartKey = '';

        // Determine the blank part
        switch (config.blankPart) {
            case 'problem': {
                const parts = ['num1', 'num2'];
                blankPartKey = parts[Math.floor(Math.random() * parts.length)];
                break;
            }
            case 'problem-answer': {
                const parts = ['num1', 'num2', 'answer'];
                blankPartKey = parts[Math.floor(Math.random() * parts.length)];
                break;
            }
            case 'operator':
                blankPartKey = 'symbol';
                break;
            case 'random': {
                const allParts = ['num1', 'num2', 'answer', 'symbol'];
                blankPartKey = allParts[Math.floor(Math.random() * allParts.length)];
                break;
            }
            case 'answer':
            default:
                blankPartKey = 'answer';
                break;
        }

        // For all problems except the first one, blank out the determined part.
        if (index > 0) {
            if (blankPartKey === 'symbol') {
                worksheetProblem.symbol = '';
            } else {
                (worksheetProblem as any)[blankPartKey] = '';
            }
        }

        const problemHTML = createProblemHTML(worksheetProblem, index === 0 ? blankPartKey : '');
        const answerHTML = createProblemHTML(problem, blankPartKey);

        problemsContainer.innerHTML += problemHTML;
        answersContainer.innerHTML += answerHTML;
    }
}
