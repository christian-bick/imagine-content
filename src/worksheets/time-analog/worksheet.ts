import "./worksheet.scss"
import {getParams} from "../../lib/params.ts";
import {generateProblemSet, Problem} from "../../lib/time-problems.ts"

function getConfig() {
    const params = getParams(['interval'])
    return {
        interval: parseFloat(params.interval || '3600'),
        problemCount: 6
    }
}

function formatTime(time: string, interval: number): string {
    const [h, m, s] = time.split(':').map(Number);
    const hour12 = h % 12 || 12;

    if (interval >= 60) {
        return `${hour12}:${String(m).padStart(2, '0')}`;
    }
    return `${hour12}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function createClock(time: string, interval: number): string {
    const [h, m, s] = time.split(':').map(Number);
    const hourAngle = (h % 12 + m / 60) * 30;
    const minuteAngle = (m + s / 60) * 6;
    const secondAngle = s * 6;

    let hourMarks = '';
    for (let i = 0; i < 12; i++) {
        const angle = i * 30;
        const x = 50 + 40 * Math.sin(angle * Math.PI / 180);
        const y = 50 - 40 * Math.cos(angle * Math.PI / 180);
        hourMarks += `<circle cx="${x}" cy="${y}" r="2" fill="#333"/>`;
    }

    let minuteMarks = '';
    for (let i = 0; i < 60; i++) {
        if (i % 5 !== 0) { // Don't draw over hour marks
            const angle = i * 6;
            const x = 50 + 42 * Math.sin(angle * Math.PI / 180);
            const y = 50 - 42 * Math.cos(angle * Math.PI / 180);
            minuteMarks += `<circle cx="${x}" cy="${y}" r="1" fill="#666"/>`;
        }
    }

    const secondHand = interval <= 60 ? `<line class="hand second-hand" x1="50" y1="50" x2="50" y2="10" transform="rotate(${secondAngle} 50 50)"/>` : '';

    return `
        <svg class="clock" viewBox="0 0 100 100">
            <circle class="face" cx="50" cy="50" r="45"/>
            ${hourMarks}
            ${minuteMarks}
            <line class="hand hour-hand" x1="50" y1="50" x2="50" y2="25" transform="rotate(${hourAngle} 50 50)"/>
            <line class="hand minute-hand" x1="50" y1="50" x2="50" y2="15" transform="rotate(${minuteAngle} 50 50)"/>
            ${secondHand}
        </svg>
    `;
}

// --- HTML GENERATION HELPER ---
function createProblemHTML(problem: Problem, showAnswer: boolean, interval: number) {
    const clockHTML = createClock(problem.time, interval);
    const formattedTime = formatTime(problem.time, interval);
    return `
        <div class="problem">
            ${clockHTML}
            <div class="answer-box">${showAnswer ? formattedTime : ''}</div>
        </div>`;
}

const config = getConfig()
const problemSet = generateProblemSet(config)

// --- DOM ELEMENTS ---
const problemsContainer = document.getElementById('problems-container');
const answersContainer = document.getElementById('answers-container');

if (problemsContainer && answersContainer) {
    for (const [index, problem] of problemSet.entries()) {
        // For the first problem, show the answer.
        const showAnswer = index === 0;

        const problemHTML = createProblemHTML(problem, showAnswer, config.interval);
        const answerHTML = createProblemHTML(problem, true, config.interval);

        problemsContainer.innerHTML += problemHTML;
        answersContainer.innerHTML += answerHTML;
    }
}

// Log the generated problems to the console
console.log("Generated Problems:", problemSet);
console.log("Configuration:", config);