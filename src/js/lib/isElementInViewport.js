// NOTE: Threshold parameter is a value between 0 and 1 representative of the
// percentage of the element that should be in view for it to give a positive result.
export default function isElementInViewport(el) {

    let windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    let rect = el.getBoundingClientRect();
    let midPt = rect.top + .5 * rect.height;
    return {
        inViewport: (rect.top < windowHeight ) ? true : false,
        inViewportCenter: (midPt > windowHeight / 4 && midPt < .75 * windowHeight ) ? true : false,
        nearOneViewport: ( Math.abs(rect.top) < windowHeight * 1 ) ? true : false,
        nearTwoViewport: ( Math.abs(rect.top) < windowHeight * 2 ) ? true : false,
        nearViewport: ( Math.abs(rect.top) < windowHeight * 4 ) ? true : false,

        rect: rect
    };
}