import reqwest from 'reqwest'
import debounce from '../../lib/debounce'
import getBandwidth from '../../lib/bandwidth'
import {isMobile, isTablet, isDesktop, isCapable} from '../../lib/browser'
import Video from '../video/video'
import PhotoGrid from '../photogrid/photogrid'
import Iframe from '../iframe/iframeLoader'
import Divider from '../divider/divider'

var visualsAssetManager =  (function (module) {

	if(module){
		return module;
	} else {
		module = window.visualsAssetManager = {}
	}

	let	assetQueue = [],
		toLoad = [],
		data,
		isLoaded = false,
		display = 'mobile',
		bitRate = '2M';


	// module.createVideo = function(el, params){
	// 	assetQueue.push( new video(el, params) );
	// }

	function manageAssets(){
		assetQueue.forEach(function(asset){
			asset.updateState();
		})
	}

	function initAsset(el){
		if( !isLoaded ){
			toLoad.push(el);
		} else {
			//queue up the assets
			let ref = el.getAttribute('data-alt').split('-');
			let type = ref[0];
			let id = ref[1];

			if(type == 'photogrid'){
				assetQueue.push( new PhotoGrid(el, ref, data.blocks[type + '-' + id]) );
			} else if(type == 'video'){
				console.log(bitRate)
				assetQueue.push( new Video(el, ref, data.blocks[type + '-' + id], bitRate) );
			} else if(type == 'iframe'){
				assetQueue.push( new Iframe(el, ref, data.blocks[type + '-' + id]) );
			} else if(type == 'divider'){
				assetQueue.push( new Divider(el, id) );
			}
		}	
	}

	function init(resp){

		data = {
			blocks: {}
		};
		resp.blocks.forEach(function(b){
			data.blocks[b.block] = b;
		})

		isLoaded = true;
		toLoad.forEach(function(f){
			initAsset(f);
		})

		wrangleDividers();

		//add event listener for window scroll
		window.addEventListener('scroll', debounce(manageAssets, 50) , false);

		//initialize assets currently in view
		manageAssets();

		//determine bitrate - does this last bc for desktop only
		if( !isMobile() ){
			getBandwidth().then(setBitRate)
		}
	}

	function wrangleDividers(){

		var h2s = document.querySelectorAll('h2');

		[].forEach.call(h2s, function(element){

			if(element.innerHTML === '***'){

				var divider = document.createElement('div');
				divider.className = 'gv-section-divider';

				console.log(element.nextSibling)
				
				element.nextSibling.className += 'gv-new-section';
				element.parentNode.insertBefore(divider, element.nextSibling);
				element.parentNode.removeChild(element);


			}


		})


	}


	function setBitRate(kbps){

		if (kbps >= 4068) { bitRate = '4M'; }
		if (kbps < 4068) { bitRate  = '2M'; }
		if (kbps < 2048) { bitRate  = '768k'; }
		if (kbps < 1024) { bitRate  = '488k'; }
		if (kbps < 512)  { bitRate  = '220k'; }

		assetQueue.forEach(function(a){
			if(a.assetType == 'video'){
				a.setBitRate(bitRate);
			}
		})
	}


	reqwest({
        url: 'https://interactive.guim.co.uk/docsdata-test/1IEk8ZgO1iGZ1OILYfRV7C2YHtxK-Rs4xTvDboDm4pII.json',
        type: 'json',
        crossOrigin: true,
        success: init
    });


	return {
		initAsset: initAsset

	};
	

}(window.visualsAssetManager));


export default visualsAssetManager;