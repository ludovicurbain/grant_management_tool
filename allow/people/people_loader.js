var people_tabs=[
	{'label':'people','name':'people','fct':'paint_people'}
];

states['people']={
	'default_route':[people_tabs[0]['name']],
	'allowed_routes':[
		get_tab_names(people_tabs),
		function(parameter){return !isNaN(parameter);}
	],
	'label':'People',
	'loader':load_people
};

function get_tab_names(ui_tab_config){
	var a=[];
	for(var i=0;i<ui_tab_config.length;i++){
		a.push(ui_tab_config[i]['name']);
	}
	return a;
}

function load_people(){
	$('#s_'+global_object['route_url'][0]).html(paint_state_people());
	hide_loader();
}