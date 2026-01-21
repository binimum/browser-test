import '../scss/index.scss';
import { tests } from './tests';
import type { TestResult } from './tests/types';
import { agents, feature, features } from 'caniuse-lite/dist/unpacker';

type BrowserId = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';

type SupportStatus = 'full' | 'partial' | 'none';

type ScoreBreakdown = {
    totalPoints: number;
    earnedPoints: number;
    passed: number;
    partial: number;
    failed: number;
    unknown: number;
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

const scoreTestResult = (result: TestResult, points: number) => {
    if (result.code === 0) {
        return points;
    }
    if (result.code === 1 || result.code === 3) {
        return Math.round(points * 0.5);
    }
    return 0;
};

const updateSummary = (summary: ScoreBreakdown) => {
    const summaryElement = document.getElementById('summary');
    if (!summaryElement) {
        return;
    }

    summaryElement.innerHTML = `
        <strong>Score:</strong> ${summary.earnedPoints} / ${summary.totalPoints}
        <span class="separator">•</span>
        <strong>Passed:</strong> ${summary.passed}
        <span class="separator">•</span>
        <strong>Partial:</strong> ${summary.partial}
        <span class="separator">•</span>
        <strong>Failed:</strong> ${summary.failed}
        <span class="separator">•</span>
        <strong>Unknown:</strong> ${summary.unknown}
    `;
};

const userAgent = navigator.userAgent;
const { browserId, version } = parseUserAgent(userAgent);
const latestStableVersion = getLatestStableVersion(browserId);

const userAgentElement = document.getElementById('useragent');
if (userAgentElement) {
    userAgentElement.textContent = userAgent;
}

const browserNameElement = document.getElementById('latestBrowser');
if (browserNameElement) {
    browserNameElement.textContent = latestStableVersion ?? 'Unknown';
}

const detectedBrowserElement = document.getElementById('detectedBrowser');
if (detectedBrowserElement) {
    detectedBrowserElement.textContent = browserId === 'unknown' ? 'Unknown' : `${browserId} ${version}`;
}

const summary: ScoreBreakdown = {
    totalPoints: 0,
    earnedPoints: 0,
    passed: 0,
    partial: 0,
    failed: 0,
    unknown: 0,
};

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
    const caniuseStatus = getSupportMessage(test.caniuseFeature, browserId, version);
    caniuseItem.textContent = caniuseStatus.message;

    meta.appendChild(specItem);
    meta.appendChild(caniuseItem);
    element.appendChild(meta);

    document.querySelector('.tests')!.appendChild(element);

    summary.totalPoints += test.points;
    summary.earnedPoints += scoreTestResult(result, test.points);

    if (result.code === 0) {
        summary.passed += 1;
    } else if (result.code === 1 || result.code === 3) {
        summary.partial += 1;
    } else if (result.code === 2) {
        summary.failed += 1;
    } else {
        summary.unknown += 1;
    }
});

updateSummary(summary);
