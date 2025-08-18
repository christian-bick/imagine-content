import "./worksheet.scss";
import { getParams } from "../../lib/params.ts";
import { generateProblemSet, Problem } from "../../lib/measure-problems.ts";

function getConfig() {
    const params = getParams(['bandLength']);
    return {
        bandLength: parseInt(params.bandLength || '20', 10),
        problemCount: 6,
    };
}

function createMeasureBand(bandLength: number): string {
    let markers = '';
    for (let i = 0; i <= bandLength; i++) {
        // CM markers
        markers += `<line x1="${i * 20}" y1="0" x2="${i * 20}" y2="20" stroke="black" stroke-width="1"/>`;
        markers += `<text x="${i * 20}" y="40" text-anchor="middle" font-size="12">${i}</text>`;

        // MM markers
        if (i < bandLength) {
            for (let j = 1; j < 10; j++) {
                const y2 = (j === 5) ? 14 : 10; // Longer line for 5mm mark
                markers += `<line x1="${i * 20 + j * 2}" y1="0" x2="${i * 20 + j * 2}" y2="${y2}" stroke="black" stroke-width="0.5"/>`;
            }
        }
    }

    return `
        <svg class="measure-band" viewBox="0 0 ${bandLength * 20} 50">
            <rect x="0" y="0" width="${bandLength * 20}" height="20" fill="#f0f0f0" stroke="black" stroke-width="1"/>
            ${markers}
        </svg>
    `;
}

function createPencil(pencilLength: number, bandLength: number): string {
    const pencilWidth = 10; // Fixed width for the pencil
    const displayLength = pencilLength * 20; // Convert cm to pixels for display

    return `
        <svg class="pencil" viewBox="0 0 ${displayLength}">
            <rect x="0" y="5" width="${displayLength}" height="${pencilWidth}" fill="#000000"/>
        </svg>
    `;
}

// --- HTML GENERATION ---
function createProblemHTML(problem: Problem, showAnswer: boolean) {
    const measureBandHTML = createMeasureBand(problem.bandLength);
    const pencilHTML = createPencil(problem.problemLength, problem.bandLength);
    const answer = (problem.problemLength * 10).toFixed(0); // Answer in mm

    return `
        <div class="problem">
            <div class="measurement-container">
                ${pencilHTML}
                ${measureBandHTML}
            </div>
            <div class="answer-box">${showAnswer ? answer + ' mm' : ''}</div>
        </div>`;
}

// --- MAIN LOGIC ---
const config = getConfig();
const problemSet = generateProblemSet(config);

const problemsContainer = document.getElementById('problems-container');
const answersContainer = document.getElementById('answers-container');

if (problemsContainer && answersContainer) {
    problemSet.forEach((problem, index) => {
        const showAnswerForWorksheet = index === 0;
        const problemHTML = createProblemHTML(problem, showAnswerForWorksheet);
        const answerHTML = createProblemHTML(problem, true);

        problemsContainer.innerHTML += problemHTML;
        answersContainer.innerHTML += answerHTML;
    });
}

console.log("Generated Problems:", problemSet);
console.log("Configuration:", config);
