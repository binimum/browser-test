import type { TestResult } from './types';

const runWebGl2Test = (): TestResult => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');

    if (context) {
        return {
            code: 0,
            message: 'WebGL 2 is supported.',
        };
    }

    return {
        code: 2,
        message: 'WebGL 2 is not supported.',
    };
};

export default runWebGl2Test;
