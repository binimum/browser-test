import type { TestResult } from './types';

const runBigIntTest = (): TestResult => {
    if (typeof BigInt !== 'undefined' && typeof BigInt(1) === 'bigint') {
        return {
            code: 0,
            message: 'BigInt is supported.',
        };
    }

    return {
        code: 2,
        message: 'BigInt is not supported.',
        details: 'BigInt is missing or does not return the bigint type.',
    };
};

export default runBigIntTest;
