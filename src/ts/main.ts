import '../scss/index.scss';
import { tests } from './tests';
import caniuse from 'caniuse-api';

const getBrowserName = () => {
    let browserInfo = navigator.userAgent;
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
      browser = 'firefox'
    } else {
      browser = 'unknown'
    }
      return browser;
}

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



tests.forEach((test) => {
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
