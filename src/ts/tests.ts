/*
TESTS

Tests return 0 if fully supported.
They return 1 if partially supported.
They return 2 if not supported at all.
They return 3 if because of a user setting.
They return 4 if unknown.
*/

import type { BrowserTest } from './tests/types';
import runBigIntTest from './tests/bigint';
import runCookiesTest from './tests/cookies';

const tests: BrowserTest[] = [
    {
        name: 'Cookies',
        points: 50,
        run: runCookiesTest,
        spec: {
            title: 'W3C HTML 5.2: document.cookie',
            url: 'https://www.w3.org/TR/html52/semantics-scripting.html#dom-document-cookie',
        },
        caniuseFeature: 'cookie-store-api',
    },
    {
        name: 'BigInt',
        points: 50,
        run: runBigIntTest,
        spec: {
            title: 'W3C Web IDL: bigint type',
            url: 'https://www.w3.org/TR/WebIDL-1/#idl-bigint',
        },
        caniuseFeature: 'bigint',
    },
];

export { tests };
