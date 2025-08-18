import "./worksheet.scss";
import { getParams } from "../../lib/params.ts";

// --- CONFIGURATION ---
function getConfig() {
    const params = getParams(['order']);
    return {
        order: params.order || 'default',
        boxesPerRow: 5,
    };
}

// --- HTML GENERATION ---
function createProblemRowHTML(number: number, numBoxes: number, isFirstRow: boolean) {
    const boxesHTML = Array.from({ length: numBoxes }, (_, i) => {
        const isFirstBox = isFirstRow && i === 0;
        const boxClass = isFirstBox ? 'writing-box example' : 'writing-box';
        return `<div class="${boxClass}">${number}</div>`;
    }).join('');

    const tenFrameHTML = `
        <div class="ten-frame">
            ${Array.from({ length: 10 }, (_, i) => {
                const isFilled = isFirstRow && i < number;
                const boxClass = isFilled ? 'ten-frame-box filled' : 'ten-frame-box';
                return `<div class="${boxClass}"></div>`;
            }).join('')}
        </div>`;

    return `
        <div class="problem-row">
            <div class="number-label">${number}</div>
            <div class="writing-boxes">${boxesHTML}</div>
            ${tenFrameHTML}
        </div>`;
}

// --- MAIN LOGIC ---
const config = getConfig();
const problemsContainer = document.getElementById('problems-container');

if (problemsContainer) {
    let numbers = Array.from({ length: 9 }, (_, i) => i + 1);
    if (config.order === 'random') {
        numbers = numbers.sort(() => Math.random() - 0.5);
    }

    numbers.forEach((number, index) => {
        const isFirstRow = index === 0;
        const problemRowHTML = createProblemRowHTML(number, config.boxesPerRow, isFirstRow);
        problemsContainer.innerHTML += problemRowHTML;
    });
}
