import type { TestResult } from './types';

const runWebAssemblyTest = (): TestResult => {
    if (typeof WebAssembly === 'object') {
        if (typeof WebAssembly.validate === 'function') {
            return {
                code: 0,
                message: 'WebAssembly is supported.',
            };
        }
        return {
            code: 1,
            message: 'WebAssembly is partially supported.',
            details: 'WebAssembly exists but validation is unavailable.',
        };
    }

    return {
        code: 2,
        message: 'WebAssembly is not supported.',
    };
};

export default runWebAssemblyTest;
