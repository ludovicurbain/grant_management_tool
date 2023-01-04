function paint_state_data_management(){
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
	var iclass='salary_cap';
	var h=create_ui_element({
		'ui_element':{'element_class':'table_list','CSSclass':'generic_item_list','selected_iids':[],'iclass':iclass,'format':{'start_date':'epoch|date|belgian','end_date':'epoch|date|belgian','amount':'accounting_amount|$'}},
		'api_call':{'pa':{'m':'search_item','iclass':iclass,'search':''},'postcontent':{}}
	});
	return h;
}

function degree_data(){
	var h=paint_generic_list_edit_iclass_tab('degree_type');
	return h;
}

function sponsor_data(){
	var iclass='sponsor';
	var h=create_ui_element({
		'ui_element':{'element_class':'table_list','CSSclass':'generic_item_list','selected_iids':[],'iclass':iclass,'hidden':['lat','lng']},
		'api_call':{'pa':{'m':'search_item','iclass':iclass,'search':''},'postcontent':{}}
	});
	return h;
}

function job_category_data(){
	var h=paint_generic_list_edit_iclass_tab('job_category');
	return h;
}

function account_code_data(){
	var iclass='account_code';
	var h=create_ui_element({
		'ui_element':{'element_class':'table_list','CSSclass':'generic_item_list','selected_iids':[],'iclass':iclass,'format':{'salary':'bool','fna_exempt':'bool','fna':'bool'}},
		'api_call':{'pa':{'m':'search_item','iclass':iclass,'search':''},'postcontent':{}}
	});
	return h;
}

function other_settings(){
	var h='<div class="title">'+if_app_string('other_settings')+'</div>';
	//first month of fiscal year, either January or July

	return h;
}