import type { TestResult } from './types';

const runWebCryptoTest = (): TestResult => {
    if (window.crypto && window.crypto.subtle) {
        if (window.isSecureContext) {
            return {
                code: 0,
                message: 'Web Crypto API is supported in a secure context.',
            };
        }
        return {
            code: 1,
            message: 'Web Crypto API requires a secure context.',
            details: 'window.crypto.subtle is present but this page is not secure.',
        };
    }

    return {
        code: 2,
        message: 'Web Crypto API is not supported.',
    };
};

export default runWebCryptoTest;
