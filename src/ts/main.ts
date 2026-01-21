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
import { agents, feature, features } from 'caniuse-lite/dist/unpacker';

type BrowserId = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';
type SupportStatus = 'full' | 'partial' | 'none';

const parseVersionNumber = (value?: string) => {
    if (!value) {
        return 0;
    }
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

const parseUserAgent = (userAgent: string) => {
    let match: RegExpMatchArray | null = null;
    let browserId: BrowserId = 'unknown';

    if ((match = userAgent.match(/Edg\/([\d.]+)/))) {
        browserId = 'edge';
    } else if ((match = userAgent.match(/OPR\/([\d.]+)/))) {
        browserId = 'opera';
    } else if ((match = userAgent.match(/Chrome\/([\d.]+)/))) {
        browserId = 'chrome';
    } else if ((match = userAgent.match(/Firefox\/([\d.]+)/))) {
        browserId = 'firefox';
    } else if ((match = userAgent.match(/Version\/([\d.]+).*Safari/))) {
        browserId = 'safari';
    }

    return {
        browserId,
        version: parseVersionNumber(match?.[1]),
    };
};

const getLatestStableVersion = (browserId: BrowserId) => {
    if (browserId === 'unknown') {
        return null;
    }

    const agentData = agents[browserId];
    if (!agentData) {
        return null;
    }

    const releaseDates = agentData.release_date ?? {};
    const latestRelease = Object.entries(releaseDates).reduce(
        (latest, [version, releaseDate]) => {
            if (releaseDate > latest.releaseDate) {
                return { version, releaseDate };
            }
            return latest;
        },
        { version: '', releaseDate: 0 },
    );

    if (latestRelease.version) {
        return latestRelease.version;
    }

    const versions = agentData.versions?.filter((entry) => entry) ?? [];
    return versions.length > 0 ? versions[versions.length - 1] : null;
};

const getClosestVersionKey = (stats: Record<string, string>, version: number) => {
    const versionKeys = Object.keys(stats)
        .map((key) => ({ key, value: Number.parseFloat(key) }))
        .filter((entry) => !Number.isNaN(entry.value))
        .sort((a, b) => a.value - b.value);

    if (versionKeys.length === 0) {
        return null;
    }

    const match = versionKeys.filter((entry) => entry.value <= version);
    return (match.length > 0 ? match[match.length - 1] : versionKeys[0]).key;
};

const getSupportStatus = (supportText: string): SupportStatus => {
    const flag = supportText.trim().charAt(0);
    if (flag === 'y') {
        return 'full';
    }
    if (flag === 'a') {
        return 'partial';
    }
    return 'none';
};

const getSupportMessage = (featureKey: string, browserId: BrowserId, version: number) => {
    if (browserId === 'unknown') {
        return { status: 'none', message: 'Caniuse: Browser not detected.' };
    }

    const packedFeature = features[featureKey];
    if (!packedFeature) {
        return {
            status: 'none',
            message: `Caniuse: No data available for "${featureKey}".`,
        };
    }

    const unpackedFeature = feature(packedFeature);
    const browserStats = unpackedFeature.stats[browserId];
    if (!browserStats) {
        return {
            status: 'none',
            message: `Caniuse: No support data for ${browserId}.`,
        };
    }

    const versionKey = getClosestVersionKey(browserStats, version);
    if (!versionKey) {
        return {
            status: 'none',
            message: `Caniuse: No version data for ${browserId}.`,
        };
    }

    const supportText = browserStats[versionKey];
    const status = getSupportStatus(supportText);
    const statusLabel =
        status === 'full' ? 'Full support' : status === 'partial' ? 'Partial support' : 'No support';

    return {
        status,
        message: `Caniuse: ${statusLabel} for ${browserId} ${versionKey} (${featureKey}).`,
    };
};

const userAgent = navigator.userAgent;
const { browserId, version } = parseUserAgent(userAgent);
document.getElementById('useragent')!.innerHTML = userAgent;
const latestStableVersion = getLatestStableVersion(browserId);
const browserNameElement = document.getElementById('latestBrowser');
if (browserNameElement) {
    browserNameElement.innerHTML = latestStableVersion ?? 'Unknown';
const getCaniuseStatus = (featureId: string, browserName: string, browserVersion: string | null) => {
    if (!featureId || !browserVersion || browserName === 'unknown') {
        return 'Unknown';
    }

    const supportData = caniuse.getSupport(featureId);
    const browserSupport = supportData[browserName];
    if (browserSupport && browserSupport[browserVersion]) {
        const status = browserSupport[browserVersion];
        if (status.startsWith('y')) {
            return 'Supported';
        }
        if (status.startsWith('a')) {
            return 'Partial';
        }
        if (status.startsWith('n')) {
            return 'Unsupported';
        }
        return 'Unknown';
    }

    return caniuse.isSupported(featureId, `${browserName} ${browserVersion}`) ? 'Supported' : 'Unsupported';
}

var useragent = navigator.userAgent;
document.getElementById('useragent')!.innerHTML = useragent;
var latestStableBrowsers = caniuse.getLatestStableBrowsers();
const browserName = getBrowserName();
const latestStableBrowser = latestStableBrowsers.find((browser) => browser.startsWith(`${browserName} `)) ?? null;
const latestStableVersion = latestStableBrowser ? latestStableBrowser.split(' ')[1] : null;
const browserNameElement = document.getElementById("latestBrowser");
if (browserNameElement) {
    browserNameElement.innerHTML = latestStableVersion ?? 'unknown';
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
    fetch(test.test).then((response) => {
        return response.text()
    })
    .then((text) => {
        console.log(text);
        let result_text = Function("const to_ret =  " + text.replace("function main()", "() =>") + "\nreturn to_ret();")();

        console.log(result_text);
        let result = result_text[0];

        let element = document.createElement('li');
        element.id = test.name;

        if (result === 0) {
            element.classList.add('passed');
        }
        else if (result === 1) {
            element.classList.add('partial');
        }
        else if (result === 2) {
            element.classList.add('failed');
        }
        else if (result === 3) {
            element.classList.add('partial');
        }
        else {
            element.classList.add('unknown');
        }

        const caniuseComparison = test.caniuseFeature
            ? getSupportMessage(test.caniuseFeature, browserId, version)
            : { status: 'none', message: 'Caniuse: No feature mapping available.' };

        element.innerHTML = `${test.name} - ${result_text[1]}<br /><small>${caniuseComparison.message}</small>`;
        const caniuseStatus = getCaniuseStatus(test.featureId, browserName, latestStableVersion);
        const specLink = test.specUrl ? `<a href="${test.specUrl}" target="_blank" rel="noreferrer">Spec</a>` : 'Spec: N/A';
        const wptLink = test.wptRef ? `<a href="https://wpt.fyi/results/${test.wptRef}" target="_blank" rel="noreferrer">WPT</a>` : 'WPT: N/A';

        element.innerHTML = `
            <div class="test-name">${test.name} - ${result_text[1]}</div>
            <div class="test-meta">
                ${specLink}
                <span class="separator">|</span>
                ${wptLink}
                <span class="separator">|</span>
                <span class="caniuse-status">Can I use: ${caniuseStatus}</span>
            </div>
        `;

        document.querySelector('.tests')!.appendChild(element);
    })
    .catch((error) => {
        console.error(error);
    });
});
