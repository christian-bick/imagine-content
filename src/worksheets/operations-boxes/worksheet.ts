import "./worksheet.scss"
import {getParams} from "../../lib/params.ts";
import {generateProblemSet} from "../../lib/arithmetic-problems.ts"
import {renderContent} from "./renderer.ts";

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

const config = getConfig()
const problemSet = generateProblemSet(config)
renderContent(config, problemSet)
