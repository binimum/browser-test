<script lang="ts">
    import { onMount } from 'svelte';
    import { tests } from '$lib/tests';
    import type { BrowserTest, TestResult } from '$lib/tests/types';
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

    type TestDisplay = {
        test: BrowserTest;
        result: TestResult;
        statusClass: string;
        caniuseMessage: string;
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
        const releaseEntries = Object.entries(releaseDates) as [string, number][];
        const latestRelease = releaseEntries.reduce(
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

        const versions = agentData.versions?.filter((entry): entry is string => Boolean(entry)) ?? [];
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

    const defaultSummary: ScoreBreakdown = {
        totalPoints: 0,
        earnedPoints: 0,
        passed: 0,
        partial: 0,
        failed: 0,
        unknown: 0,
    };

    let userAgent = '';
    let detectedBrowser = '';
    let latestBrowser = '';
    let summary: ScoreBreakdown = { ...defaultSummary };
    let results: TestDisplay[] = [];

    onMount(() => {
        const { browserId, version } = parseUserAgent(navigator.userAgent);

        userAgent = navigator.userAgent;
        latestBrowser = getLatestStableVersion(browserId) ?? 'Unknown';
        detectedBrowser = browserId === 'unknown' ? 'Unknown' : `${browserId} ${version}`;

        const nextSummary: ScoreBreakdown = { ...defaultSummary };
        const nextResults: TestDisplay[] = [];

        tests.forEach((test) => {
            const result = test.run();
            const caniuseStatus = getSupportMessage(test.caniuseFeature, browserId, version);

            nextResults.push({
                test,
                result,
                statusClass: getStatusClass(result),
                caniuseMessage: caniuseStatus.message,
            });

            nextSummary.totalPoints += test.points;
            nextSummary.earnedPoints += scoreTestResult(result, test.points);

            if (result.code === 0) {
                nextSummary.passed += 1;
            } else if (result.code === 1 || result.code === 3) {
                nextSummary.partial += 1;
            } else if (result.code === 2) {
                nextSummary.failed += 1;
            } else {
                nextSummary.unknown += 1;
            }
        });

        summary = nextSummary;
        results = nextResults;
    });
</script>

<svelte:head>
    <title>Does my browser support...</title>
</svelte:head>

<main>
    <h1>Does your browser support...</h1>
    <div class="browser-meta">
        <div><strong>User agent:</strong> <span>{userAgent}</span></div>
        <div><strong>Detected browser:</strong> <span>{detectedBrowser}</span></div>
        <div><strong>Latest stable version:</strong> <span>{latestBrowser}</span></div>
    </div>
    <div id="summary" class="summary">
        <strong>Score:</strong> {summary.earnedPoints} / {summary.totalPoints}
        <span class="separator">•</span>
        <strong>Passed:</strong> {summary.passed}
        <span class="separator">•</span>
        <strong>Partial:</strong> {summary.partial}
        <span class="separator">•</span>
        <strong>Failed:</strong> {summary.failed}
        <span class="separator">•</span>
        <strong>Unknown:</strong> {summary.unknown}
    </div>
    <ul class="tests">
        {#each results as entry (entry.test.name)}
            <li class={entry.statusClass} id={entry.test.name}>
                <div class="test-title">{entry.test.name} - {entry.result.message}</div>
                {#if entry.result.details}
                    <div class="test-details">{entry.result.details}</div>
                {/if}
                <div class="test-meta">
                    <div class="test-meta-item">
                        Spec:
                        <a href={entry.test.spec.url} rel="noreferrer" target="_blank">
                            {entry.test.spec.title}
                        </a>
                    </div>
                    <div class="test-meta-item">{entry.caniuseMessage}</div>
                </div>
            </li>
        {/each}
    </ul>
</main>
