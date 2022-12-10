var global_object = {};

window.onbeforeunload = function () {
	if($('body').attr('has_unsaved_data')=='true'||$('.container_right_state_wrapper[state="documents"] .table_content').attr('has_unsaved_data')=='true'){
		return "Do you really want to leave our brilliant application?"; 
	}else{
		return; 
	}
};

function route(new_route, is_back) {
	$('.modal').remove();
	$('.tooltip').remove();
	if (new_route === undefined) {
		new_route = '';
	}
	if (is_back === undefined) {
		is_back = false;
	}
	if (new_route != '' && !is_back) {
		global_object['url']=new_route;
		history.pushState(global_object, new_route,new_route);
	}
	var url=document.URL;
	if(url.indexOf('.html')==-1){
		url+='index.html';
		history.replaceState('','',url);
	}
	var past_the_square=url.split('.html')[1].split('?');
	var route_url = past_the_square[0].split('|');
	route_url[0] = route_url[0].replace('#', '');
	
	show_loader(route_url[0]+' - chargement');
	if(!hasProp(states,route_url[0])){
		console.error('unknown route:' + route_url.join('|'));
		hide_loader();
		return route('#'+Object.keys(states)[0]);
	}
	var content=painters.menu();
	if(hasProp(states[route_url[0]],'function')){
		content+=states[route_url[0]]['function'](route_url,is_back);
	}
	$('#c').html(content);
	select_menu_item(route_url[0]);
	hide_loader();
}

var states={
	'settings':{
		'label':'Settings',
		'function':function(){
			return '';
		}
	},
	'grants':{
		'label':'Grants',
		'function':function(){
			return '';
		}
	},
	'effort_reporting':{
		'label':'Effort Reporting',
		'function':function(){
			return '';
		}
	}
}