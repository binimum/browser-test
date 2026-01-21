import type { TestResult } from './types';

const runFetchTest = (): TestResult => {
    const hasFetch = typeof fetch === 'function';
    const hasRequest = typeof Request !== 'undefined';
    const hasResponse = typeof Response !== 'undefined';
    const hasHeaders = typeof Headers !== 'undefined';

    if (hasFetch && hasRequest && hasResponse && hasHeaders) {
        return {
            code: 0,
            message: 'Fetch API is fully supported.',
        };
    }

    if (hasFetch) {
        return {
            code: 1,
            message: 'Fetch API is partially supported.',
            details: 'Fetch is available but Request/Response/Headers are missing.',
        };
    }

    return {
        code: 2,
        message: 'Fetch API is not supported.',
    };
};

export default runFetchTest;
