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
import runCssGridTest from './tests/css-grid';
import runFetchTest from './tests/fetch';
import runServiceWorkerTest from './tests/service-worker';
import runWebAssemblyTest from './tests/webassembly';
import runWebAudioTest from './tests/web-audio';
import runWebCryptoTest from './tests/web-crypto';
import runWebGl2Test from './tests/webgl2';
import runWebRtcTest from './tests/webrtc';

const tests: BrowserTest[] = [
    {
        name: 'Cookies',
        points: 50,
        run: runCookiesTest,
        spec: {
            title: 'W3C HTML: document.cookie',
            url: 'https://html.spec.whatwg.org/multipage/webstorage.html#dom-document-cookie',
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
    {
        name: 'Web Crypto',
        points: 60,
        run: runWebCryptoTest,
        spec: {
            title: 'W3C Web Crypto API',
            url: 'https://www.w3.org/TR/WebCryptoAPI/',
        },
        caniuseFeature: 'cryptography',
    },
    {
        name: 'Fetch API',
        points: 60,
        run: runFetchTest,
        spec: {
            title: 'Fetch Standard',
            url: 'https://fetch.spec.whatwg.org/',
        },
        caniuseFeature: 'fetch',
    },
    {
        name: 'CSS Grid',
        points: 60,
        run: runCssGridTest,
        spec: {
            title: 'W3C CSS Grid Layout Module',
            url: 'https://www.w3.org/TR/css-grid-1/',
        },
        caniuseFeature: 'css-grid',
    },
    {
        name: 'Service Workers',
        points: 60,
        run: runServiceWorkerTest,
        spec: {
            title: 'W3C Service Workers',
            url: 'https://www.w3.org/TR/service-workers/',
        },
        caniuseFeature: 'serviceworkers',
    },
    {
        name: 'WebAssembly',
        points: 60,
        run: runWebAssemblyTest,
        spec: {
            title: 'W3C WebAssembly Core Specification',
            url: 'https://www.w3.org/TR/wasm-core-1/',
        },
        caniuseFeature: 'wasm',
    },
    {
        name: 'Web Audio',
        points: 50,
        run: runWebAudioTest,
        spec: {
            title: 'W3C Web Audio API',
            url: 'https://www.w3.org/TR/webaudio/',
        },
        caniuseFeature: 'audio-api',
    },
    {
        name: 'WebGL 2',
        points: 50,
        run: runWebGl2Test,
        spec: {
            title: 'Khronos WebGL 2.0',
            url: 'https://www.khronos.org/registry/webgl/specs/latest/2.0/',
        },
        caniuseFeature: 'webgl2',
    },
    {
        name: 'WebRTC',
        points: 60,
        run: runWebRtcTest,
        spec: {
            title: 'W3C WebRTC 1.0',
            url: 'https://www.w3.org/TR/webrtc/',
        },
        caniuseFeature: 'rtcpeerconnection',
    },
];

export { tests };
