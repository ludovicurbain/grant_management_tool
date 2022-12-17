var grants_tabs=[
	{'label':'grants','name':'grants','fct':'paint_grants'}
];

states['grants']={
	'default_route':[grants_tabs[0]['name']],
	'allowed_routes':[
		get_tab_names(grants_tabs),
		function(parameter){return !isNaN(parameter);}
	],
	'label':'Grants',
	'loader':load_grants
};

function get_tab_names(ui_tab_config){
	var a=[];
	for(var i=0;i<ui_tab_config.length;i++){
		a.push(ui_tab_config[i]['name']);
	}
	return a;
}

function load_grants(){
	$('#s_'+global_object['route_url'][0]).html(paint_state_grants());
	hide_loader();
}