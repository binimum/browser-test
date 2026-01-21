import type { TestResult } from './types';

const runCookiesTest = (): TestResult => {
    if (navigator.cookieEnabled) {
        if (document.cookie !== undefined) {
            return {
                code: 0,
                message: 'Cookies are enabled and document.cookie is available.',
            };
        }

        return {
            code: 1,
            message: 'Cookies are enabled, but document.cookie is unavailable.',
            details: 'document.cookie returned undefined despite cookies being enabled.',
        };
    }

    if (navigator.cookieEnabled === undefined) {
        return {
            code: 2,
            message: 'Unable to determine cookie support.',
            details: 'navigator.cookieEnabled is undefined in this environment.',
        };
    }

    if (navigator.cookieEnabled === false) {
        return {
            code: 3,
            message: 'Cookies appear to be disabled in user settings.',
            details: 'navigator.cookieEnabled is false.',
        };
    }

    return {
        code: 4,
        message: 'Unknown cookie support result.',
    };
};

export default runCookiesTest;
