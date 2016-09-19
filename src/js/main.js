import vam from './components/visualsAssetManager/visualsAssetManager'
import mockHTML from './text/mock.html!text';

export function init(el, context, config, mediator) {
   

   if(window.location.hostname != 'localhost'){
		vam.initAsset(el);
   } else {
			// console.log(vam)
		el.innerHTML = mockHTML;
		var figures = el.querySelectorAll('figure');
		[].forEach.call(figures, function(figure){
		    vam.initAsset(figure);
		})
   }  
    
}