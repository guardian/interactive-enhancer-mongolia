const MOBILE_THRESHOLD = 460;
const TABLET_THRESHOLD = 980;

export function isMobile() {
    return (document.body.clientWidth < MOBILE_THRESHOLD);
}

export function isTablet() {
    return (document.body.clientWidth < TABLET_THRESHOLD);
}

export function isHandheld() {
    return (isMobile() || isTablet());
}

export function isCapable(isHandheld, bandwidth) {
    return (!isHandheld && bandwidth >= 2048);
}