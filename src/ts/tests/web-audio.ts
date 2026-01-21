import type { TestResult } from './types';

const runWebAudioTest = (): TestResult => {
    const AudioContextRef = window.AudioContext ?? window.webkitAudioContext;

    if (AudioContextRef) {
        return {
            code: 0,
            message: 'Web Audio API is supported.',
        };
    }

    return {
        code: 2,
        message: 'Web Audio API is not supported.',
    };
};

export default runWebAudioTest;
