import {isMobile, isTablet, isDesktop, isCapable} from '../../lib/browser'
import isElementInViewport from '../../lib/isElementInViewport'
import layout1 from './layout-1.html!text'
import layout2 from './layout-2.html!text'



export default function photoGrid(el, ref, data) {
	//console.log(el, ref)
	let module = {
		el: el,
		loaded: false,
		data: data,
		assetType: 'photogrid'
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
		var layout;
		//render diferent layouts
		try{
			if(data.style=='layout1'){
				layout = layout1;
			} else if(data.style=='layout2'){
				layout = layout2;
			}
		}
		catch(e){
			console.log(el, ref)
		}

		data.photos.forEach(function(p){
			var size = (isMobile()) ? 'small' : 'large';
			layout = layout.replace('{{imgsrc}}', p.src + '/' + p[size] +'.jpg');


		})
		layout = layout.replace('{{caption}}', data.caption);

		module.el.innerHTML = layout;


	}








	return module;
}


