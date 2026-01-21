import type { TestResult } from './types';

const runServiceWorkerTest = (): TestResult => {
    if ('serviceWorker' in navigator) {
        if (window.isSecureContext) {
            return {
                code: 0,
                message: 'Service Workers are available in a secure context.',
            };
        }
        return {
            code: 1,
            message: 'Service Workers require a secure context.',
            details: 'This page is not running in a secure context.',
        };
    }

    return {
        code: 2,
        message: 'Service Workers are not supported.',
    };
};

export default runServiceWorkerTest;
