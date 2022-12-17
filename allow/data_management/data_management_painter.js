function paint_state_orders(){
	return create_ui_element({
		'ui_element':{
			'element_class':'tabs',
			'CSSclass':['ui_tab'],
			'selected_tab_items':global_object['route_url'][1],
			'model':data_management_tabs
		}
	});
}

function salary_caps(){
	var h=paint_generic_list_edit_iclass_tab('salary_cap');
	return h;
}

function degree_data(){
	var h=paint_generic_list_edit_iclass_tab('degree_type');
	return h;
}

function sponsor_data(){
	var h=paint_generic_list_edit_iclass_tab('sponsor');
	//sponsor + address
	return h;
}

function job_category_data(){
	var h=paint_generic_list_edit_iclass_tab('job_category');
	return h;
}

function account_code_data(){
	var h=paint_generic_list_edit_iclass_tab('account_code');
	return h;
}

function other_settings(){
	var h='<div class="title">'+if_app_string('other_settings')+'</div>';
	//first month of fiscal year, either January or July

	return h;
}