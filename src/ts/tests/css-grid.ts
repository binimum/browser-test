import type { TestResult } from './types';

const runCssGridTest = (): TestResult => {
    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
        if (CSS.supports('display', 'grid')) {
            return {
                code: 0,
                message: 'CSS Grid is supported.',
            };
        }
        return {
            code: 2,
            message: 'CSS Grid is not supported.',
            details: 'CSS.supports("display", "grid") returned false.',
        };
    }

    return {
        code: 4,
        message: 'Unable to detect CSS Grid support.',
        details: 'CSS.supports API is not available.',
    };
};

export default runCssGridTest;
