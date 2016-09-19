import isElementInViewport from '../../lib/isElementInViewport'
import dividerHTML from './divider.html!text'

export default function divider(el, id) {

	let module = {
		el: el,
		loaded: false,
		assetType: 'divider'
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
		var layout = dividerHTML.replace('{{position}}', id);

		module.el.innerHTML = layout;


	}








	return module;
}


