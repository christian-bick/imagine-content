import "./worksheet.scss"
import {getParams} from "../../lib/params.ts";
import {generateProblemSet, Problem} from "../../lib/comparison-problems.ts"

function getConfig() {
    const params = getParams(['digits', 'includesZero'])
    return {
        digits: parseInt(params.digits || '1', 10),
        includesZero: params.includesZero === 'true',
        problemCount: 24
    }
}

// --- HTML GENERATION HELPER ---
function createProblemHTML(problem: Problem, showAnswer: boolean) {
    return `
        <div class="problem">
            <span class="number">${problem.num1}</span>
            <span class="answer-box">${showAnswer ? problem.answer : ''}</span>
            <span class="number">${problem.num2}</span>
        </div>`;
}

const config = getConfig()
const problemSet = generateProblemSet(config)

// --- DOM ELEMENTS ---
const problemsContainer = document.getElementById('problems-container');
const answersContainer = document.getElementById('answers-container');

if (problemsContainer && answersContainer) {
    for (const [index, problem] of problemSet.entries()) {
        // For the first two problems, show the answer.
        const showAnswer = index < 2;

        const problemHTML = createProblemHTML(problem, showAnswer);
        const answerHTML = createProblemHTML(problem, true);

        problemsContainer.innerHTML += problemHTML;
        answersContainer.innerHTML += answerHTML;
    }
}

// Log the generated problems to the console
console.log("Generated Problems:", problemSet);
console.log("Configuration:", config);
