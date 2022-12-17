function paint_state_grants(){
	return create_ui_element({
		'ui_element':{
			'element_class':'tabs',
			'CSSclass':['ui_tab'],
			'selected_tab_items':global_object['route_url'][1],
			'model':grants_tabs
		}
	});
}

function paint_grants(){
	var h=paint_generic_list_edit_iclass_tab('grants');
	return h;
}