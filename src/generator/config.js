// src/generator/config.js
export function getUrls() {
    const baseUrl = 'http://localhost:5173/worksheets/operations-vertical/worksheet.html';
    const combinations = [
        {
            params: {
                operations: 'add,subtract',
                digitsNum1: 2,
                digitsNum2: 2,
                allowNegatives: false
            },
            filename: '2-digit_add_subtract.pdf'
        },
        {
            params: {
                operations: 'multiply',
                digitsNum1: 1,
                digitsNum2: 1
            },
            filename: '1-digit_multiplication.pdf'
        },
        {
            params: {
                operations: 'divide',
                digitsNum1: 2,
                digitsNum2: 1
            },
            filename: '2-by-1-digit_division.pdf'
        }
    ];

    return combinations.map(combo => {
        const urlParams = new URLSearchParams(combo.params);
        return {
            url: `${baseUrl}?${urlParams.toString()}`,
            filename: combo.filename
        };
    });
}
