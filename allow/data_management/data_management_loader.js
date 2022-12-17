var data_management_tabs=[
	{'label':'people','name':'people','fct':'people_data'},
	{'label':'salary_caps','name':'salary_caps','fct':'salary_caps'},
	{'label':'terminal_degrees','name':'terminal_degrees','fct':'degree_data'},
	{'label':'sponsors','name':'sponsors','fct':'sponsor_data'},
	{'label':'people_type','name':'people_type','fct':'people_type_data'},
	{'label':'other','name':'other','fct':'other_settings'}
];

states['data_management']={
	'default_route':['people'],
	'allowed_routes':[
		get_tab_names(data_management_tabs),
		function(parameter){return !isNaN(parameter);}
	],
	'label':'Settings',
	'loader':load_data_management
};

function get_tab_names(ui_tab_config){
	var a=[];
	for(var i=0;i<ui_tab_config.length;i++){
		a.push(ui_tab_config[i]['name']);
	}
	return a;
}

function load_data_management(route_url){
	$('#s_'+route_url[0]).html(paint_state_orders(route_url));
	hide_loader();
}