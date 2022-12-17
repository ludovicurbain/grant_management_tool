states['data_management']={
	'default_route':['people'],
	'allowed_routes':[
		['people','salaries','terminal_degrees','sponsors','people_type'],
		function(parameter){return !isNaN(parameter);}
	],
	'label':'Settings',
	'loader':load_data_management
};

function load_data_management(route_url){
	$('#s_').html(paint_state_orders(route_data));
	hide_loader();
}