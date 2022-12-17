var global_object = {};

window.onbeforeunload = function () {
	if($('body').attr('has_unsaved_data')=='true'||$('.container_right_state_wrapper[state="documents"] .table_content').attr('has_unsaved_data')=='true'){
		return "Do you really want to leave our brilliant application?"; 
	}else{
		return; 
	}
};

function route(new_route, is_back) {
	cleanup();
	new_route=set_new_route(new_route, is_back);
	enforce_index_html();
	var route_url=document.URL.split('#')[1].split('?')[0].split('|');
	if(!hasProp(states,route_url[0])){
		console.error('unknown route:' + route_url.join('|'));
		return route('#'+Object.keys(states)[0]);
	}
	load_state(route_url,is_back);
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

function load_state(route_url,is_back){
	show_loader(route_url[0]+' - loading...');
	var current_state=states[route_url[0]];
	if(apply_default_route(current_state,route_url)){
		return;
	}
	if(hasProp(current_state,'loader')){
		$('#s_'+route_url[0]).html(current_state['loader'](route_url,is_back));
	}
	select_menu_item(route_url[0]);
}

function apply_default_route(current_state,route_url){
	if(!hasProp(current_state,'default_route')){
		return false;
	}
	var reroute_url='';
	for(var i=0;i<current_state['default_route'].length;i++){
		if(route_url.length<i+2){
			reroute_url+='|'+current_state['default_route'][i];
		}
	}
	if(reroute_url!=''){
		route('#'+route_url[0]+reroute_url,true);
		hide_loader();
	}
	return reroute_url!='';
}

var states={
	'grants':{
		'label':'Grants',
		'loader':function(){
			hide_loader();
			return '';
		}
	},
	'effort_reporting':{
		'label':'Effort Reporting',
		'loader':function(){
			hide_loader();
			return '';
		}
	}
}