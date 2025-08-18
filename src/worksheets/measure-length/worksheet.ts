import "./worksheet.scss";
import { getParams } from "../../lib/params.ts";
import { generateProblemSet, Problem } from "../../lib/measure-problems.ts";

function getConfig() {
    const params = getParams(['bandLength', 'decimal']);
    return {
        bandLength: parseInt(params.bandLength || '20', 10),
        problemCount: 6,
        decimal: params.decimal === 'true',
    };
}

function createMeasureBand(bandLength: number): string {
    let markers = '';
    for (let i = 0; i <= bandLength; i++) {
        // CM markers
        markers += `<line x1="${i * 30}" y1="0" x2="${i * 30}" y2="20" stroke="black" stroke-width="1"/>`;
        markers += `<text x="${i * 30}" y="40" text-anchor="middle" font-size="12">${i}</text>`;

        // MM markers
        if (i < bandLength) {
            for (let j = 1; j < 10; j++) {
                const y2 = (j === 5) ? 14 : 10; // Longer line for 5mm mark
                markers += `<line x1="${i * 30 + j * 3}" y1="0" x2="${i * 30 + j * 3}" y2="${y2}" stroke="black" stroke-width="0.5"/>`;
            }
        }
    }

    return `
        <svg class="measure-band" viewBox="0 0 ${bandLength * 30} 50">
            <rect x="0" y="0" width="${bandLength * 30}" height="20" fill="#f0f0f0" stroke="black" stroke-width="1"/>
            ${markers}
        </svg>
    `;
}

const COLORS = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#6A5ACD', '#DA70D6'];

function createRectangle(length: number, color: string): string {
    const rectHeight = 20;
    const displayLength = length * 30; // Convert cm to pixels for display

    return `
        <svg class="measured-rectangle" viewBox="0 0 ${displayLength} ${rectHeight}">
            <rect x="0" y="0" width="${displayLength}" height="${rectHeight}" fill="${color}"/>
        </svg>
    `;
}

// --- HTML GENERATION ---
function createProblemHTML(problem: Problem, showAnswer: boolean, decimal: boolean, color: string) {
    const measureBandHTML = createMeasureBand(problem.bandLength);
    const rectangleHTML = createRectangle(problem.problemLength, color);
    const answer = decimal ? (problem.problemLength).toFixed(1) : (problem.problemLength * 10).toFixed(0);

    return `
        <div class="problem">
            <div class="measurement-container">
                ${rectangleHTML}
                ${measureBandHTML}
            </div>
            <div class="answer-box">${showAnswer ? answer : ''}</div>
        </div>`;
}

// --- MAIN LOGIC ---
const config = getConfig();
const problemSet = generateProblemSet(config);

const problemsContainer = document.getElementById('problems-container');
const answersContainer = document.getElementById('answers-container');

if (problemsContainer && answersContainer) {
    problemSet.forEach((problem, index) => {
        const color = COLORS[index % COLORS.length];
        const showAnswerForWorksheet = index === 0;
        const problemHTML = createProblemHTML(problem, showAnswerForWorksheet, config.decimal, color);
        const answerHTML = createProblemHTML(problem, true, config.decimal, color);

        problemsContainer.innerHTML += problemHTML;
        answersContainer.innerHTML += answerHTML;
    });
}

console.log("Generated Problems:", problemSet);
console.log("Configuration:", config);
