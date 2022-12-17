var global_object = {};

window.onbeforeunload = function () {
	if($('body').attr('has_unsaved_data')=='true'||$('.container_right_state_wrapper[state="documents"] .table_content').attr('has_unsaved_data')=='true'){
		return "Do you really want to leave our brilliant application?"; 
	}else{
		return; 
	}
};

painters['states']=function(){
	var h='';
	for(var state in states){
		h+='<div id="s_'+state+'" class="state"></div>';
	}
	return '<div id=states>'+h+'</div>';
}

function route(new_route, is_back) {
	cleanup();
	new_route=set_new_route(new_route, is_back);
	enforce_index_html();
	global_object['route_url']=new_route.replace('#','').split('|');
	if(!hasProp(states,global_object['route_url'][0])){
		console.error('unknown route:' + global_object['route_url'].join('|'));
		return route('#'+Object.keys(states)[0]);
	}
	load_state(is_back);
	return true;
}

function cleanup(){
	$('.modal').remove();
	$('.tooltip').remove();
}

function set_new_route(new_route, is_back){
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
	return new_route;
}

function enforce_index_html(){
	var url=document.URL;
	if(url.indexOf('.html')==-1){
		var query_string=url.split('?');
		var square=url.split('#');
		if(query_string.length>0){
			url=query_string[0]+'index.html'+'?'+query_string[1];
		}else if(square.length>0){
			url=square[0]+'index.html'+'#'+square[1];
		}else{
			url+='index.html';
		}
		history.replaceState('','',url);
	}
}

function load_state(is_back){
	show_loader(global_object['route_url'][0]+' - loading...');
	var current_state=states[global_object['route_url'][0]];
	if(apply_default_route(current_state)){
		return;
	}
	$('.state').hide();
	$('#s_'+global_object['route_url'][0]).html(current_state['loader'](is_back)).show();
	select_menu_item(global_object['route_url'][0]);
}

function apply_default_route(current_state){
	if(!hasProp(current_state,'default_route')){
		return false;
	}
	var reroute_url='';
	for(var i=0;i<current_state['default_route'].length;i++){
		if(global_object['route_url'].length<i+2){
			reroute_url+='|'+current_state['default_route'][i];
		}
	}
	if(reroute_url!=''){
		hide_loader();
		return route('#'+global_object['route_url'][0]+reroute_url);
	}
	return false;
}

var states={
	'grants':{
		'label':'Grants',
		'loader':function(){
			hide_loader();
			return '';
		}
	},
	'people':{
		'label':'People',
		'loader':function(){
			hide_loader();
			return 'people';
		}
	}
}