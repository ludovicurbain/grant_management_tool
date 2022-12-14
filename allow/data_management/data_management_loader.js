var data_management_tabs=[
	{'label':'Salary caps','name':'salary_caps','fct':'salary_caps'},
	{'label':'Terminal degrees','name':'terminal_degrees','fct':'degree_data'},
	{'label':'Sponsors','name':'sponsors','fct':'sponsor_data'},
	{'label':'Job type','name':'job_category','fct':'job_category_data'},
	{'label':'Account codes','name':'account_code','fct':'account_code_data'},
	{'label':'Other','name':'other','fct':'other_settings'}
];

states['data_management']={
	'default_route':[data_management_tabs[0]['name']],
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

function load_data_management(){
	$('#s_'+global_object['route_url'][0]).html(paint_state_data_management());
	hide_loader();
}