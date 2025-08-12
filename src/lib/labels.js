import {Scope} from "edugraph-ts";

export function withNegativesScope(withNegatives) {
    if (withNegatives) {
        return Scope.NumbersWithNegatives
    } else {
        return Scope.NumbersWithoutNegatives
    }
}

export function numScopes(numDigitList) {
    const maxDigits = Math.max(...numDigitList)
    const minDigits = Math.min(...numDigitList)
    return [
        ...minScopes(minDigits),
        ...maxScopes(maxDigits),
    ]
}

export function minScopes(minDigits) {
    switch (minDigits) {
        case 0:
        case 1:
            return []
        case 2:
            return Scope.NumbersLarger10
        case 3:
            return Scope.NumbersLarger100
        default:
            return Scope.NumbersLarger1000
    }
}

export function maxScopes(maxDigits) {
    switch (maxDigits) {
        case 0:
        case 1:
            return Scope.NumbersSmaller10
        case 2:
            return Scope.NumbersSmaller100
        case 3:
            return Scope.NumbersSmaller1000
        default:
            return []
    }
}