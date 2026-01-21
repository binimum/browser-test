import '../scss/index.scss';
import { tests } from './tests';
import type { TestResult } from './tests/types';
import caniuse from 'caniuse-api';

const getBrowserName = () => {
    const browserInfo = navigator.userAgent;
    let browser;
    if (browserInfo.includes('Opera') || browserInfo.includes('Opr')) {
        browser = 'opera';
    } else if (browserInfo.includes('Edg')) {
        browser = 'edge';
    } else if (browserInfo.includes('Chrome')) {
        browser = 'chrome';
    } else if (browserInfo.includes('Safari')) {
        browser = 'safari';
    } else if (browserInfo.includes('Firefox')) {
        browser = 'firefox';
    } else {
        browser = 'unknown';
    }
    return browser;
};

const getStatusClass = (result: TestResult) => {
    if (result.code === 0) {
        return 'passed';
    }
    if (result.code === 1 || result.code === 3) {
        return 'partial';
    }
    if (result.code === 2) {
        return 'failed';
    }
    return 'unknown';
};

const getCaniuseStatus = (feature: string, browserQuery: string | null) => {
    if (!browserQuery || browserQuery === 'unknown') {
        return 'Unknown';
    }

    try {
        return caniuse.isSupported(feature, browserQuery) ? 'Supported' : 'Not supported';
    } catch (error) {
        console.error(error);
        return 'Unknown';
    }
};

const browserName = getBrowserName();
const useragent = navigator.userAgent;
const latestStableBrowsers = caniuse.getLatestStableBrowsers();
const browserEntry = latestStableBrowsers.find((browser) => browser.startsWith(`${browserName} `)) ?? null;
const browserVersion = browserEntry ? browserEntry.split(' ')[1] : 'unknown';
const browserQuery = browserEntry ? `${browserName} ${browserVersion}` : null;

const userAgentElement = document.getElementById('useragent');
if (userAgentElement) {
    userAgentElement.textContent = useragent;
}

const browserNameElement = document.getElementById('latestBrowser');
if (browserNameElement) {
    browserNameElement.textContent = browserVersion;
}

tests.forEach((test) => {
    const result = test.run();
    const element = document.createElement('li');
    element.id = test.name;
    element.classList.add(getStatusClass(result));

    const title = document.createElement('div');
    title.classList.add('test-title');
    title.textContent = `${test.name} - ${result.message}`;
    element.appendChild(title);

    if (result.details) {
        const details = document.createElement('div');
        details.classList.add('test-details');
        details.textContent = result.details;
        element.appendChild(details);
    }

    const meta = document.createElement('div');
    meta.classList.add('test-meta');

    const specItem = document.createElement('div');
    specItem.classList.add('test-meta-item');
    specItem.append('Spec: ');

    const specLink = document.createElement('a');
    specLink.href = test.spec.url;
    specLink.textContent = test.spec.title;
    specLink.rel = 'noreferrer';
    specLink.target = '_blank';
    specItem.appendChild(specLink);

    const caniuseItem = document.createElement('div');
    caniuseItem.classList.add('test-meta-item');
    const caniuseStatus = getCaniuseStatus(test.caniuseFeature, browserQuery);
    caniuseItem.textContent = `Can I use (${test.caniuseFeature}) for ${browserQuery ?? 'unknown'}: ${caniuseStatus}`;

    meta.appendChild(specItem);
    meta.appendChild(caniuseItem);
    element.appendChild(meta);

    document.querySelector('.tests')!.appendChild(element);
});
