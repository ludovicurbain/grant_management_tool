function paint_state_orders(route_url){
	return create_ui_element({
		'ui_element':{
			'element_class':'tabs',
			'CSSclass':['ui_tab'],
			'selected_tab_items':route_url[1],
			'model':data_management_tabs
		}
	});
}

function people_data(){
	var h=paint_generic_list_edit_iclass_tab('people');
	//people + salaries + degrees
	//tree with supervisors on top, drag and drop to put some1 under a supervisor
	return h;
}
function salary_caps(){
	var h=paint_generic_list_edit_iclass_tab('people');
	return h;
}

function degree_data(){
	var h='<div class="title">'+if_app_string('orders')+'</div>';
	return h;
}

function sponsor_data(){
	var h='<div class="title">'+if_app_string('orders')+'</div>';
	//sponsor + address
	return h;
}

function people_type_data(){
	var h='<div class="title">'+if_app_string('products')+'</div>';
	return h;
}

function other_settings(){
	var h='<div class="title">'+if_app_string('other_settings')+'</div>';
	//first month of fiscal year, either January or July

	return h;
}