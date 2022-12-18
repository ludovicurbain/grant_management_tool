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
	var h=create_ui_element({
			'ui_element':{
				'element_class':'table_list',
				'selected_iids':[],
				'hidden':['iclass'],
				'inline_attributes':['iclass'],
				'CSSclass':'grants',
				'title_button':{
					'1':[
						{'class':'add_grant','label':''}
					],
					'2':[
						{'class':'add_project','label':''},
						{'class':'edit_grant','label':''}							
					]
				}
			},
			'api_call':{
				'pa':{'m':'run_query','id':'','description':'get_projects','db_id':'this'},
				'postcontent':{'query_parameters':{}}
			}
		}
	);
	return h;
}