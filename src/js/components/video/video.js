import videoHTML from './video.html!text';
import videoFallbackHTML from './fallback.html!text';
import isElementInViewport from '../../lib/isElementInViewport'
import {isMobile, isTablet, isDesktop, isCapable} from '../../lib/browser'
import {getVideoURLS} from './videoUtils'

function player(el, ref, data, bitRate){
	let module = {
		el: el,
		data: data,
		bitRate: bitRate,
		assetType: 'video'
	};
	let isLoaded = false;
	let isPlaying = false;
	let player = undefined;
	let isMobileState = isMobile();

	function init(){
			
		player = module.el.querySelector('video');

		if( !isMobileState ){
			el.innerHTML = videoHTML;
			player = el.querySelector('video');
		}
		
	}

	function loadSource(){
		isLoaded = true;
		let videoURLs = getVideoURLS(module.data.src, module.bitRate);

		Object.keys(videoURLs).forEach(function(key) {
			var sourceEl = document.createElement('source');
			sourceEl.setAttribute('type', key);
			sourceEl.setAttribute('src', videoURLs[key]);
			player.appendChild(sourceEl);
		});

		player.removeAttribute('src');
		player.load();
	}

	function unloadSource(){
		var sources = player.getElementsByTagName('source');
		
		while(sources.length > 0){
			sources[0].parentNode.removeChild(sources[0]);
		}

		player.src = "";
		isPlaying = false;
		isLoaded = false;
	}

	function playVideo(){
		isPlaying = true;
		player.play();
	}

	function pauseVideo(){
		isPlaying = false;
		player.pause();
	}


	module.updateState = function(){

		var position = isElementInViewport(el);
		
		if( !isMobileState ){
			//deal with setupting up and destrying player
			if (position.nearViewport ){
				
					if( !isLoaded ){
						loadSource();
					} 

					if(position.inViewportCenter && !isPlaying){
						playVideo();
					} else if(!position.inViewportCenter && isPlaying){
						pauseVideo();
					}

			} else if( !position.nearViewport && isLoaded){
				pauseVideo();
				unloadSource();
			}



		} else if (position.nearTwoViewport && !isLoaded){
				isLoaded = true;
				let layout = videoFallbackHTML.replace('{{imgsrc}}', data.fallback);
				module.el.innerHTML = layout;
		
		}
		


	}

	module.setBitRate = function(newRate){
		module.bitRate = newRate;
		unloadSource();
		loadSource();
	}



	init();

	return module;
}






export default player;