import reqwest from 'reqwest';

const SMALL_FILE_URL = 'https://cdn.theguardian.tv/interactive/speedtest/testfilesmall.dat';
const LARGE_FILE_URL =  'https://cdn.theguardian.tv/interactive/speedtest/testfile.dat';
const SMALL_FILE_SIZE = 1024 * 8;
const LARGE_FILE_SIZE = 102400 * 8;
const FILE_SIZE_DELTA = LARGE_FILE_SIZE - SMALL_FILE_SIZE;
const TIMEOUT_DURATION = 5000;
const DEFAULT_BANDWIDTH = 0;

function timedFileLoad(url) {
    let startTime = Date.now();

    url = `${ url }?bust=${ startTime }`;

    return reqwest(url).then(() => {
        let finishTime = Date.now();
        let loadTime = (finishTime - startTime) / 1000;

        return loadTime;
    });
}

export default function getBandwidth() {
    return new Promise(function (resolve) {
        let timeout = setTimeout(() => resolve(DEFAULT_BANDWIDTH), TIMEOUT_DURATION);

        Promise.all([
            timedFileLoad(SMALL_FILE_URL),
            timedFileLoad(LARGE_FILE_URL)
        ]).then((results) => {
            let [loadTimeSmall, loadTimeLarge] = results;
            let loadTimeDelta = Math.max(loadTimeLarge - loadTimeSmall, 0.01);
            let rate = FILE_SIZE_DELTA / loadTimeDelta;
            let ratekbps = Math.round(rate / 1024);

            ratekbps = Math.min(ratekbps, 10000);
            ratekbps = Math.max(ratekbps, 100);

            resolve(ratekbps);

            clearTimeout(timeout);
        }).catch(() => {
            resolve(DEFAULT_BANDWIDTH);

            clearTimeout(timeout);
        });
    });
}