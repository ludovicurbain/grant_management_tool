function paint_state_people(){
	return create_ui_element({
		'ui_element':{
			'element_class':'tabs',
			'CSSclass':['ui_tab'],
			'selected_tab_items':global_object['route_url'][1],
			'model':people_tabs
		}
	});
}

function paint_people(){
	var h=create_ui_element({
		'ui_element':{
			'element_class':'tree',
			'CSSclass':'menu',
			'selected_iids':[global_object['route_url'][2]],
			'data_preprocessor':make_people_tree,
			'draggable':true
		},
		'api_call':{'pa':{'m':'get_people_tree'},'postcontent':{}}
	});
	return h;
}

function make_people_tree(data){
	var o={'description':'root','id':0,'children':[]};
	add_root_people(o,data);
	build_tree(o,data);
	return o;
}

function add_root_people(o,data){
	for(var i=0;i<data['people'].length;i++){
		if(data['people'][i]['parent_id']==null){
			o['children'].push({'description':data['people'][i]['child'],'children':[],'id':data['people'][i]['child_id'],'iclass':'people'});
		}
	}
}

function build_tree(o,data){
	for(var j=0;j<data['people'].length;j++){
		for(var k=0;k<o['children'].length;k++){
			if(o['children'][k]['id']==data['people'][j]['parent_id'] && !hasProp(data['people'][j],'done')){
				o['children'][k]['children'].push({'description':data['people'][j]['child'],'children':[],'id':data['people'][j]['child_id'],'iclass':'people'});
				data['people'][j]['done']=true;
				build_tree(o['children'][k],data);
			}
		}
	}
}