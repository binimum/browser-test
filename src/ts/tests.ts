/*
TESTS

Tests return 0 if fully supported.
They return 1 if partially supported.
They return 2 if not supported at all.
They return 3 if because of a user setting.
They return 4 if unknown.
*/

const tests = [
    {
        name: "Cookies",
        test: "/tests/cookies.js",
        points: 50,
        caniuseFeature: "cookie-store-api",
        featureId: "cookies",
        specUrl: "https://www.rfc-editor.org/rfc/rfc6265",
        wptRef: "cookies/",
    },
    {
        name: "BigInt",
        test: "/tests/bigint.js",
        points: 50,
        caniuseFeature: "bigint",
    }
        featureId: "bigint",
        specUrl: "https://tc39.es/ecma262/#sec-bigint-objects",
        wptRef: "js/bigint/",
    },
    {
        name: "Web Crypto",
        test: "/tests/web-crypto.js",
        points: 60,
        featureId: "cryptography",
        specUrl: "https://www.w3.org/TR/WebCryptoAPI/",
        wptRef: "WebCryptoAPI/",
    },
    {
        name: "Fetch API",
        test: "/tests/fetch.js",
        points: 60,
        featureId: "fetch",
        specUrl: "https://fetch.spec.whatwg.org/",
        wptRef: "fetch/api/",
    },
    {
        name: "CSS Grid",
        test: "/tests/css-grid.js",
        points: 60,
        featureId: "css-grid",
        specUrl: "https://www.w3.org/TR/css-grid-1/",
        wptRef: "css/css-grid/",
    },
    {
        name: "Service Workers",
        test: "/tests/service-workers.js",
        points: 60,
        featureId: "serviceworkers",
        specUrl: "https://www.w3.org/TR/service-workers/",
        wptRef: "service-workers/",
    },
]

export { tests };
