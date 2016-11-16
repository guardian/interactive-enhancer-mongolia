import {isMobile, isTablet, isDesktop, isCapable} from '../../lib/browser'
import isElementInViewport from '../../lib/isElementInViewport'

export default function iframe(el, ref, data) {
    //console.log(el, ref)
    let module = {
        el: el,
        loaded: false,
        data: data,
        assetType: 'iframe'
    };



    module.updateState = function(){

        if(!module.loaded){
            var position = isElementInViewport(el);
            if (position.nearViewport){
                init();
            }
        }
    }

    function init(){
        module.loaded = true;
        boot(module.el, module.data.src, module.data)

    }

    return module;
}

function boot (el, link, data) {
    // Extract href of the first link in the content, if any
    var containerDiv = document.createElement('div')
        containerDiv.className = 'gv-iframe';
    el.appendChild(containerDiv);

    
    



    var iframe;

    function _postMessage(message) {
        iframe.contentWindow.postMessage(JSON.stringify(message), '*');
    }

    if (link) {
        iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.border = 'none';
        iframe.height = '500'; // default height
        iframe.src = link;

        // Listen for requests from the window
        window.addEventListener('message', function(event) {
            if (event.source !== iframe.contentWindow) {
                return;
            }

            // IE 8 + 9 only support strings
            var message = JSON.parse(event.data);

            // Actions
            switch (message.type) {
                case 'set-height':
                    iframe.height = message.value;
                    break;
                case 'navigate':
                    document.location.href = message.value;
                    break;
                case 'scroll-to':
                    window.scrollTo(message.x, message.y);
                    break;
                case 'get-location':
                    _postMessage({
                        'id':       message.id,
                        'type':     message.type,
                        'hash':     window.location.hash,
                        'host':     window.location.host,
                        'hostname': window.location.hostname,
                        'href':     window.location.href,
                        'origin':   window.location.origin,
                        'pathname': window.location.pathname,
                        'port':     window.location.port,
                        'protocol': window.location.protocol,
                        'search':   window.location.search
                    }, message.id);
                    break;
                case 'get-position':
                    _postMessage({
                        'id':           message.id,
                        'type':         message.type,
                        'iframeTop':    iframe.getBoundingClientRect().top,
                        'innerHeight':  window.innerHeight,
                        'innerWidth':   window.innerWidth,
                        'pageYOffset':  window.pageYOffset
                    });
                    break;
                case 'embed-size':
                    break;
                default:
                   console.error('Received unknown action from iframe: ', message);
            }
        }, false);

        // Replace link with iframe
        // Note: link is assumed to be a direct child
        containerDiv.appendChild(iframe);

        if('credit' in data){
            var credit = document.createElement('div');
                credit.className ='gv-credit';
                credit.innerHTML = data.credit;
            containerDiv.appendChild(credit);
        }
    }
}


